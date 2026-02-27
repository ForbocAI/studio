import { useState } from 'react';
import { runAgentProtocol, AgentResponse } from '@/lib/sdk-adapter';
import { useAgentStore } from '@/lib/store';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function useAgent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { directive } = useAgentStore();

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await runAgentProtocol('studio-agent', input, directive);
            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.text
            };
            setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            console.error("Agent Protocol Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
        handleSubmit,
        setMessages,
        isLoading
    };
}
