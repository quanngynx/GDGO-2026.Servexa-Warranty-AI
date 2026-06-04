/**
 * Verifies v1 routes deny access when resolved permissions omit required keys.
 */
import { describe, it, expect, vi, beforeAll } from "vitest";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import http from "node:http";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { errorHandler } from "@/middlewares/error-middleware";
import { Roles } from "src/enums/roles";
import { RolesScope } from "src/enums/roles-scope";

vi.mock("@/middlewares/authenticate.middleware", () => ({
  authenticateMiddleware: (req: Request, _res: Response, next: NextFunction) => {
    req.user = {
      id: "user-staff",
      email: "staff@test.com",
      username: "staff",
      fullName: "Staff User",
      role: Roles.ASC_TECHNICIAN,
      roleScope: RolesScope.ASC,
      permissions: [],
      aud: "access:common",
    };
    next();
  },
}));

vi.mock("@/middlewares/require-permission.middleware", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/middlewares/require-permission.middleware")
    >();
  return {
    ...actual,
    resolvePermissions: (req: Request, _res: Response, next: NextFunction) => {
      req.user!.permissions = ["repair_case.read"];
      next();
    },
  };
});

vi.mock("../controllers/user.controller", () => ({
  default: {
    findAll: (_req: Request, res: Response) => res.status(200).json({ ok: true }),
    findOneById: (_req: Request, res: Response) => res.status(200).json({ ok: true }),
    createUser: (_req: Request, res: Response) => res.status(200).json({ ok: true }),
    updateUser: (_req: Request, res: Response) => res.status(200).json({ ok: true }),
    deleteUser: (_req: Request, res: Response) => res.status(200).json({ ok: true }),
    restoreUser: (_req: Request, res: Response) => res.status(200).json({ ok: true }),
  },
}));

function request(
  app: Express,
  method: string,
  path: string,
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address() as { port: number };
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path,
          method,
          headers: { "x-client-id": "test" },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => {
            server.close();
            resolve({
              status: res.statusCode ?? 0,
              body: Buffer.concat(chunks).toString("utf8"),
            });
          });
        },
      );
      req.on("error", (err) => {
        server.close();
        reject(err);
      });
      req.end();
    });
  });
}

describe("Route RBAC integration", () => {
  let app: Express;

  beforeAll(async () => {
    const { default: userRoute } = await import("../router/user.route");
    app = express();
    app.use(express.json());
    app.use("/v1/identity/users", userRoute);
    app.use(errorHandler);
  });

  it("returns 403 on GET /users when user lacks users.read", async () => {
    const res = await request(app, "GET", "/v1/identity/users");
    expect(res.status).toBe(HTTP_RESPONSE_CODE.FORBIDDEN);
    expect(res.body).toContain("Insufficient permissions");
  });

  it("returns 403 on POST /users when user lacks users.write", async () => {
    const res = await request(app, "POST", "/v1/identity/users");
    expect(res.status).toBe(HTTP_RESPONSE_CODE.FORBIDDEN);
  });
});
