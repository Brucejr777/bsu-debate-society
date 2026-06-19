// src/lib/rbac.ts

/**
 * Role-Based Access Control (RBAC) definitions for the BSU Debate Society.
 * Maps directly to the `officers` table constraints in Supabase and the 
 * governing documents (Constitution & Rules/Procedures).
 */

export enum Role {
  PRESIDENT = "president",
  VICE_PRESIDENT = "vice_president",
  EXECUTIVE_SECRETARY = "executive_secretary",
  SIA = "sia", // Secretary of Internal Affairs (Point Keeper / OIA Head)
  OIA_DIRECTOR = "oia_director", // Assistant/Deputy OIA
  OFRA = "ofra", // Office of Financial and Resource Affairs
  EXTERNAL_AFFAIRS = "external_affairs",
  BUSINESS_AFFAIRS = "business_affairs",
  PUBLIC_AFFAIRS = "public_affairs",
  CHIEF_ADVISER = "chief_adviser",
  CHANCELLOR_BATHALA = "chancellor_bathala",
  CHANCELLOR_KABUNIAN = "chancellor_kabunian",
  CHANCELLOR_LAON = "chancellor_laon",
  CHANCELLOR_MANAMA = "chancellor_manama",
  PENDING = "pending",
}

export enum House {
  BATHALA = "Bathala",
  KABUNIAN = "Kabunian",
  LAON = "Laon",
  MANAMA = "Manama",
  SOCIETY_WIDE = "Society-wide",
}

// --- Helper Identifiers ---

export const HOUSE_CHANCELLOR_ROLES = [
  Role.CHANCELLOR_BATHALA,
  Role.CHANCELLOR_KABUNIAN,
  Role.CHANCELLOR_LAON,
  Role.CHANCELLOR_MANAMA,
];

export const HIGH_COUNCIL_ROLES = [
  Role.PRESIDENT,
  Role.VICE_PRESIDENT,
  Role.EXECUTIVE_SECRETARY,
  Role.SIA,
  Role.OIA_DIRECTOR,
  Role.OFRA,
  Role.EXTERNAL_AFFAIRS,
  Role.BUSINESS_AFFAIRS,
  Role.PUBLIC_AFFAIRS,
];

export const HIGH_TRIBUNAL_ROLES = [
  Role.PRESIDENT, // Presiding Judge
  Role.CHIEF_ADVISER, // Appellate Presiding Authority
  ...HOUSE_CHANCELLOR_ROLES, // Jury of the Pillars
];

/**
 * Checks if a role belongs to a House Chancellor.
 */
export function isHouseChancellor(role: Role): boolean {
  return HOUSE_CHANCELLOR_ROLES.includes(role);
}

/**
 * Extracts the specific House from a Chancellor's role.
 * Returns null if the role is not a House Chancellor.
 */
export function getHouseFromRole(role: Role): House | null {
  switch (role) {
    case Role.CHANCELLOR_BATHALA: return House.BATHALA;
    case Role.CHANCELLOR_KABUNIAN: return House.KABUNIAN;
    case Role.CHANCELLOR_LAON: return House.LAON;
    case Role.CHANCELLOR_MANAMA: return House.MANAMA;
    default: return null;
  }
}

// --- Permission Matrix ---

