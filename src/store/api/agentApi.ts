import { baseApi } from './index';
import sdkContract from '../../../data/contracts/sdk.json';
import type {
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
        }),
    }),
});

export const { useRunProtocolMutation } = agentApi;
