import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(scriptDirectory, '../..');
const contract = JSON.parse(readFileSync(
    join(root, 'data/verification/fp-exceptions.json'),
    'utf8',
));
const classifiedCandidates = [
    process.env.STUDIO_CLASSIFIED_DIR,
    resolve(root, '../classified'),
    resolve(root, 'classified-checkout'),
].filter(Boolean);
const classified = classifiedCandidates.find((candidate) => existsSync(
    join(candidate, 'scripts/check-fp-conformance.sh'),
));

const walkSource = (directory) => readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory()
            ? entry.name === '__tests__' ? [] : walkSource(path)
            : ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts']
                .includes(extname(path)) ? [path] : [];
    });

const files = process.argv.slice(2).length > 0
    ? process.argv.slice(2).map((path) => resolve(path))
    : walkSource(join(root, 'src'));
const checker = classified
    ? join(classified, 'scripts/check-fp-conformance.sh')
    : '';
const result = classified
    ? spawnSync('bash', [checker, ...files], {
        cwd: root,
        encoding: 'utf8',
        maxBuffer: 32 * 1024 * 1024,
    })
    : { status: 1, stdout: '', stderr: contract.messages.missingClassified };
const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
process.stdout.write(output);

const allowed = new Set(contract.exceptions.map(({ warning }) => warning));
const unexpected = output
    .split(/\r?\n/u)
    .filter((line) => line.startsWith('[warn] '))
    .map((line) => line.slice('[warn] '.length))
    .filter((warning) => !allowed.has(warning));

unexpected.forEach((warning) => {
    console.error(`[FAIL] ${contract.messages.unexpectedWarning}: ${warning}`);
});
const passed = result.status === 0 && unexpected.length === 0;
const reportPass = passed
    ? () => console.log(`[PASS] ${contract.messages.passed}`)
    : () => undefined;
reportPass();
process.exitCode = passed ? 0 : 1;
