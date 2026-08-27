import {
    createListenerMiddleware,
    type UnknownAction,
} from '@reduxjs/toolkit';
import diagnostics from '../../../data/diagnostics/redux.json';
import {
    traceCompleted,
    traceStarted,
    traceStatuses,
    type TraceStatus,
} from './traceSlice';

interface StudioLifecycleAction extends UnknownAction {
    readonly meta: {
        readonly requestId: string;
        readonly requestStatus: TraceStatus;
        readonly arg: {
            readonly endpointName: string;
        };
    };
}

type UnknownRecord = Readonly<Record<string, unknown>>;

const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === 'object' && Boolean(value) && !Array.isArray(value);

const isStudioLifecycle = (
    action: UnknownAction,
    status: TraceStatus,
): action is StudioLifecycleAction => {
    const meta = isRecord(action.meta) ? action.meta : {};
    const argument = isRecord(meta.arg) ? meta.arg : {};
    return typeof meta.requestId === 'string'
        && meta.requestStatus === status
        && typeof argument.endpointName === 'string'
        && diagnostics.operations.includes(argument.endpointName);
};

export const traceListener = createListenerMiddleware();

traceListener.startListening({
    matcher: (action): action is StudioLifecycleAction =>
        isStudioLifecycle(action, traceStatuses.pending),
    effect: (action, listenerApi) => {
        listenerApi.dispatch(traceStarted({
            id: action.meta.requestId,
            operation: action.meta.arg.endpointName,
            status: traceStatuses.pending,
            startedAt: Date.now(),
        }));
    },
});

traceListener.startListening({
    matcher: (action): action is StudioLifecycleAction =>
        isStudioLifecycle(action, traceStatuses.fulfilled)
        || isStudioLifecycle(action, traceStatuses.rejected),
    effect: (action, listenerApi) => {
        listenerApi.dispatch(traceCompleted({
            requestId: action.meta.requestId,
            completedAt: Date.now(),
            status: action.meta.requestStatus,
        }));
    },
});
