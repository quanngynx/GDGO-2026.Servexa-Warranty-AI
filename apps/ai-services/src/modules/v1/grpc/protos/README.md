Canonical protobuf for Python gRPC lives at the monorepo root:

`packages/proto/ai/v1/ai_service.proto`

Regenerate Python stubs with `grpc_tools.protoc` using `-I` pointed at `packages/proto` (see `packages/proto/README.md`).
