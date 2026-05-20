import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'node:path'

import { aiServiceProtoPath } from '@servexa-warranty-ai/proto'

/** Values reachable while walking `grpc.loadPackageDefinition()` results */
type PackageTreeNode =
  | grpc.GrpcObject
  | grpc.ServiceClientConstructor
  | grpc.ProtobufTypeDefinition

function isServiceClientConstructor(
  node: PackageTreeNode,
): node is grpc.ServiceClientConstructor {
  return typeof node === 'function'
}

function isProtobufTypeDefinition(
  node: PackageTreeNode,
): node is grpc.ProtobufTypeDefinition {
  if (typeof node !== 'object' || node === null) {
    return false
  }
  const obj = node as Record<string, unknown>
  return (
    typeof obj.format === 'string' &&
    obj.type !== undefined &&
    Array.isArray(obj.fileDescriptorProtos)
  )
}

function assertNamespace(
  node: PackageTreeNode | undefined,
  path: string,
): grpc.GrpcObject {
  if (node === undefined) {
    throw new Error(`AI gRPC package missing segment: ${path}`)
  }
  if (isServiceClientConstructor(node)) {
    throw new Error(
      `AI gRPC: expected namespace at ${path}, found service client constructor`,
    )
  }
  if (isProtobufTypeDefinition(node)) {
    throw new Error(
      `AI gRPC: expected namespace at ${path}, found protobuf type definition`,
    )
  }
  return node
}

function assertAiServiceConstructor(
  node: PackageTreeNode | undefined,
): grpc.ServiceClientConstructor {
  if (node === undefined) {
    throw new Error('AI gRPC: ai.v1.AiService not found in proto definition')
  }
  if (isProtobufTypeDefinition(node)) {
    throw new Error(
      'AI gRPC: expected AiService client constructor, found protobuf type definition',
    )
  }
  if (!isServiceClientConstructor(node)) {
    throw new Error(
      'AI gRPC: expected AiService client constructor, found nested namespace object',
    )
  }
  return node
}

export function loadAiGrpcPackage(): grpc.ServiceClientConstructor {
  const packageDefinition = protoLoader.loadSync(aiServiceProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [path.dirname(aiServiceProtoPath)],
  })

  const loaded = grpc.loadPackageDefinition(packageDefinition)
  const ai = assertNamespace(loaded.ai as PackageTreeNode | undefined, 'ai')
  const v1 = assertNamespace(ai.v1 as PackageTreeNode | undefined, 'ai.v1')
  return assertAiServiceConstructor(
    v1.AiService as PackageTreeNode | undefined,
  )
}
