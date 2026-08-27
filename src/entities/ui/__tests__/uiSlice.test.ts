import { describe, expect, it } from 'vitest';
import fixture from '../../../../data/tests/state.json';
import uiData from '../../../../data/workbench/ui.json';
import reducer, {
    activeViewChanged,
    type ActiveView,
    selectActiveView,
    selectIsMobile,
    selectSidebar,
    sidebarToggled,
    viewportChanged,
} from '../uiSlice';

const initialState = reducer(undefined, { type: fixture.structural.unknownAction });

describe(fixture.cases.uiSuite, () => {
    it(fixture.cases.uiInitial, () => {
        expect(initialState).toEqual(uiData.initial);
    });

    it(fixture.cases.uiView, () => {
        const state = reducer(initialState, activeViewChanged(
            fixture.ui.alternateView as ActiveView,
        ));
        expect(selectActiveView({ ui: state })).toBe(fixture.ui.alternateView);
    });

    it(fixture.cases.uiSidebar, () => {
        const state = reducer(initialState, sidebarToggled());
        expect(selectSidebar({ ui: state }).open).toBe(!uiData.initial.sidebar.open);
    });

    it(fixture.cases.uiViewport, () => {
        const state = reducer(initialState, viewportChanged(fixture.ui.mobile));
        expect(selectIsMobile({ ui: state })).toBe(fixture.ui.mobile);
    });
});
