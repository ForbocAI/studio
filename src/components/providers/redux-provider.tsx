"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { initResponsive } from '@/store/middleware/responsive';

store.dispatch(initResponsive);

export function ReduxProvider({ children }: { children: React.ReactNode }) {

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
