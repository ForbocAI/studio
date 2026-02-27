import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AgentAction {
    id: string;
    name: string;
}

interface AgentState {
    name: string;
    archetype: string;
    directive: string;
    actions: AgentAction[];
    setName: (name: string) => void;
    setArchetype: (archetype: string) => void;
    setDirective: (directive: string) => void;
    addAction: (name: string) => void;
    removeAction: (id: string) => void;
}

export const useAgentStore = create<AgentState>()(
    persist(
        (set) => ({
            name: 'Malakor the Wise',
            archetype: 'Scholar',
            directive: 'Provide deep insights and historical context with a touch of arcane mystery.',
            actions: [
                { id: '1', name: 'scout_area' },
                { id: '2', name: 'cast_spell' },
                { id: '3', name: 'query_lore' },
            ],
            setName: (name) => set({ name }),
            setArchetype: (archetype) => set({ archetype }),
            setDirective: (directive) => set({ directive }),
            addAction: (name) => set((state) => ({
                actions: [...state.actions, { id: Math.random().toString(36).substr(2, 9), name }]
            })),
            removeAction: (id) => set((state) => ({
                actions: state.actions.filter(a => a.id !== id)
            })),
        }),
        {
            name: 'forbocai-agent-storage',
        }
    )
);
