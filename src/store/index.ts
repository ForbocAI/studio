import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import agentReducer from './slices/agentSlice';
import uiReducer from './slices/uiSlice';
import formReducer from './slices/formSlice';
import { baseApi } from './api';

import { responsiveListener } from './middleware/responsive';
import { errorListener } from './middleware/errorListener';
import logger from 'redux-logger';

const rootReducer = combineReducers({
    agent: agentReducer,
    ui: uiReducer,
    form: formReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});

const persistConfig = {
    key: 'forbocai-studio-root',
    version: 1,
    storage,
    whitelist: ['agent', 'ui'], // Persist agent and UI preferences
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer as unknown as typeof rootReducer,
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
            .concat(baseApi.middleware)
            .prepend(responsiveListener.middleware, errorListener.middleware);

        if (process.env.NODE_ENV === 'development') {
            return middleware.concat(logger as Middleware);
        }

        return middleware;
    },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
