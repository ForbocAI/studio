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
    return res.ok
        ? payload
        : Promise.reject(new Error(
              payload?.error?.message ||
              payload?.error ||
              payload?.message ||
              `API request failed (${res.status})`
          ));
};

const executeTurn = async (
    agentId: string,
    tape: NPCProcessTape,
    lastResult: Record<string, unknown> | undefined,
    persona: string,
    observation: string,
    turn: number
): Promise<AgentResponse> => {
    return turn >= MAX_PROTOCOL_TURNS
        ? Promise.reject(new Error(`Protocol loop exceeded ${MAX_PROTOCOL_TURNS} turns`))
        : fetch(`${API_BASE}/npcs/${agentId}/process`, {
              method: "POST",
              headers: buildHeaders(),
              body: JSON.stringify({ tape, lastResult }),
          })
              .then(parseResponseJson)
              .then((payload) => {
                  const processPayload = payload as NPCProcessResponse;
                  const newTape = processPayload.tape;
                  const instruction = processPayload.instruction;

                  const handlers: Record<string, () => Promise<AgentResponse>> = {
                      IdentifyActor: () => executeTurn(agentId, newTape, {
                          type: "IdentifyActorResult",
                          actor: { npcId: agentId, persona, data: newTape.npcState || {} },
                      }, persona, observation, turn + 1),
                      QueryVector: () => executeTurn(agentId, newTape, {
                          type: "QueryVectorResult",
                          memories: [{ text: `Recalling: ${instruction.query || observation}`, type: "experience", importance: 0.5, similarity: 0.5 }],
                      }, persona, observation, turn + 1),
                      ExecuteInference: () => executeTurn(agentId, newTape, {
                          type: "ExecuteInferenceResult",
                          generatedOutput: `${persona}: ${(instruction.prompt || observation).slice(0, 240)}`,
                      }, persona, observation, turn + 1),
                      Finalize: () => Promise.resolve({
                          text: instruction.dialogue || "",
                          action: instruction.action,
                          valid: Boolean(instruction.valid),
                          signature: instruction.signature,
                      }),
                  };

                  return handlers[instruction.type]
                      ? handlers[instruction.type]()
                      : Promise.reject(new Error(`Unknown protocol instruction: ${instruction.type}`));
              });
};

export function runAgentProtocol(
    agentId: string,
    observation: string,
    persona: string
): Promise<AgentResponse> {
    const initialTape: NPCProcessTape = {
        observation,
        context: {},
        npcState: {},
        persona,
        memories: [],
    };
    return executeTurn(agentId, initialTape, undefined, persona, observation, 0);
}
