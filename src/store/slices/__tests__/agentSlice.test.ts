import { describe, it, expect } from 'vitest';
import agentReducer, { setName, setArchetype, setDirective, addAction, removeAction } from '../agentSlice';

describe('agentSlice', () => {
    const initialState = {
        name: 'Malakor the Wise',
        archetype: 'Scholar',
        directive: 'Provide deep insights and historical context with a touch of arcane mystery.',
        actions: [
            { id: '1', name: 'scout_area' },
            { id: '2', name: 'cast_spell' },
            { id: '3', name: 'query_lore' },
        ],
    };

    it('should handle initial state', () => {
        expect(agentReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('Given an agent', () => {
        describe('When setName is dispatched', () => {
            it('Then it should update the name', () => {
                const nextState = agentReducer(initialState, setName('Master Control'));
                expect(nextState.name).toBe('Master Control');
            });
        });

        describe('When setArchetype is dispatched', () => {
            it('Then it should update the archetype', () => {
                const nextState = agentReducer(initialState, setArchetype('Infiltrator'));
                expect(nextState.archetype).toBe('Infiltrator');
            });
        });

        describe('When addAction is dispatched', () => {
            it('Then it should add a new action to the list with a generated ID', () => {
                const actionName = 'Scan Grid';
                const nextState = agentReducer(initialState, addAction(actionName));
                expect(nextState.actions).toHaveLength(4);
                expect(nextState.actions[nextState.actions.length - 1].name).toBe(actionName);
                expect(nextState.actions[nextState.actions.length - 1].id).toBeDefined();
            });
        });

        describe('When removeAction is dispatched', () => {
            it('Then it should remove the action by id', () => {
                const nextState = agentReducer(initialState, removeAction('1'));
                expect(nextState.actions).toHaveLength(2);
                expect(nextState.actions.find(a => a.id === '1')).toBeUndefined();
            });
        });
    });
});
