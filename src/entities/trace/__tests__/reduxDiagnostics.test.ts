import { describe, expect, it } from 'vitest';
import diagnostics from '../../../../data/diagnostics/redux.json';
import fixture from '../../../../data/tests/diagnostics.json';
import {
    shouldLogReduxDiagnostics,
    summarizeReduxAction,
    summarizeReduxState,
} from '../reduxDiagnostics';

const serialized = (value: unknown): string => JSON.stringify(value);

describe(fixture.cases.suite, () => {
    it(fixture.cases.action, () => {
        const summary = summarizeReduxAction(fixture.action);
        expect(summary.type).toBe(fixture.action.type);
        expect(summary.endpoint).toBe(fixture.action.meta.arg.endpointName);
        expect(serialized(summary)).not.toContain(fixture.secret);
    });

    it(fixture.cases.state, () => {
        const summary = summarizeReduxState(fixture.state);
        expect(summary).toMatchObject(fixture.expected.summary);
    });

    it(fixture.cases.serialized, () => {
        expect(serialized(summarizeReduxState(fixture.state))).not.toContain(
            fixture.secret,
        );
    });

    it(fixture.cases.predicateDisabled, () => {
        expect(shouldLogReduxDiagnostics()).toBe(false);
    });

    it(fixture.cases.predicateEnabled, () => {
        expect(shouldLogReduxDiagnostics(diagnostics.enabledValue)).toBe(true);
    });
});
