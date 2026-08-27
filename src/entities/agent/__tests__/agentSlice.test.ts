import { describe, expect, it } from 'vitest';
import agentData from '../../../../data/workbench/agent.json';
import fixture from '../../../../data/tests/state.json';
import reducer, {
    agentActionAdded,
    agentActionRemoved,
    agentNameChanged,
    selectAgent,
} from '../agentSlice';

const initialState = reducer(undefined, { type: fixture.structural.unknownAction });

describe(fixture.cases.agentSuite, () => {
    it(fixture.cases.agentInitial, () => {
        expect(selectAgent({ agent: initialState })).toEqual(agentData);
    });

    it(fixture.cases.agentName, () => {
        const state = reducer(initialState, agentNameChanged(fixture.agent.updatedName));
        expect(selectAgent({ agent: state }).name).toBe(fixture.agent.updatedName);
    });

    it(fixture.cases.agentAction, () => {
        const state = reducer(initialState, agentActionAdded(fixture.agent.action));
        expect(selectAgent({ agent: state }).actions.at(
            fixture.structural.lastIndex,
        )).toEqual(fixture.agent.action);
    });

    it(fixture.cases.agentRemoveAction, () => {
        const action = agentData.actions[fixture.structural.firstIndex];
        const state = reducer(initialState, agentActionRemoved(action.id));
        expect(selectAgent({ agent: state }).actions).not.toContainEqual(action);
    });
});
