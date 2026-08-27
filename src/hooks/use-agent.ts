import { useAppDispatch, useAppSelector } from './../store/hooks';
import { setAgentChatInput, addAgentMessage, setAgentChatError, selectAgentChat } from '../store/slices/formSlice';
import { nanoid } from '@reduxjs/toolkit';
import { selectAgent } from '../store/slices/agentSlice';
import { useRunProtocolMutation } from '../store/api/agentApi';
import type { StructuredPersona } from '@forbocai/core';
import sdkContract from '../../data/contracts/sdk.json';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function useAgent() {
    const dispatch = useAppDispatch();

    // Select state from Redux
    const { input, messages } = useAppSelector(selectAgentChat);
    const agent = useAppSelector(selectAgent);

    // RTK Query mutation
    const [runProtocol, { isLoading }] = useRunProtocolMutation();

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        return input.trim() ? (() => {
            const userMsg: Message = { id: nanoid(), role: 'user', content: input };
            dispatch(addAgentMessage(userMsg));
            dispatch(setAgentChatInput(''));
            dispatch(setAgentChatError(null));

            return runProtocol({
                npcId: agent.id,
                observation: input,
                structuredPersona: {
                    traits: [agent.archetype],
                    goals: [agent.directive],
                    relationships: [],
                    world: [],
                    speakingStyle: [],
                    constraints: [],
                } satisfies StructuredPersona,
                context: {
                    identity: { name: agent.name },
                    legalActions: agent.actions.map(({ name }) => name),
                },
            }).unwrap()
            .then(response => {
                const assistantMsg: Message = {
                    id: nanoid(),
                    role: 'assistant',
                    content: response.dialogue,
                };
                dispatch(addAgentMessage(assistantMsg));
            })
            .catch((error: unknown) => {
                const candidate = error as { error?: unknown };
                dispatch(setAgentChatError(
                    typeof candidate.error === 'string'
                        ? candidate.error
                        : sdkContract.messages.processingFailed,
                ));
            });
        })() : Promise.resolve();
    };

    return {
        messages,
        input,
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setAgentChatInput(e.target.value)),
        handleSubmit,
        isLoading
    };
}
