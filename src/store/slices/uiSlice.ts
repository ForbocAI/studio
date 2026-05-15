import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

export type ActiveView = 'architect' | 'brain' | 'trace';

interface UIState {
    activeView: ActiveView;
    showPlayground: boolean;
    sidebar: {
        open: boolean;
        openMobile: boolean;
        isMobile: boolean;
    };
}

const initialState: UIState = {
    activeView: 'architect',
    showPlayground: true,
    sidebar: {
        open: true,
        openMobile: false,
        isMobile: false,
    },
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveView: (state, action: PayloadAction<ActiveView>) => {
            state.activeView = action.payload;
        },
        setShowPlayground: (state, action: PayloadAction<boolean>) => {
            state.showPlayground = action.payload;
        },
        togglePlayground: (state) => {
            state.showPlayground = !state.showPlayground;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebar.open = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebar.open = !state.sidebar.open;
        },
        setSidebarOpenMobile: (state, action: PayloadAction<boolean>) => {
            state.sidebar.openMobile = action.payload;
        },
        toggleSidebarMobile: (state) => {
            state.sidebar.openMobile = !state.sidebar.openMobile;
        },
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.sidebar.isMobile = action.payload;
        },
    },
});

export const {
    setActiveView,
    setShowPlayground,
    togglePlayground,
    setSidebarOpen,
    toggleSidebar,
    setSidebarOpenMobile,
    toggleSidebarMobile,
    setIsMobile
} = uiSlice.actions;

// Selectors
const selectUI = (state: any) => state.ui;

export const selectActiveView = createSelector(selectUI, (ui) => ui.activeView as ActiveView);
export const selectShowPlayground = createSelector(selectUI, (ui) => ui.showPlayground as boolean);
export const selectSidebar = createSelector(selectUI, (ui) => ui.sidebar);
export const selectIsMobile = createSelector(selectSidebar, (sidebar) => sidebar.isMobile as boolean);

export default uiSlice.reducer;
