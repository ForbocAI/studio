# ForbocAI Studio

ForbocAI Studio is the visual workspace for composing, exercising, and
inspecting game-defined NPCs against the ForbocAI NPC protocol.

- Studio: <https://studio.forboc.ai>
- Account and API keys: <https://account.forboc.ai>
- SDK documentation: <https://docs.forboc.ai>

## NPC Workflow

The Studio product contract unifies one workflow for:

1. defining an NPC identity, structured persona, goals, traits, and permitted
   action vocabulary
2. exercising conversations with runtime observations and game-owned context
3. inspecting recalled memory, protocol instructions, committed results,
   rationales, validation, and timing evidence
4. refining the definition while preserving the boundary between NPC behavior
   and game rules
5. exporting a portable Soul through the same SDK-owned persistence contract
   used by a game runtime

## Ownership Boundary

The ForbocAI API owns inference, orchestration, decision policy, grounded
rationale, diagnosis, and output validation. The SDK owns API transport plus the
vector-memory and permanent Soul effects that must execute beside the client.
Studio provides the authoring and inspection interface. A game remains the
authority for world state, available actions, action execution, presentation,
audio, animation, and save data.

Studio sends authored context through ForbocAI interfaces; it does not replace
the API with browser-owned NPC logic or teach Servitor a particular game.

## Credentials

Use an API key created at <https://account.forboc.ai>. Keep credentials at the
runtime boundary and out of NPC definitions, exported Souls, logs, and source
control.

## Integration Guides

- TypeScript SDK: <https://docs.forboc.ai/npm/welcome>
- Unreal Engine SDK: <https://docs.forboc.ai/ue/welcome>

## License

All rights reserved. See [LICENSE](./LICENSE).
