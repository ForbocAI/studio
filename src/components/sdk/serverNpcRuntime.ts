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
    StudioNpcRequest,
    StudioNpcResponse,
} from '@/entities/npc/npcTypes';

const selectConnection = memoise(readConfigState);

const memoryName = (npcId: string): string => [
    sdkContract.memory.namespace,
    npcId,
].join(sdkContract.memory.separator);

export const runStudioNpc = async (
    request: StudioNpcRequest,
): Promise<StudioNpcResponse> => {
    const connection = selectConnection();
    const memory = createNodeMemory(store, memoryName(request.npcId));
    return store.dispatch(processNPC({
        npcId: request.npcId,
        text: request.observation,
        context: request.context,
        structuredPersona: request.structuredPersona,
        apiUrl: connection.apiUrl,
        apiKey: connection.apiKey,
        memory,
    })).unwrap();
};
