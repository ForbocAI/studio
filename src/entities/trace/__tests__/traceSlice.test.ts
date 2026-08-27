import { describe, expect, it } from 'vitest';
import diagnostics from '../../../../data/diagnostics/redux.json';
import fixture from '../../../../data/tests/state.json';
import reducer, {
    selectProtocolTraces,
    traceCompleted,
    traceStarted,
    traceStatuses,
} from '../traceSlice';

const initialState = reducer(undefined, { type: fixture.structural.unknownAction });
const start = (id: string, startedAt: number) => traceStarted({
    id,
    operation: fixture.trace.operation,
    status: traceStatuses.pending,
    startedAt,
});

describe(fixture.cases.traceSuite, () => {
    it(fixture.cases.traceLifecycle, () => {
        const pending = reducer(initialState, start(
            fixture.trace.requestId,
            fixture.trace.startedAt,
        ));
        const state = reducer(pending, traceCompleted({
            requestId: fixture.trace.requestId,
            completedAt: fixture.trace.completedAt,
            status: traceStatuses.fulfilled,
        }));
        const [trace] = selectProtocolTraces({ trace: state });
        expect(trace.durationMilliseconds).toBe(
            fixture.trace.completedAt - fixture.trace.startedAt,
        );
    });

    it(fixture.cases.traceLimit, () => {
        const count = diagnostics.traceLimit + fixture.trace.overflow;
        const state = Array.from({ length: count }).reduce<
            ReturnType<typeof reducer>
        >(
            (current, _, index) => reducer(current, start(String(index), index)),
            initialState,
        );
        expect(selectProtocolTraces({ trace: state })).toHaveLength(
            diagnostics.traceLimit,
        );
    });
});
