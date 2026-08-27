import {
    createEntityAdapter,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { fromNullable, match } from '@forbocai/core';
import diagnostics from '../../../data/diagnostics/redux.json';

export type TraceStatus = keyof typeof diagnostics.statuses;

export const traceStatuses = diagnostics.statuses as Readonly<
    Record<TraceStatus, TraceStatus>
>;

export interface ProtocolTrace {
    readonly id: string;
    readonly operation: string;
    readonly status: TraceStatus;
    readonly startedAt: number;
    readonly completedAt?: number;
    readonly durationMilliseconds?: number;
}

interface TraceCompletion {
    readonly requestId: string;
    readonly completedAt: number;
    readonly status: TraceStatus;
}

const traceAdapter = createEntityAdapter<ProtocolTrace>({
    sortComparer: (left, right) => right.startedAt - left.startedAt,
});
const initialState = traceAdapter.getInitialState();

const enforceTraceLimit = (state: typeof initialState): void => {
    const staleIds = state.ids.slice(diagnostics.traceLimit);
    const enforce = staleIds.length > 0
        ? () => traceAdapter.removeMany(state, staleIds)
        : () => undefined;
    enforce();
};

export const traceSlice = createSlice({
    name: 'trace',
    initialState,
    reducers: {
        traceStarted: (state, action: PayloadAction<ProtocolTrace>) => {
            traceAdapter.addOne(state, action.payload);
            enforceTraceLimit(state);
        },
        traceCompleted: (state, action: PayloadAction<TraceCompletion>) => {
            match(
                fromNullable(state.entities[action.payload.requestId]),
                (current) => traceAdapter.updateOne(state, {
                    id: current.id,
                    changes: {
                        status: action.payload.status,
                        completedAt: action.payload.completedAt,
                        durationMilliseconds: action.payload.completedAt - current.startedAt,
                    },
                }),
                () => undefined,
            );
        },
        tracesCleared: traceAdapter.removeAll,
    },
});

export const { traceStarted, traceCompleted, tracesCleared } = traceSlice.actions;

interface TraceRootState {
    readonly trace: typeof initialState;
}

const selectors = traceAdapter.getSelectors((state: TraceRootState) => state.trace);

export const selectProtocolTraces = selectors.selectAll;
export const selectLatestTrace = (state: TraceRootState): ProtocolTrace | undefined =>
    selectors.selectAll(state)[0];

export default traceSlice.reducer;
