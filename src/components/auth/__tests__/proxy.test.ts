import { SignJWT, type JWTPayload } from 'jose';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import authContract from '../../../../data/contracts/auth.json';
import fixture from '../../../../data/tests/auth.json';
import { proxy } from '@/proxy';

process.env[authContract.jwt.secretEnvironment] = fixture.jwtSecret;

const signAccountSession = (
    payload: JWTPayload,
    secret = fixture.jwtSecret,
    algorithm = authContract.jwt.algorithm,
): Promise<string> => new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(fixture.jwt.expiry)
    .sign(new TextEncoder().encode(secret));

const requestWithSession = (token: string): NextRequest => new NextRequest(
    fixture.requestUrl,
    {
        headers: {
            [fixture.headers.cookie]: authContract.cookie.name
                + fixture.cookie.assignmentSeparator
                + token,
        },
    },
);

const expectAccountRedirect = (response: Response): void => {
    expect(response.status).toBe(fixture.status.redirect);
    expect(response.headers.get(fixture.headers.location)).toBe(
        authContract.routes.account,
    );
};

describe(fixture.cases.proxy, () => {
    it(fixture.cases.redirect, async () => {
        const response = await proxy(new NextRequest(fixture.requestUrl));
        expectAccountRedirect(response);
    });

    it(fixture.cases.accepted, async () => {
        const token = await signAccountSession({ sub: fixture.userId });
        const response = await proxy(requestWithSession(token));
        expect(response.status).toBe(fixture.status.ok);
    });

    it(fixture.cases.invalidSignature, async () => {
        const token = await signAccountSession(
            { sub: fixture.userId },
            fixture.invalidJwtSecret,
        );
        const response = await proxy(requestWithSession(token));
        expectAccountRedirect(response);
    });

    it(fixture.cases.invalidAlgorithm, async () => {
        const token = await signAccountSession(
            { sub: fixture.userId },
            fixture.jwtSecret,
            fixture.invalidJwtAlgorithm,
        );
        const response = await proxy(requestWithSession(token));
        expectAccountRedirect(response);
    });

    it(fixture.cases.missingSubject, async () => {
        const token = await signAccountSession({});
        const response = await proxy(requestWithSession(token));
        expectAccountRedirect(response);
    });
});
