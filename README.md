# ForbocAI Studio

ForbocAI Studio is the visual workspace for composing, exercising, and
inspecting game-defined NPCs through the ForbocAI NPC SDK and API.

- Studio: <https://studio.forboc.ai>
- Account and API keys: <https://account.forboc.ai>
- SDK documentation: <https://docs.forboc.ai>

## Workbench

Studio provides one connected NPC workflow:

1. define an NPC identity, primary trait, goal, and game-permitted action
   vocabulary
2. send observations through the published TypeScript SDK to the ForbocAI API
3. inspect the NPC's SDK-owned vector memory
4. inspect redacted request status and round-trip timing without exposing
   persona, observations, responses, sessions, or API credentials
5. refine the NPC definition while the game remains authoritative for world
   state and action execution

## Ownership Boundary

The ForbocAI API owns inference, orchestration, decision policy, grounded
rationale, diagnosis, and output validation. The SDK owns API transport plus
the vector-memory and permanent Soul effects that execute beside the client.
Studio owns authoring and inspection. A game remains authoritative for world
state, available actions, action execution, presentation, audio, animation,
and save data.

Studio sends authored context through an authenticated same-origin server route
that dispatches the published TypeScript SDK. The browser neither calls the
ForbocAI API directly nor receives a privileged API key. Studio does not replace
API cognition with browser logic or teach Servitor a particular game.

## Credentials

Sign in through <https://account.forboc.ai>. The browser uses the shared,
HTTP-only Account session. API credentials remain inside the Studio server and
stay out of NPC definitions, memory, diagnostics, browser bundles, and source
control.

## Integration Guides

- TypeScript SDK: <https://docs.forboc.ai/npm/welcome>
- Unreal Engine SDK: <https://docs.forboc.ai/ue/welcome>

## License

All rights reserved. See [LICENSE](./LICENSE).
