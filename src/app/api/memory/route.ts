import { fromNullable, match } from '@forbocai/core';
import { NextResponse } from 'next/server';
import authContract from '../../../../data/contracts/auth.json';
import sdkContract from '../../../../data/contracts/sdk.json';
import { parseMemoryNpcId } from '@/components/sdk/npcRequestAdapters';
import { listStudioNpcMemory } from '@/components/sdk/serverNpcRuntime';
import { getSessionFromCookies } from '@/lib/auth';

const response = (error: string, status: number): NextResponse =>
    NextResponse.json({ error }, { status });

const listMemory = (request: Request): Promise<NextResponse> => match(
    fromNullable(parseMemoryNpcId(
        new URL(request.url).searchParams.get(sdkContract.memory.queryParameter),
    )),
    (npcId) => listStudioNpcMemory(npcId)
        .then((items) => NextResponse.json(items, {
            status: sdkContract.http.status.ok,
        }))
        .catch((error: unknown) => {
            console.error(sdkContract.messages.processingFailed, {
                category: error instanceof Error ? error.name : typeof error,
            });
            return response(
                sdkContract.messages.processingFailed,
                sdkContract.http.status.badGateway,
            );
        }),
    () => Promise.resolve(response(
        sdkContract.messages.invalidMemoryRequest,
        sdkContract.http.status.badRequest,
    )),
);

export const GET = (request: Request): Promise<NextResponse> =>
    getSessionFromCookies().then((session) => match(
        fromNullable(session),
        () => listMemory(request),
        () => Promise.resolve(response(
            authContract.messages.unauthorized,
            sdkContract.http.status.unauthorized,
        )),
    ));
