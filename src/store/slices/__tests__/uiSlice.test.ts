import { describe, it, expect } from 'vitest';
import uiReducer, { setActiveView, toggleSidebar, setIsMobile } from '../uiSlice';

describe('uiSlice', () => {
    const initialState = {
        activeView: 'architect' as const,
        showPlayground: true,
        sidebar: {
            open: true,
            openMobile: false,
            isMobile: false,
        },
    };

    it('should handle initial state', () => {
        expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('Given the UI state', () => {
        describe('When setActiveView is dispatched', () => {
            it('Then it should change the active view', () => {
                const nextState = uiReducer(initialState, setActiveView('brain'));
                expect(nextState.activeView).toBe('brain');
            });
        });

        describe('When toggleSidebar is dispatched', () => {
            it('Then it should toggle the open state', () => {
                const nextState = uiReducer(initialState, toggleSidebar());
                expect(nextState.sidebar.open).toBe(false);
            });
        });

        describe('When setIsMobile is dispatched', () => {
            it('Then it should update the isMobile state', () => {
                const nextState = uiReducer(initialState, setIsMobile(true));
                expect(nextState.sidebar.isMobile).toBe(true);
            });
        });
    });
});
