import { describe, it, expect } from 'vitest';
import agentReducer, { setName, setArchetype, setDirective, addAction, removeAction } from '../agentSlice';
import agentData from '../../../../data/workbench/agent.json';

describe('agentSlice', () => {
    const initialState = {
        ...agentData,
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
                const [removed, ...remaining] = agentData.actions;
                const nextState = agentReducer(initialState, removeAction(removed.id));
                expect(nextState.actions).toHaveLength(remaining.length);
                expect(nextState.actions.find(({ id }) => id === removed.id)).toBeUndefined();
            });
        });
    });
});
