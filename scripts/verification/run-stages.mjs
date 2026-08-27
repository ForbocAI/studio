import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(scriptDirectory, '../..');
const planPath = resolve(process.argv[2] ?? 'data/verification/stages.json');
const plan = JSON.parse(readFileSync(planPath, 'utf8'));

const commandText = ({ command, arguments: args }) => [command, ...args]
    .map((part) => JSON.stringify(part))
    .join(' ');

const execute = (stage) => {
    const shouldSkip = stage.whenEnvironment
        && !process.env[stage.whenEnvironment];
    console.log(`\n=== ${stage.label} ===`);
    return shouldSkip
        ? (console.log(`[${plan.statuses.skipped}] ${stage.id}`), {
            ...stage,
            outcome: plan.statuses.skipped,
            status: 0,
        })
        : (() => {
            console.log(`$ ${commandText(stage)}`);
            const result = spawnSync(stage.command, stage.arguments, {
                cwd: root,
                env: process.env,
                stdio: 'inherit',
            });
            const passed = result.status === 0;
            const outcome = passed
                ? plan.statuses.passed
                : plan.statuses.failed;
            console.log(`[${outcome}] ${stage.id}`);
            return {
                ...stage,
                outcome,
                status: result.status ?? 1,
            };
        })();
};

console.log(plan.title);
const results = plan.stages.map(execute);
const counts = Object.fromEntries(
    Object.values(plan.statuses).map((status) => [
        status,
        results.filter(({ outcome }) => outcome === status).length,
    ]),
);

console.log('\n=== Verification summary ===');
results.forEach(({ id, label, outcome, status }) => {
    console.log(`${outcome.padEnd(4)} ${id.padEnd(18)} ${label} (exit ${status})`);
});
console.log(JSON.stringify(counts));
process.exitCode = counts[plan.statuses.failed] === 0 ? 0 : 1;
