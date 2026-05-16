import { useAppDispatch, useAppSelector } from './../store/hooks';
import { setAgentChatInput, addAgentMessage, setAgentChatError, selectAgentChat } from '../store/slices/formSlice';
import { selectAgentDirective } from '../store/slices/agentSlice';
import { useRunProtocolMutation } from '../store/api/agentApi';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function useAgent() {
    const dispatch = useAppDispatch();

    // Select state from Redux
    const { input, messages } = useAppSelector(selectAgentChat);
    const directive = useAppSelector(selectAgentDirective);

    // RTK Query mutation
    const [runProtocol, { isLoading }] = useRunProtocolMutation();

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        return input.trim() ? (() => {
            const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
            dispatch(addAgentMessage(userMsg));
            dispatch(setAgentChatInput(''));
            dispatch(setAgentChatError(null));

            return runProtocol({
                agentId: 'studio-agent',
                observation: input,
                persona: directive
            }).unwrap()
            .then(response => {
                const assistantMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response.text
                };
                dispatch(addAgentMessage(assistantMsg));
            })
            .catch((error: any) => {
                dispatch(setAgentChatError(error.error || "Agent protocol failed"));
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
