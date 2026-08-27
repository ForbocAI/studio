import 'server-only';

import {
    memoise,
    processNPC,
} from '@forbocai/core';
import {
    createNodeMemory,
    readConfigState,
    store,
} from '@forbocai/node';
import sdkContract from '../../../data/contracts/sdk.json';
import type {
    StudioMemoryItem,
    StudioNpcRequest,
    StudioNpcResponse,
} from '@/entities/npc/npcTypes';

const selectConnection = memoise(readConfigState);

const memoryName = (npcId: string): string => [
    sdkContract.memory.namespace,
    npcId,
].join(sdkContract.memory.separator);

const memoryFor = (npcId: string) => createNodeMemory(store, memoryName(npcId));

export const runStudioNpc = async (
    request: StudioNpcRequest,
): Promise<StudioNpcResponse> => {
    const connection = selectConnection();
    return store.dispatch(processNPC({
        npcId: request.npcId,
        text: request.observation,
        context: request.context,
        structuredPersona: request.structuredPersona,
        apiUrl: connection.apiUrl,
        apiKey: connection.apiKey,
        memory: memoryFor(request.npcId),
    })).unwrap();
};

export const listStudioNpcMemory = (npcId: string): Promise<StudioMemoryItem[]> =>
    memoryFor(npcId).list(
        sdkContract.memory.pageLimit,
        sdkContract.memory.pageOffset,
    ).then((items) => items.map(({
        id,
        text,
        timestamp,
        type,
        importance,
        similarity,
    }) => ({
        id,
        text,
        timestamp,
        type,
        importance,
        similarity,
    })));
