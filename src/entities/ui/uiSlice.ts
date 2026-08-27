import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import uiData from '../../../data/workbench/ui.json';

export type ActiveView = 'architect' | 'brain' | 'trace';

interface SidebarState {
    readonly open: boolean;
    readonly openMobile: boolean;
    readonly isMobile: boolean;
}

interface UIState {
    readonly activeView: ActiveView;
    readonly showPlayground: boolean;
    readonly sidebar: SidebarState;
}

const initialState: UIState = {
    ...uiData.initial,
    activeView: uiData.initial.activeView as ActiveView,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        activeViewChanged: (state, action: PayloadAction<ActiveView>) => {
            state.activeView = action.payload;
        },
        playgroundVisibilityChanged: (state, action: PayloadAction<boolean>) => {
            state.showPlayground = action.payload;
        },
        sidebarVisibilityChanged: (state, action: PayloadAction<boolean>) => {
            state.sidebar.open = action.payload;
        },
        sidebarToggled: (state) => {
            state.sidebar.open = !state.sidebar.open;
        },
        mobileSidebarVisibilityChanged: (state, action: PayloadAction<boolean>) => {
            state.sidebar.openMobile = action.payload;
        },
        mobileSidebarToggled: (state) => {
            state.sidebar.openMobile = !state.sidebar.openMobile;
        },
        viewportChanged: (state, action: PayloadAction<boolean>) => {
            state.sidebar.isMobile = action.payload;
        },
    },
});

export const {
    activeViewChanged,
    playgroundVisibilityChanged,
    sidebarVisibilityChanged,
    sidebarToggled,
    mobileSidebarVisibilityChanged,
    mobileSidebarToggled,
    viewportChanged,
} = uiSlice.actions;

interface UIRootState {
    readonly ui: UIState;
}

export const selectActiveView = (state: UIRootState): ActiveView =>
    state.ui.activeView;
export const selectShowPlayground = (state: UIRootState): boolean =>
    state.ui.showPlayground;
export const selectSidebar = (state: UIRootState): SidebarState =>
    state.ui.sidebar;
export const selectIsMobile = (state: UIRootState): boolean =>
    state.ui.sidebar.isMobile;

export default uiSlice.reducer;
