import { describe, expect, it } from 'vitest';
import fixture from '../../../../data/tests/state.json';
import reducer, {
    type ChatRole,
    chatCleared,
    chatFailed,
    chatMessageAdded,
    selectChatError,
    selectChatMessages,
} from '../chatSlice';

const initialState = reducer(undefined, { type: fixture.structural.unknownAction });

describe(fixture.cases.chatSuite, () => {
    it(fixture.cases.chatInitial, () => {
        expect(selectChatMessages({ chat: initialState })).toHaveLength(
            fixture.structural.emptyCount,
        );
    });

    it(fixture.cases.chatMessage, () => {
        const state = reducer(initialState, chatMessageAdded({
            role: fixture.chat.role as ChatRole,
            content: fixture.chat.content,
            action: fixture.chat.action,
            thought: fixture.chat.thought,
        }));
        expect(selectChatMessages({ chat: state })).toHaveLength(
            fixture.structural.singleCount,
        );
        expect(selectChatMessages({ chat: state }).at(
            fixture.structural.lastIndex,
        )).toMatchObject({
            role: fixture.chat.role,
            content: fixture.chat.content,
            action: fixture.chat.action,
            thought: fixture.chat.thought,
        });
    });

    it(fixture.cases.chatClear, () => {
        const failed = reducer(initialState, chatFailed(fixture.chat.failure));
        const state = reducer(failed, chatCleared());
        expect(selectChatMessages({ chat: state })).toHaveLength(
            fixture.structural.emptyCount,
        );
        expect(selectChatError({ chat: state })).toBeNull();
    });
});
