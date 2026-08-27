import { fromNullable, match } from '@forbocai/core';
import { NextResponse } from 'next/server';
import authContract from '../../../../data/contracts/auth.json';
import sdkContract from '../../../../data/contracts/sdk.json';
import {
    isSuccessfulStudioNpcResponse,
    parseStudioNpcRequest,
} from '@/components/sdk/npcRequestAdapters';
import { runStudioNpc } from '@/components/sdk/serverNpcRuntime';
import { getSessionFromCookies } from '@/lib/auth';

const unauthorized = (): NextResponse => NextResponse.json(
    { error: authContract.messages.unauthorized },
    { status: sdkContract.http.status.unauthorized },
);

const badRequest = (): NextResponse => NextResponse.json(
    { error: sdkContract.messages.invalidRequest },
    { status: sdkContract.http.status.badRequest },
);

const processingFailure = (error: unknown): NextResponse => {
    console.error(sdkContract.messages.processingFailed, {
        category: error instanceof Error ? error.name : typeof error,
    });
    return NextResponse.json(
        { error: sdkContract.messages.processingFailed },
        { status: sdkContract.http.status.badGateway },
    );
};

const renderNpcResult = (result: unknown): NextResponse =>
    isSuccessfulStudioNpcResponse(result)
        ? NextResponse.json(result, { status: sdkContract.http.status.ok })
        : NextResponse.json(
            { error: sdkContract.messages.invalidResponse },
            { status: sdkContract.http.status.badGateway },
        );

const processBody = (value: unknown): Promise<NextResponse> => match(
    fromNullable(parseStudioNpcRequest(value)),
    (request) => runStudioNpc(request)
        .then(renderNpcResult)
        .catch(processingFailure),
    () => Promise.resolve(badRequest()),
);

export const POST = (request: Request): Promise<NextResponse> => getSessionFromCookies()
    .then((session) => match(
        fromNullable(session),
        () => request.json()
            .then(processBody)
            .catch(() => badRequest()),
        () => Promise.resolve(unauthorized()),
    ));
