import {
    createEntityAdapter,
    createSelector,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { fromNullable, match } from '@forbocai/core';
import agentData from '../../../data/workbench/agent.json';

export interface AgentAction {
    readonly id: string;
    readonly name: string;
}

export interface AgentManifest {
    readonly id: string;
    readonly name: string;
    readonly archetype: string;
    readonly directive: string;
    readonly actions: readonly AgentAction[];
}

const agentAdapter = createEntityAdapter<AgentManifest>();

const initialState = agentAdapter.addOne(
    agentAdapter.getInitialState({ activeId: agentData.id }),
    agentData,
);

const updateActiveAgent = (
    state: typeof initialState,
    changes: Partial<AgentManifest>,
): void => {
    agentAdapter.updateOne(state, { id: state.activeId, changes });
};

export const agentSlice = createSlice({
    name: 'agent',
    initialState,
    reducers: {
        agentNameChanged: (state, action: PayloadAction<string>) => {
            updateActiveAgent(state, { name: action.payload });
        },
        agentArchetypeChanged: (state, action: PayloadAction<string>) => {
            updateActiveAgent(state, { archetype: action.payload });
        },
        agentDirectiveChanged: (state, action: PayloadAction<string>) => {
            updateActiveAgent(state, { directive: action.payload });
        },
        agentActionAdded: (state, action: PayloadAction<AgentAction>) => {
            match(
                fromNullable(state.entities[state.activeId]),
                (active) => updateActiveAgent(state, {
                    actions: [...active.actions, action.payload],
                }),
                () => undefined,
            );
        },
        agentActionRemoved: (state, action: PayloadAction<string>) => {
            match(
                fromNullable(state.entities[state.activeId]),
                (active) => updateActiveAgent(state, {
                    actions: active.actions.filter(({ id }) => id !== action.payload),
                }),
                () => undefined,
            );
        },
    },
});

export const {
    agentNameChanged,
    agentArchetypeChanged,
    agentDirectiveChanged,
    agentActionAdded,
    agentActionRemoved,
} = agentSlice.actions;

interface AgentRootState {
    readonly agent: typeof initialState;
}

const selectors = agentAdapter.getSelectors(
    (state: AgentRootState) => state.agent,
);
const selectActiveId = (state: AgentRootState): string => state.agent.activeId;

export const selectAgent = createSelector(
    [selectors.selectEntities, selectActiveId],
    (entities, activeId) => entities[activeId] ?? agentData,
);

export default agentSlice.reducer;
