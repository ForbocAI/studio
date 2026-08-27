"use client";

import { useEffect, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import uiData from '../../../data/workbench/ui.json';
import { persistor, store } from '@/store';
import { useAppDispatch } from '@/store/hooks';
import {
    sidebarToggled,
    viewportChanged,
} from '@/entities/ui/uiSlice';

const mediaQuery = `(max-width: ${uiData.responsive.maximumMobileWidthPixels}px)`;
const mediaChangeEvent = uiData.responsive.events.change as 'change';
const keydownEvent = uiData.responsive.events.keydown as 'keydown';

const WorkbenchWindowBridge = (): null => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const media = window.matchMedia(mediaQuery);
        const synchronizeViewport = (): void => {
            dispatch(viewportChanged(media.matches));
        };
        const handleShortcut = (event: KeyboardEvent): void => {
            const matches = event.key === uiData.responsive.sidebarShortcutKey
                && (event.metaKey || event.ctrlKey);
            const applyShortcut = matches
                ? () => {
                    event.preventDefault();
                    dispatch(sidebarToggled());
                }
                : () => undefined;
            applyShortcut();
        };

        media.addEventListener(mediaChangeEvent, synchronizeViewport);
        window.addEventListener(keydownEvent, handleShortcut);
        synchronizeViewport();

        return () => {
            media.removeEventListener(mediaChangeEvent, synchronizeViewport);
            window.removeEventListener(keydownEvent, handleShortcut);
        };
    }, [dispatch]);

    return null;
};

export const ReduxProvider = ({ children }: { readonly children: ReactNode }) => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <WorkbenchWindowBridge />
            {children}
        </PersistGate>
    </Provider>
);
