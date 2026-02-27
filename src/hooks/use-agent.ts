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
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        dispatch(addAgentMessage(userMsg));
        dispatch(setAgentChatInput(''));
        dispatch(setAgentChatError(null));

        try {
            const response = await runProtocol({
                agentId: 'studio-agent',
                observation: input,
                persona: directive
            }).unwrap();

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.text
            };
            dispatch(addAgentMessage(assistantMsg));
        } catch (error: any) {
            dispatch(setAgentChatError(error.error || "Agent protocol failed"));
        }
    };

    return {
        messages,
        input,
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setAgentChatInput(e.target.value)),
        handleSubmit,
        isLoading
    };
}
