import { spawnSync } from 'node:child_process';
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import planContract from '../../../../data/verification/stages.json';
import fixture from '../../../../data/tests/verification.json';

const root = process.cwd();

interface Stage {
    readonly id: string;
    readonly label: string;
    readonly command: string;
    readonly arguments: readonly string[];
}

const runAggregate = (stage: Stage): void => {
    const directory = mkdtempSync(join(tmpdir(), fixture.architecture.fixturePrefix));
    const marker = join(directory, fixture.aggregate.markerName);
    const planPath = join(directory, fixture.aggregate.planName);
    const sentinelArguments = fixture.aggregate.sentinelArguments.map((argument) =>
        argument === fixture.aggregate.markerToken
            ? marker
            : argument,
    );
    writeFileSync(planPath, JSON.stringify({
        title: fixture.cases.suite,
        statuses: planContract.statuses,
        stages: [
            stage,
            {
                id: fixture.aggregate.sentinelStageId,
                label: fixture.aggregate.sentinelStageLabel,
                command: fixture.aggregate.sentinelCommand,
                arguments: sentinelArguments,
            },
        ],
    }));
    const result = spawnSync(process.execPath, [
        join(root, fixture.aggregate.runner),
        planPath,
    ], {
        cwd: root,
        encoding: fixture.aggregate.encoding as BufferEncoding,
    });
    expect(result.status).toBe(fixture.aggregate.failedStatus);
    expect(existsSync(marker)).toBe(true);
    rmSync(directory, { recursive: true, force: true });
};

const architectureFixture = (extraFile: string, extraSource: string): string => {
    const directory = mkdtempSync(join(tmpdir(), fixture.architecture.fixturePrefix));
    const source = join(directory, fixture.architecture.files.sourceDirectory);
    mkdirSync(source, { recursive: true });
    writeFileSync(
        join(directory, fixture.architecture.files.package),
        fixture.architecture.package,
    );
    writeFileSync(
        join(source, fixture.architecture.files.store),
        fixture.architecture.store,
    );
    writeFileSync(
        join(source, fixture.architecture.files.api),
        fixture.architecture.api,
    );
    writeFileSync(join(source, extraFile), extraSource);
    return directory;
};

const aggregateStage = (
    label: string,
    command: string,
    arguments_: readonly string[],
): Stage => ({
    id: fixture.aggregate.targetStageId,
    label,
    command,
    arguments: arguments_,
});

describe(fixture.cases.suite, () => {
    it(fixture.cases.directFetch, () => {
        const directory = architectureFixture(
            fixture.architecture.files.directFetch,
            fixture.architecture.directFetch,
        );
        runAggregate(aggregateStage(
            fixture.cases.directFetch,
            process.execPath,
            [join(root, fixture.aggregate.architectureGuard), directory],
        ));
        rmSync(directory, { recursive: true, force: true });
    });

    it(fixture.cases.secondStore, () => {
        const directory = architectureFixture(
            fixture.architecture.files.secondStore,
            fixture.architecture.secondStore,
        );
        runAggregate(aggregateStage(
            fixture.cases.secondStore,
            process.execPath,
            [join(root, fixture.aggregate.architectureGuard), directory],
        ));
        rmSync(directory, { recursive: true, force: true });
    });

    it(fixture.cases.fp, () => {
        const directory = mkdtempSync(join(tmpdir(), fixture.architecture.fixturePrefix));
        const source = join(directory, fixture.fp.fileName);
        writeFileSync(source, fixture.fp.source);
        runAggregate(aggregateStage(
            fixture.cases.fp,
            process.execPath,
            [join(root, fixture.aggregate.fpGuard), source],
        ));
        rmSync(directory, { recursive: true, force: true });
    });

    [
        fixture.cases.lint,
        fixture.cases.tests,
        fixture.cases.build,
    ].forEach((label) => {
        it(label, () => runAggregate(aggregateStage(
            label,
            fixture.aggregate.failureCommand,
            fixture.aggregate.failureArguments,
        )));
    });
});
