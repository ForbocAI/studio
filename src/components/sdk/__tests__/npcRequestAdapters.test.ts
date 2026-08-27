import { describe, expect, it } from 'vitest';
import fixture from '../../../../data/tests/sdk.json';
import { parseStudioNpcRequest } from '../npcRequestAdapters';

describe(fixture.cases.request, () => {
    it(fixture.cases.valid, () => {
        expect(parseStudioNpcRequest(fixture.validRequest)).toEqual(fixture.validRequest);
    });

    it(fixture.cases.missingIdentity, () => {
        expect(parseStudioNpcRequest(fixture.invalid.missingIdentity)).toBeNull();
    });

    it(fixture.cases.missingObservation, () => {
        expect(parseStudioNpcRequest(fixture.invalid.missingObservation)).toBeNull();
    });

    it(fixture.cases.malformedPersona, () => {
        expect(parseStudioNpcRequest(fixture.invalid.malformedPersona)).toBeNull();
    });

    it(fixture.cases.missingContext, () => {
        expect(parseStudioNpcRequest(fixture.invalid.missingContext)).toBeNull();
    });
});
