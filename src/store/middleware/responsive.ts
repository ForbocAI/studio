import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setIsMobile } from '../slices/uiSlice';

export const responsiveListener = createListenerMiddleware();

// This action doesn't exist yet, we'll use it to initialize
export const initResponsive = { type: 'ui/initResponsive' };

responsiveListener.startListening({
    matcher: (action: any): action is any => action.type === 'ui/initResponsive',
    effect: async (action, listenerApi) => {
        if (typeof window === 'undefined') return;

        const MOBILE_BREAKPOINT = 768;
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

        const update = () => {
            listenerApi.dispatch(setIsMobile(window.innerWidth < MOBILE_BREAKPOINT));
        };

        mql.addEventListener('change', update);
        update(); // Initial check

        // Add keyboard shortcut for sidebar (⌘B / Ctrl+B)
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === 'b' &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault();
                listenerApi.dispatch({ type: 'ui/toggleSidebar' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // This listener effect runs once upon initialization and sets up event listeners.
        // It doesn't need to return or cancel unless the app unmounts, which it won't here as it's root middleware.
    },
});
