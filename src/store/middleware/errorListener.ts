import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setAgentChatError } from '../slices/formSlice';

export const errorListener = createListenerMiddleware();

errorListener.startListening({
    actionCreator: setAgentChatError,
    effect: (action) => {
        action.payload && console.error("Agent Protocol Error:", action.payload);
    },
});
