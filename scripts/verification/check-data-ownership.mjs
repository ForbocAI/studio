import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const scriptDirectory = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(scriptDirectory, '../..');
const contract = JSON.parse(readFileSync(
    join(root, 'data/verification/data-ownership.json'),
    'utf8',
));

const walk = (directory) => readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });

const jsonFailures = contract.jsonRoots
    .flatMap((directory) => walk(join(root, directory)))
    .filter((path) => extname(path) === '.json')
    .flatMap((path) => {
        try {
            JSON.parse(readFileSync(path, 'utf8'));
            return [];
        } catch (error) {
            return [`${contract.messages.invalidJson}: ${path}: ${String(error)}`];
        }
    });

const isModuleSpecifier = (node) => (
    ts.isImportDeclaration(node.parent)
    || ts.isExportDeclaration(node.parent)
) && node.parent.moduleSpecifier === node;

const isAllowedLiteral = (node) => isModuleSpecifier(node)
    || ts.isLiteralTypeNode(node.parent)
    || (ts.isPropertyAssignment(node.parent) && node.parent.name === node);

const literalFailures = contract.testRoots
    .flatMap((directory) => walk(join(root, directory)))
    .filter((path) => contract.testSuffixes.some((suffix) => path.endsWith(suffix)))
    .flatMap((path) => {
        const source = ts.createSourceFile(
            path,
            readFileSync(path, 'utf8'),
            ts.ScriptTarget.Latest,
            true,
            path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
        );
        const failures = [];
        const visit = (node) => {
            const isSemanticString = ts.isStringLiteral(node) && !isAllowedLiteral(node);
            const isSemanticNumber = ts.isNumericLiteral(node);
            failures.push(...(
                isSemanticString || isSemanticNumber
                    ? [`${contract.messages.testLiteral}: ${path}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`]
                    : []
            ));
            ts.forEachChild(node, visit);
        };
        visit(source);
        return failures;
    });

const sourceFailures = contract.sourceRoots
    .flatMap((directory) => walk(join(root, directory)))
    .filter((path) => ['.js', '.jsx', '.mjs', '.ts', '.tsx'].includes(extname(path)))
    .flatMap((path) => {
        const text = readFileSync(path, 'utf8');
        return contract.forbiddenSourcePatterns
            .filter(({ value }) => text.includes(value))
            .map(({ value, reason }) =>
                `${contract.messages.forbiddenSource}: ${path}: ${value}: ${reason}`,
            );
    });

const failures = [...jsonFailures, ...literalFailures, ...sourceFailures];
failures.forEach((failure) => console.error(`[FAIL] ${failure}`));
const reportPass = failures.length === 0
    ? () => console.log(`[PASS] ${contract.messages.passed}`)
    : () => undefined;
reportPass();
process.exitCode = failures.length === 0 ? 0 : 1;
