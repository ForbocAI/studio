import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.forboc.ai' // Default base, though some use custom queryFn
    }),
    tagTypes: ['Agent'],
    endpoints: () => ({}),
});
