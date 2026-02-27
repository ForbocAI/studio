export interface GenericAction {
    type: string;
    reason?: string;
    target?: string;
    payload?: any;
}

export interface AgentResponse {
    text: string;
    action?: GenericAction;
    valid: boolean;
    signature?: string;
}

export async function runAgentProtocol(
    agentId: string,
    observation: string,
    persona: string
): Promise<AgentResponse> {
    const API_BASE = "https://api.forboc.ai"; // Should be env-configurable

    // Step 1 & 2: Directive
    const directiveRes = await fetch(`${API_BASE}/agents/${agentId}/directive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observation }),
    });
    const { recall } = await directiveRes.json();

    // Step 3 & 4: Context (Simulating local memory recall for the audit)
    // In a real scenario, the SDK would query local LanceDB here.
    const contextRes = await fetch(`${API_BASE}/agents/${agentId}/context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            observation,
            memories: [
                { id: "mem_1", text: `Recalling: ${recall.query}`, type: "experience", timestamp: Date.now() }
            ],
        }),
    });
    const { prompt } = await contextRes.json();

    // Step 5 & 6: Generation (Calling a dummy LLM or the API's dialogue as a fallback)
    // Real ForbocAI SDK would use local node-llama-cpp here.
    const speakRes = await fetch(`${API_BASE}/agents/${agentId}/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: observation,
            agentState: { persona }
        }),
    });
    const { response: generatedText } = await speakRes.json();

    // Step 7: Verdict
    const verdictRes = await fetch(`${API_BASE}/agents/${agentId}/verdict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            observation,
            generatedOutput: generatedText,
        }),
    });
    const verdict = await verdictRes.json();

    return {
        text: generatedText,
        action: verdict.action,
        valid: verdict.valid,
        signature: verdict.signature,
    };
}
