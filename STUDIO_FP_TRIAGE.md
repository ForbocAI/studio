# Studio FP/RTK Conformance Triage

The following files were flagged during the initial run of `check-fp-conformance.sh` and `check-rtk-conformance.sh`. This file serves as the inventory for follow-up cleanup PRs.

## RTK Conformance Violations

- **Source files over 300 lines:**
  - `src/components/ui/sidebar.tsx` (713 lines)

## FP Conformance Violations (Warnings / Fails)

- `src/hooks/use-agent.ts`
  - [warn] raw if statements found: 2
- `src/lib/auth.ts`
  - [warn] raw if statements found: 4
- `src/lib/sdk-adapter.ts`
  - [warn] raw if statements found: 5
  - [warn] imperative loop statements found: 1
- `src/proxy.ts`
  - [warn] raw if statements found: 1
- `src/store/index.ts`
  - [warn] raw if statements found: 1
- `src/store/middleware/errorListener.ts`
  - [warn] raw if statements found: 1
- `src/store/middleware/responsive.ts`
  - [warn] raw if statements found: 2
- `src/store/slices/agentSlice.ts`
  - [warn] array push() accumulation found: 1
- `src/store/slices/formSlice.ts`
  - [warn] array push() accumulation found: 1
- `src/components/ui/sidebar.tsx`
  - [warn] raw if statements found: 6
- `src/components/workbench/editor.tsx`
  - [warn] raw if statements found: 1

*Note: There are also widespread warnings about missing FP-core imports and primitive usage across most files, which should be addressed as part of the broader functional programming migration.*
