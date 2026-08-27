import { createSlice, PayloadAction, createSelector, nanoid } from '@reduxjs/toolkit';
import agentData from '../../../data/workbench/agent.json';

export interface AgentAction {
    id: string;
    name: string;
}

export interface AgentState {
    id: string;
    name: string;
    archetype: string;
    directive: string;
    actions: AgentAction[];
}

const initialState: AgentState = {
    id: agentData.id,
    name: agentData.name,
    archetype: agentData.archetype,
    directive: agentData.directive,
    actions: agentData.actions,
};

export const agentSlice = createSlice({
    name: 'agent',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setArchetype: (state, action: PayloadAction<string>) => {
            state.archetype = action.payload;
        },
        setDirective: (state, action: PayloadAction<string>) => {
            state.directive = action.payload;
        },
        addAction: {
            reducer: (state, action: PayloadAction<AgentAction>) => {
                state.actions.push(action.payload);
            },
            prepare: (name: string) => ({
                payload: {
                    id: nanoid(),
                    name,
                },
            }),
        },
        removeAction: (state, action: PayloadAction<string>) => {
            state.actions = state.actions.filter((a) => a.id !== action.payload);
        },
    },
});

export const { setName, setArchetype, setDirective, addAction, removeAction } = agentSlice.actions;

// Selectors
const selectSelf = (state: { agent: AgentState }) => state.agent;

export const selectAgent = createSelector(selectSelf, (agent) => agent);
export const selectAgentName = createSelector(selectSelf, (agent) => agent.name as string);
export const selectAgentArchetype = createSelector(selectSelf, (agent) => agent.archetype as string);
export const selectAgentDirective = createSelector(selectSelf, (agent) => agent.directive as string);
export const selectAgentActions = createSelector(selectSelf, (agent) => agent.actions);

export default agentSlice.reducer;
