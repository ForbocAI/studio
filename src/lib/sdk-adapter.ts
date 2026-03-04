export interface GenericAction {
    type: string;
    reason?: string;
    target?: string;
    payload?: unknown;
}

export interface AgentResponse {
    text: string;
    action?: GenericAction;
    valid: boolean;
    signature?: string;
}

interface NPCProcessTape {
    observation: string;
    context: Record<string, unknown>;
    npcState: Record<string, unknown>;
    persona?: string;
    memories: Array<{ text: string; type: string; importance: number; similarity?: number }>;
    vectorQueried?: boolean;
}

interface NPCProcessResponse {
    instruction: {
        type: string;
        query?: string;
        limit?: number;
        threshold?: number;
        prompt?: string;
        constraints?: Record<string, unknown>;
        valid?: boolean;
        signature?: string;
        memoryStore?: Array<{ text: string; type: string; importance: number }>;
        stateTransform?: Record<string, unknown>;
        action?: GenericAction;
        dialogue?: string;
    };
    tape: NPCProcessTape;
}

const API_BASE = process.env.NEXT_PUBLIC_FORBOCAI_API_URL || "https://api.forboc.ai";
const API_KEY = process.env.NEXT_PUBLIC_FORBOCAI_API_KEY;
const MAX_PROTOCOL_TURNS = 8;

const buildHeaders = () => ({
    "Content-Type": "application/json",
    ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
});

const parseResponseJson = async (res: Response) => {
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
        const message =
            payload?.error?.message ||
            payload?.error ||
            payload?.message ||
            `API request failed (${res.status})`;
        throw new Error(message);
    }
    return payload;
};

export async function runAgentProtocol(
    agentId: string,
    observation: string,
    persona: string
): Promise<AgentResponse> {
    let tape: NPCProcessTape = {
        observation,
        context: {},
        npcState: {},
        persona,
        memories: [],
    };
    let lastResult: Record<string, unknown> | undefined = undefined;

    for (let turn = 0; turn < MAX_PROTOCOL_TURNS; turn += 1) {
        const processRes = await fetch(`${API_BASE}/npcs/${agentId}/process`, {
            method: "POST",
            headers: buildHeaders(),
            body: JSON.stringify({ tape, lastResult }),
        });
        const processPayload = (await parseResponseJson(processRes)) as NPCProcessResponse;
        tape = processPayload.tape;
        const instruction = processPayload.instruction;

        if (instruction.type === "IdentifyActor") {
            lastResult = {
                type: "IdentifyActorResult",
                actor: {
                    npcId: agentId,
                    persona,
                    data: tape.npcState || {},
                },
            };
            continue;
        }

        if (instruction.type === "QueryVector") {
            const query = instruction.query || observation;
            const memories = [
                {
                    text: `Recalling: ${query}`,
                    type: "experience",
                    importance: 0.5,
                    similarity: 0.5,
                },
            ];
            lastResult = { type: "QueryVectorResult", memories };
            continue;
        }

        if (instruction.type === "ExecuteInference") {
            const prompt = instruction.prompt || observation;
            const generatedOutput = `${persona}: ${prompt.slice(0, 240)}`;
            lastResult = { type: "ExecuteInferenceResult", generatedOutput };
            continue;
        }

        if (instruction.type === "Finalize") {
            return {
                text: instruction.dialogue || "",
                action: instruction.action,
                valid: Boolean(instruction.valid),
                signature: instruction.signature,
            };
        }

        throw new Error(`Unknown protocol instruction: ${instruction.type}`);
    }

    throw new Error(`Protocol loop exceeded ${MAX_PROTOCOL_TURNS} turns`);
}
