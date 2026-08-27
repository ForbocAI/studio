import { describe, expect, it } from 'vitest';
import fixture from '../../../../data/tests/sdk.json';
import {
    isSuccessfulStudioNpcResponse,
    parseMemoryNpcId,
    parseStudioNpcRequest,
} from '../npcRequestAdapters';

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

    it(fixture.cases.validResponse, () => {
        expect(isSuccessfulStudioNpcResponse(fixture.responses.valid)).toBe(true);
    });

    it(fixture.cases.invalidResponse, () => {
        expect(isSuccessfulStudioNpcResponse(fixture.responses.invalid)).toBe(false);
    });

    it(fixture.cases.memoryIdentity, () => {
        expect(parseMemoryNpcId(fixture.memory.npcId)).toBe(
            fixture.memory.normalizedNpcId,
        );
    });

    it(fixture.cases.missingMemoryIdentity, () => {
        expect(parseMemoryNpcId(fixture.memory.missingNpcId)).toBeNull();
    });
});
