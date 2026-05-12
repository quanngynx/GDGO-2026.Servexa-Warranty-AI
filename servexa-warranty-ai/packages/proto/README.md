Canonical gRPC definitions live in this package. Do not duplicate `.proto` files under `apps/`.

## Layout

- `ai/v1/ai_service.proto` — unary `AiService.ProcessRequest` used by Node `apps/server` (`@servexa-warranty-ai/proto`).

## Versioning

- Bump path `v1` → `v2` only for breaking wire changes (field renumbering, semantic changes).
- Prefer additive changes inside a major version (new optional fields, new RPCs on the same service with a new method name).

## Codegen

**TypeScript / Node (gRPC client stub)**

From repo root, use the same path the server loads (see `apps/server/src/core/infra/grpc/load-ai-grpc-definition.ts`). Regenerate when the proto changes if your pipeline uses `grpc_tools_node_protoc`.

**Python**

Generate stubs into `apps/ai-services/src/gen` (example):

```bash
python -m grpc_tools.protoc \
  -I packages/proto \
  --python_out=apps/ai-services/src/gen \
  --grpc_python_out=apps/ai-services/src/gen \
  packages/proto/ai/v1/ai_service.proto
```

Keep `package ai.v1` aligned with the directory `ai/v1`.
