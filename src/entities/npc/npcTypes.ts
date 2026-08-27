import type {
    AgentResponse,
    MemoryItem,
    StructuredPersona,
} from '@forbocai/core';

export interface StudioNpcRequest {
    readonly npcId: string;
    readonly observation: string;
    readonly structuredPersona: StructuredPersona;
    readonly context: Record<string, unknown>;
}

export type StudioNpcResponse = AgentResponse;

export type StudioMemoryItem = Pick<
    MemoryItem,
    'id' | 'text' | 'timestamp' | 'type' | 'importance' | 'similarity'
>;
