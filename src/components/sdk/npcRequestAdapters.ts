import type { StudioNpcRequest } from '@/entities/npc/npcTypes';

type UnknownRecord = Readonly<Record<string, unknown>>;

const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const record = (value: unknown): UnknownRecord =>
    isRecord(value) ? value : {};

const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((entry) => typeof entry === 'string');

const strings = (value: unknown): string[] =>
    isStringArray(value) ? [...value] : [];

export const parseStudioNpcRequest = (value: unknown): StudioNpcRequest | null => {
    const candidate = record(value);
    const persona = record(candidate.structuredPersona);
    const npcId = typeof candidate.npcId === 'string' ? candidate.npcId.trim() : '';
    const observation = typeof candidate.observation === 'string'
        ? candidate.observation.trim()
        : '';
    const structuredPersona = {
        traits: strings(persona.traits),
        goals: strings(persona.goals),
        relationships: strings(persona.relationships),
        world: strings(persona.world),
        speakingStyle: strings(persona.speakingStyle),
        constraints: strings(persona.constraints),
    };
    const validPersona = [
        persona.traits,
        persona.goals,
        persona.relationships,
        persona.world,
        persona.speakingStyle,
        persona.constraints,
    ].every(isStringArray);
    return npcId && observation && validPersona && isRecord(candidate.context)
        ? {
            npcId,
            observation,
            structuredPersona,
            context: { ...candidate.context },
        }
        : null;
};
