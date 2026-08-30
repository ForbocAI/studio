import { jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import authContract from '../../data/contracts/auth.json';

const COOKIE_NAME = authContract.cookie.name;

interface StudioSession {
    readonly userId: string;
}

const getJwtSecret = (): Uint8Array => {
    const secret = process.env[authContract.jwt.secretEnvironment];
    return secret
        ? new TextEncoder().encode(secret)
        : (() => {
            throw new Error(
                authContract.jwt.secretEnvironment
                + authContract.messages.missingSecretSuffix,
            );
        })();
};

const sessionFromPayload = (payload: JWTPayload): StudioSession | null =>
    typeof payload.sub === 'string' && payload.sub.length > 0
        ? { userId: payload.sub }
        : null;

export const verifyToken = (token: string): Promise<StudioSession | null> =>
    Promise.resolve()
        .then(() => jwtVerify(token, getJwtSecret(), {
            algorithms: [authContract.jwt.algorithm],
        }))
        .then(
            ({ payload }) => sessionFromPayload(payload),
            () => null,
        );

const sessionForToken = (
    token: string | undefined,
): Promise<StudioSession | null> => token
    ? verifyToken(token)
    : Promise.resolve(null);

export const getSession = (request: NextRequest): Promise<StudioSession | null> =>
    sessionForToken(request.cookies.get(COOKIE_NAME)?.value);

export const getSessionFromCookies = (): Promise<StudioSession | null> =>
    cookies().then((cookieStore) =>
        sessionForToken(cookieStore.get(COOKIE_NAME)?.value));
