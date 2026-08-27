import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import authContract from '../../../../data/contracts/auth.json';
import fixture from '../../../../data/tests/auth.json';
import { createToken } from '@/lib/auth';
import { proxy } from '@/proxy';

process.env[authContract.jwt.secretEnvironment] = fixture.jwtSecret;

describe(fixture.cases.proxy, () => {
    it(fixture.cases.redirect, async () => {
        const response = await proxy(new NextRequest(fixture.requestUrl));
        expect(response.status).toBe(fixture.status.redirect);
        expect(response.headers.get(fixture.headers.location)).toBe(
            authContract.routes.account,
        );
    });

    it(fixture.cases.accepted, async () => {
        const token = await createToken(fixture.userId);
        const response = await proxy(new NextRequest(fixture.requestUrl, {
            headers: {
                [fixture.headers.cookie]: authContract.cookie.name
                    + fixture.cookie.assignmentSeparator
                    + token,
            },
        }));
        expect(response.status).toBe(fixture.status.ok);
    });
});