export const RBAC = {
  /**
   * MEMBERSHIPS (Constitution Art. 5, Sec. 3)
   * House Councils exclusively recruit and accept their own members.
   * High Council (President/SIA) can oversee all.
   */
  canManageMemberships(role: Role, userHouse: House | null, targetHouse: House): boolean {
    if (role === Role.PRESIDENT || role === Role.SIA || role === Role.VICE_PRESIDENT) return true;
    if (isHouseChancellor(role)) {
      return userHouse === targetHouse;
    }
    return false;
  },

  /**
   * HOUSE POINTS & LEDGER (Rules Art. I, Sec. 11)
   * The Secretary of Internal Affairs (SIA) is the Point Keeper.
   * President has supreme oversight.
   */
  canManageHousePoints(role: Role): boolean {
    return role === Role.SIA || role === Role.PRESIDENT;
  },

  /**
   * INDIVIDUAL POINTS & CLAIMS (Rules Art. III, Sec. 6 & Annex A)
   * SIA verifies claims and maintains the Individual Debate Point Ledger.
   */
  canManageIndividualPoints(role: Role): boolean {
    return role === Role.SIA || role === Role.PRESIDENT;
  },

  /**
   * WHISTLEBLOWER & DISCIPLINE (Constitution Art. 3, Sec. 14 & Rules Art. VI)
   * Strictly confidential. Handled by OIA (SIA), Chief Adviser, and President.
   * House Chancellors can only handle Minor Violations for their own House.
   */
  canViewWhistleblower(role: Role): boolean {
    return role === Role.SIA || role === Role.OIA_DIRECTOR || role === Role.PRESIDENT || role === Role.CHIEF_ADVISER;
  },

  canManageDiscipline(role: Role, userHouse: House | null, respondentHouse: House | null): boolean {
    // High Tribunal / OIA can manage all major violations
    if (role === Role.SIA || role === Role.OIA_DIRECTOR || role === Role.PRESIDENT || role === Role.CHIEF_ADVISER) return true;
    // House Chancellors can only manage minor violations for their own house
    if (isHouseChancellor(role)) {
      return userHouse === respondentHouse;
    }
    return false;
  },

  /**
   * FINANCIAL RECORDS (Constitution Art. 8, Sec. 8 & Rules Art. V)
   * OFRA manages the General Fund and financial reporting.
   */
  canManageFinance(role: Role): boolean {
    return role === Role.OFRA || role === Role.PRESIDENT;
  },

  /**
   * SOSA REPORTS (Constitution Art. 8, Sec. 4(i))
   * Mandated exclusively for the President.
   */
  canManageSosa(role: Role): boolean {
    return role === Role.PRESIDENT;
  },

  /**
   * ELECTORAL PROTESTS & APPEALS (Rules Art. VII, Sec. 10 & Art. I, Sec. 8)
   * Adjudicated by the High Tribunal (President, Chief Adviser, Chancellors).
   */
  canManageElectoralProtests(role: Role): boolean {
    return HIGH_TRIBUNAL_ROLES.includes(role);
  },

  canManageAppeals(role: Role): boolean {
    // Appeals are reviewed by High Council / Chief Adviser
    return role === Role.PRESIDENT || role === Role.VICE_PRESIDENT || role === Role.CHIEF_ADVISER || isHouseChancellor(role);
  },

  /**
   * RECORDS ACCESS REQUESTS (Rules Art. VIII, Sec. 4)
   * Processed by Executive Secretary. House Chancellors handle House-level requests.
   */
  canManageRecordsAccess(role: Role, userHouse: House | null, requestScope: string, requestHouse: House | null): boolean {
    if (role === Role.EXECUTIVE_SECRETARY || role === Role.PRESIDENT || role === Role.SIA) return true;
    if (isHouseChancellor(role)) {
      // Chancellors can only process House-level requests for their own House
      return requestScope === "House-level" && userHouse === requestHouse;
    }
    return false;
  },

  /**
   * GENERAL ADMIN DASHBOARD ACCESS
   * Determines which sidebar links an officer can see.
   */
  canAccessAdminRoute(role: Role, route: string): boolean {
    const publicAdminRoutes = ["/admin/dashboard", "/admin/login", "/admin/logout"];
    if (publicAdminRoutes.includes(route)) return true;

    switch (route) {
      case "/admin/memberships":
        return role === Role.PRESIDENT || role === Role.SIA || role === Role.VICE_PRESIDENT || isHouseChancellor(role);
      
      case "/admin/points":
      case "/admin/individual-points":
      case "/admin/point-claims":
        return this.canManageHousePoints(role) || this.canManageIndividualPoints(role);
      
      case "/admin/whistleblower":
      case "/admin/discipline":
        return this.canViewWhistleblower(role) || isHouseChancellor(role); // Chancellors see their own
      
      case "/admin/finance":
        return this.canManageFinance(role);
      
      case "/admin/sosa":
        return this.canManageSosa(role);
      
      case "/admin/electoral-protests":
      case "/admin/appeals":
        return this.canManageElectoralProtests(role) || this.canManageAppeals(role);
      
      case "/admin/records-access":
        return role === Role.EXECUTIVE_SECRETARY || role === Role.PRESIDENT || role === Role.SIA || isHouseChancellor(role);

      case "/admin/house-cup":
      case "/admin/house-of-semester":
      case "/admin/debate-cup":
      case "/admin/league":
      case "/admin/nominations":
      case "/admin/support-requests":
      case "/admin/meetings":
      case "/admin/messages":
        // General High Council and Chancellors can view/manage society-wide events and leagues
        return HIGH_COUNCIL_ROLES.includes(role) || isHouseChancellor(role);
      
      default:
        return false;
    }
  }
};