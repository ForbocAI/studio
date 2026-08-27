import {
    createEntityAdapter,
    createSlice,
    nanoid,
    type PayloadAction,
} from '@reduxjs/toolkit';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
    readonly id: string;
    readonly role: ChatRole;
    readonly content: string;
    readonly action?: string;
    readonly thought?: string;
}

interface NewChatMessage {
    readonly role: ChatRole;
    readonly content: string;
    readonly action?: string;
    readonly thought?: string;
}

const chatAdapter = createEntityAdapter<ChatMessage>();
const initialState = chatAdapter.getInitialState({ error: null as string | null });

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        chatMessageAdded: {
            reducer: chatAdapter.addOne,
            prepare: (message: NewChatMessage) => ({
                payload: { ...message, id: nanoid() },
            }),
        },
        chatFailed: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        chatCleared: (state) => {
            chatAdapter.removeAll(state);
            state.error = null;
        },
    },
});

export const { chatMessageAdded, chatFailed, chatCleared } = chatSlice.actions;

interface ChatRootState {
    readonly chat: typeof initialState;
}

const selectors = chatAdapter.getSelectors((state: ChatRootState) => state.chat);

export const selectChatMessages = selectors.selectAll;
export const selectChatError = (state: ChatRootState): string | null =>
    state.chat.error;

export default chatSlice.reducer;
