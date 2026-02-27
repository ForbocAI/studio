import { describe, it, expect } from 'vitest';
import formReducer, { setAgentChatInput, addAgentMessage, resetAgentChat } from '../formSlice';

describe('formSlice', () => {
    const initialState = {
        agentChat: {
            input: '',
            messages: [],
            error: null,
        },
    };

    it('should handle initial state', () => {
        expect(formReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('Given the agent chat form', () => {
        describe('When setAgentChatInput is dispatched', () => {
            it('Then it should update the input string', () => {
                const nextState = formReducer(initialState, setAgentChatInput('Hello World'));
                expect(nextState.agentChat.input).toBe('Hello World');
            });
        });

        describe('When addAgentMessage is dispatched', () => {
            it('Then it should add a message to the history', () => {
                const message = { id: '1', role: 'user' as const, content: 'Hi' };
                const nextState = formReducer(initialState, addAgentMessage(message));
                expect(nextState.agentChat.messages).toHaveLength(1);
                expect(nextState.agentChat.messages[0]).toEqual(message);
            });
        });

        describe('When resetAgentChat is dispatched', () => {
            it('Then it should clear input and messages', () => {
                const dirtyState = {
                    agentChat: {
                        input: 'some text',
                        messages: [{ id: '1', role: 'user' as const, content: 'Hi' }],
                        error: 'legacy error'
                    }
                };
                const nextState = formReducer(dirtyState, resetAgentChat());
                expect(nextState.agentChat).toEqual(initialState.agentChat);
            });
        });
    });
});
