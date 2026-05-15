import { baseApi } from './index';
import { runAgentProtocol, AgentResponse } from '@/lib/sdk-adapter';

export const agentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Even though it's a protocol, we wrap it in a mutation to manage loading/error state in Redux
        runProtocol: builder.mutation<AgentResponse, { agentId: string; observation: string; persona: string }>({
            queryFn: async ({ agentId, observation, persona }) => {
                try {
                    const response = await runAgentProtocol(agentId, observation, persona);
                    return { data: response };
                } catch (error: any) {
                    return { error: { status: 'CUSTOM_ERROR', error: error.message } };
                }
            },
            invalidatesTags: ['Agent'],
        }),
    }),
});

export const { useRunProtocolMutation } = agentApi;
