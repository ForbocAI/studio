import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { StructuredPersona } from '@forbocai/core';
import sdkContract from '../../data/contracts/sdk.json';
import { selectAgent } from '@/entities/agent/agentSlice';
import {
    chatFailed,
    chatMessageAdded,
    selectChatError,
    selectChatMessages,
} from '@/entities/chat/chatSlice';
import { selectLatestTrace } from '@/entities/trace/traceSlice';
import { useRunProtocolMutation } from '@/store/api/agentApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const describeMutationFailure = (value: unknown): string => {
    const candidate = value as { error?: unknown };
    return typeof candidate.error === 'string'
        ? candidate.error
        : sdkContract.messages.processingFailed;
};

export const useAgent = () => {
    const dispatch = useAppDispatch();
    const [input, setInput] = useState('');
    const agent = useAppSelector(selectAgent);
    const messages = useAppSelector(selectChatMessages);
    const error = useAppSelector(selectChatError);
    const latestTrace = useAppSelector(selectLatestTrace);
    const [runProtocol, { isLoading }] = useRunProtocolMutation();

    const handleSubmit = (event?: FormEvent): Promise<void> => {
        event?.preventDefault();
        const observation = input.trim();
        return observation
            ? (dispatch(chatMessageAdded({ role: 'user', content: observation })),
                setInput(''),
                dispatch(chatFailed(null)),
                runProtocol({
                    npcId: agent.id,
                    observation,
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
                    .then(({ action, dialogue, thought }) => {
                        dispatch(chatMessageAdded({
                            role: 'assistant',
                            content: dialogue,
                            action: action?.type,
                            thought,
                        }));
                    })
                    .catch((failure: unknown) => {
                        dispatch(chatFailed(describeMutationFailure(failure)));
                    }))
            : Promise.resolve();
    };

    return {
        error,
        handleInputChange: (event: ChangeEvent<HTMLInputElement>) =>
            setInput(event.target.value),
        handleSubmit,
        input,
        isLoading,
        latestTrace,
        messages,
    };
};
