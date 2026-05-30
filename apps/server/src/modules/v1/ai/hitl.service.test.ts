import { describe, expect, it } from "vitest";

import {
  HITL_KIND_PERMISSIONS,
  permissionForHitlKind,
  userHasPermission,
} from "@/modules/v1/ai/hitl/hitl-permissions";
import { isAscScopeBypass } from "@/modules/v1/ai/hitl/policy/repair-case-access";
import { RolesScope } from "@/enums/roles-scope";
import { Roles } from "@/enums/roles";

describe("hitl permissions", () => {
  it("maps workflow kinds to permission keys", () => {
    expect(permissionForHitlKind("repair_escalation")).toBe(
      HITL_KIND_PERMISSIONS.repair_escalation,
    );
    expect(permissionForHitlKind("technician_assignment")).toBe(
      HITL_KIND_PERMISSIONS.technician_assignment,
    );
  });

  it("wildcard grants all permissions", () => {
    expect(userHasPermission(["*"], "repair_case.update")).toBe(true);
  });

  it("ASC scope bypass for system role", () => {
    expect(
      isAscScopeBypass({
        id: "u1",
        email: "a@b.c",
        username: "u",
        fullName: "U",
        role: Roles.ADMIN,
        roleScope: RolesScope.SYSTEM,
        permissions: [],
      }),
    ).toBe(true);
  });
});
