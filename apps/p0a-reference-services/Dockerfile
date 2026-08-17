ARG NODE_IMAGE=node:24.16.0-bookworm-slim
ARG NODE_DIGEST=sha256:242549cd46785b480c832479a730f4f2a20865d61ea2e404fdb2a5c3d3b73ecf
FROM ${NODE_IMAGE}@${NODE_DIGEST}
WORKDIR /app
COPY apps/p0a-reference-services/src ./src
USER node
EXPOSE 4100
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD ["node", "-e", "fetch('http://127.0.0.1:4100/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "src/server.mjs"]
