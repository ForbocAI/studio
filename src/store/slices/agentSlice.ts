import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

interface AgentAction {
    id: string;
    name: string;
}

interface AgentState {
    name: string;
    archetype: string;
    directive: string;
    actions: AgentAction[];
}

const initialState: AgentState = {
    name: 'Malakor the Wise',
    archetype: 'Scholar',
    directive: 'Provide deep insights and historical context with a touch of arcane mystery.',
    actions: [
        { id: '1', name: 'scout_area' },
        { id: '2', name: 'cast_spell' },
        { id: '3', name: 'query_lore' },
    ],
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
        addAction: (state, action: PayloadAction<string>) => {
            state.actions.push({
                id: Math.random().toString(36).substr(2, 9),
                name: action.payload,
            });
        },
        removeAction: (state, action: PayloadAction<string>) => {
            state.actions = state.actions.filter((a) => a.id !== action.payload);
        },
        exportSoul: (state) => {
            // This is a semantic action that listeners can react to
            console.log("Exporting Soul to Arweave...");
        },
    },
});

export const { setName, setArchetype, setDirective, addAction, removeAction, exportSoul } = agentSlice.actions;

// Selectors
const selectSelf = (state: any) => state.agent;

export const selectAgent = createSelector(selectSelf, (agent) => agent);
export const selectAgentName = createSelector(selectSelf, (agent) => agent.name as string);
export const selectAgentArchetype = createSelector(selectSelf, (agent) => agent.archetype as string);
export const selectAgentDirective = createSelector(selectSelf, (agent) => agent.directive as string);
export const selectAgentActions = createSelector(selectSelf, (agent) => agent.actions);

export default agentSlice.reducer;
