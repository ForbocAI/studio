import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setAgentChatError } from '../slices/formSlice';

export const errorListener = createListenerMiddleware();

errorListener.startListening({
    actionCreator: setAgentChatError,
    effect: (action) => {
        if (action.payload) {
            console.error("Agent Protocol Error:", action.payload);
        }
    },
});
