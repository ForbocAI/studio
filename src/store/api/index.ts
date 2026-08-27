import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import sdkContract from '../../../data/contracts/sdk.json';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: sdkContract.routes.root,
    }),
    tagTypes: [sdkContract.cacheTags.memory],
    endpoints: () => ({}),
});
