import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = fileURLToPath(new URL('.', import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '../..');
const targetRoot = resolve(process.argv[2] ?? repositoryRoot);
const contract = JSON.parse(readFileSync(
    join(repositoryRoot, 'data/verification/architecture.json'),
    'utf8',
));
const sourceRoot = join(targetRoot, contract.sourceDirectory);

const isExcluded = (path) => contract.excludedSegments.some(
    (segment) => path.split('/').includes(segment),
);

const walkFiles = (directory) => readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory()
            ? isExcluded(path) ? [] : walkFiles(path)
            : contract.sourceExtensions.includes(extname(entry.name)) ? [path] : [];
    });

const walkDirectories = (directory) => [
    directory,
    ...readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((entry) => {
            const path = join(directory, entry.name);
            return isExcluded(path) ? [] : walkDirectories(path);
        }),
];

const countMatches = (source, pattern) => (
    source.match(new RegExp(pattern, 'g')) ?? []
).length;

const fail = (message, evidence) => ({ message, evidence });

const inspect = () => {
    const files = walkFiles(sourceRoot);
    const sources = files.map((path) => ({
        path,
        text: readFileSync(path, 'utf8'),
    }));
    const rootStores = sources.reduce(
        (count, source) => count + countMatches(source.text, contract.patterns.rootStore),
        0,
    );
    const apiRoots = sources.reduce(
        (count, source) => count + countMatches(source.text, contract.patterns.apiRoot),
        0,
    );
    const directFetch = sources
        .filter(({ text }) => countMatches(text, contract.patterns.directFetch) > 0)
        .map(({ path }) => path);
    const publicApiKey = sources
        .filter(({ text }) => text.includes(contract.patterns.publicApiKey))
        .map(({ path }) => path);
    const longFiles = sources
        .map(({ path, text }) => ({ path, lines: text.split(/\r?\n/u).length }))
        .filter(({ lines }) => lines > contract.maximumSourceLines);
    const broadDirectories = walkDirectories(sourceRoot)
        .map((path) => ({
            path,
            count: readdirSync(path, { withFileTypes: true })
                .filter((entry) => entry.isDirectory())
                .length,
        }))
        .filter(({ count }) => count > contract.maximumDirectSubdomains);

    return [
        rootStores === contract.expectedRootStores
            ? null
            : fail(contract.messages.rootStore, rootStores),
        apiRoots === contract.expectedApiRoots
            ? null
            : fail(contract.messages.apiRoot, apiRoots),
        directFetch.length === 0
            ? null
            : fail(contract.messages.directFetch, directFetch),
        publicApiKey.length === 0
            ? null
            : fail(contract.messages.publicApiKey, publicApiKey),
        longFiles.length === 0
            ? null
            : fail(contract.messages.lineLimit, longFiles),
        broadDirectories.length === 0
            ? null
            : fail(contract.messages.fanOut, broadDirectories),
    ].filter(Boolean);
};

const failures = statSync(sourceRoot).isDirectory()
    ? inspect()
    : [fail(contract.messages.missingSource, sourceRoot)];

failures.forEach(({ message, evidence }) => {
    console.error(`[FAIL] ${message}: ${JSON.stringify(evidence)}`);
});
const reportPass = failures.length === 0
    ? () => console.log(`[PASS] ${contract.messages.passed}`)
    : () => undefined;
reportPass();
process.exitCode = failures.length === 0 ? 0 : 1;
