FROM pgvector/pgvector:0.8.2-pg18-trixie@sha256:42e7f6b4e1eceb02ff14e3e6bc6108bbe259abbe83879dc1845d0da1ddeb555d
RUN apt-get update \
  && apt-get install -y --no-install-recommends pgbackrest ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY infra/p0a/postgres/pgbackrest.conf /etc/pgbackrest/pgbackrest.conf
