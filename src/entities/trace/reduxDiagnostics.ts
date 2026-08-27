import diagnostics from '../../../data/diagnostics/redux.json';

type UnknownRecord = Readonly<Record<string, unknown>>;

const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === 'object' && Boolean(value) && !Array.isArray(value);

const asRecord = (value: unknown): UnknownRecord => isRecord(value) ? value : {};

const recordCount = (value: unknown): number => Object.keys(asRecord(value)).length;

const entityCount = (value: unknown): number => {
    const ids = asRecord(value).ids;
    return Array.isArray(ids) ? ids.length : 0;
};

export const summarizeReduxAction = (value: unknown): UnknownRecord => {
    const action = asRecord(value);
    const meta = asRecord(action.meta);
    const argument = asRecord(meta.arg);
    return {
        type: typeof action.type === 'string'
            ? action.type
            : diagnostics.unknownAction,
        endpoint: typeof argument.endpointName === 'string'
            ? argument.endpointName
            : undefined,
        requestStatus: typeof meta.requestStatus === 'string'
            ? meta.requestStatus
            : undefined,
    };
};

export const summarizeReduxState = (value: unknown): UnknownRecord => {
    const state = asRecord(value);
    const api = asRecord(state.api);
    return {
        slices: Object.keys(state).sort(),
        entityCounts: {
            agents: entityCount(state.agent),
            messages: entityCount(state.chat),
            traces: entityCount(state.trace),
        },
        requestCounts: {
            queries: recordCount(api.queries),
            mutations: recordCount(api.mutations),
        },
    };
};

export const shouldLogReduxDiagnostics = (
    configuredValue = process.env.NEXT_PUBLIC_STUDIO_REDUX_LOGGING,
): boolean => configuredValue === diagnostics.enabledValue;
