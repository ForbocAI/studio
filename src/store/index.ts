import {
    combineReducers,
    configureStore,
    type Middleware,
} from '@reduxjs/toolkit';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createLogger } from 'redux-logger';
import uiData from '../../data/workbench/ui.json';
import agentReducer from '@/entities/agent/agentSlice';
import chatReducer from '@/entities/chat/chatSlice';
import traceReducer from '@/entities/trace/traceSlice';
import uiReducer from '@/entities/ui/uiSlice';
import { traceListener } from '@/entities/trace/traceListener';
import {
    shouldLogReduxDiagnostics,
    summarizeReduxAction,
    summarizeReduxState,
} from '@/entities/trace/reduxDiagnostics';
import { baseApi } from './api';

const rootReducer = combineReducers({
    agent: agentReducer,
    chat: chatReducer,
    trace: traceReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

const persistedReducer = persistReducer({
    key: uiData.persistence.key,
    version: uiData.persistence.version,
    storage,
    whitelist: uiData.persistence.slices,
}, rootReducer);

const diagnosticLogger = createLogger({
    collapsed: true,
    duration: true,
    timestamp: false,
    predicate: () => shouldLogReduxDiagnostics(),
    actionTransformer: summarizeReduxAction,
    stateTransformer: summarizeReduxState,
}) as unknown as Middleware;

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    })
        .prepend(traceListener.middleware)
        .concat(baseApi.middleware, diagnosticLogger),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
