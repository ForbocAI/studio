import { baseApi } from './index';
import sdkContract from '../../../data/contracts/sdk.json';
import type {
    StudioMemoryItem,
    StudioNpcRequest,
    StudioNpcResponse,
} from '@/entities/npc/npcTypes';

export const agentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        runProtocol: builder.mutation<StudioNpcResponse, StudioNpcRequest>({
            query: (body) => ({
                url: sdkContract.routes.npcProcess,
                method: sdkContract.http.methods.post,
                body,
            }),
            invalidatesTags: [sdkContract.cacheTags.memory],
        }),
        listNpcMemory: builder.query<StudioMemoryItem[], string>({
            query: (npcId) => ({
                url: sdkContract.routes.npcMemory,
                method: sdkContract.http.methods.get,
                params: {
                    [sdkContract.memory.queryParameter]: npcId,
                },
            }),
            providesTags: [sdkContract.cacheTags.memory],
        }),
    }),
});

export const { useListNpcMemoryQuery, useRunProtocolMutation } = agentApi;
