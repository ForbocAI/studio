import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

interface FormState {
    agentChat: {
        input: string;
        messages: {
            id: string;
            role: 'user' | 'assistant';
            content: string;
        }[];
        error: string | null;
    };
}

const initialState: FormState = {
    agentChat: {
        input: '',
        messages: [],
        error: null,
    },
};

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setAgentChatInput: (state, action: PayloadAction<string>) => {
            state.agentChat.input = action.payload;
        },
        addAgentMessage: (state, action: PayloadAction<{ id: string; role: 'user' | 'assistant'; content: string }>) => {
            state.agentChat.messages.push(action.payload);
        },
        setAgentChatError: (state, action: PayloadAction<string | null>) => {
            state.agentChat.error = action.payload;
        },
        resetAgentChat: (state) => {
            state.agentChat.input = '';
            state.agentChat.messages = [];
            state.agentChat.error = null;
        },
    },
});

export const {
    setAgentChatInput,
    addAgentMessage,
    setAgentChatError,
    resetAgentChat
} = formSlice.actions;

// Selectors
const selectForm = (state: any) => state.form;

export const selectAgentChat = createSelector(selectForm, (form) => form.agentChat);
export const selectAgentChatInput = createSelector(selectAgentChat, (chat) => chat.input as string);
export const selectAgentChatMessages = createSelector(selectAgentChat, (chat) => chat.messages);
export const selectAgentChatError = createSelector(selectAgentChat, (chat) => chat.error as string | null);

export default formSlice.reducer;
