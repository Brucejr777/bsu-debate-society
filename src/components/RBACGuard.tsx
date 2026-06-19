// src/components/RBACGuard.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Role, House } from "@/lib/rbac";

/**
 * Officer profile type matching the response from /api/auth/me
 */
export interface Officer {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  house_affiliation: House;
}

interface RBACGuardProps {
  /** The currently logged-in officer's profile */
  officer: Officer | null;
  
  /** 
   * A function that evaluates if the officer has permission.
   * Use the RBAC matrix from @/lib/rbac here.
   * Example: (officer) => RBAC.canManageHousePoints(officer.role)
   */
  checkPermission: (officer: Officer) => boolean;
  
  /** The protected UI content */
  children: ReactNode;
  
  /** Optional custom fallback UI if access is denied */
  fallback?: ReactNode;
}

/**
 * RBACGuard
 * Wraps admin UI elements to enforce Role-Based Access Control on the frontend.
 * Prevents unauthorized officers from seeing or interacting with restricted modules.
 */
export default function RBACGuard({ 
  officer, 
  checkPermission, 
  children, 
  fallback 
}: RBACGuardProps) {
  
  // 1. Check if user is authenticated and has an officer profile
  if (!officer) {
    return fallback || (
      <AccessDenied 
        title="Authentication Required"
        message="You must be logged in with an active officer profile to access this module." 
      />
    );
  }

  // 2. Check if the officer's role is still pending assignment
  if (officer.role === Role.PENDING) {
    return fallback || (
      <AccessDenied 
        title="Role Pending Assignment"
        message="Your officer profile is active, but your role has not yet been assigned. Please contact the Executive Secretary or the President to be assigned a role." 
      />
    );
  }

  // 3. Evaluate the specific RBAC permission
  const hasPermission = checkPermission(officer);

  if (!hasPermission) {
    return fallback || (
      <AccessDenied 
        title="Constitutional Clearance Denied"
        message="You do not have the jurisdictional authority or constitutional clearance to access this module. This action is restricted to authorized officers per the Society's Rules and Procedures." 
      />
    );
  }

  // 4. Render the protected children if all checks pass
  return <>{children}</>;
}

/**
 * Default Fallback UI for Access Denied states
 */
function AccessDenied({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-900/40 bg-red-950/20 p-10 text-center shadow-xl shadow-black/30">
      {/* Shield/Ban Icon */}
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-900/30">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          className="size-8 text-red-400"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold text-red-200">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-red-300/80">
        {message}
      </p>
      
      <Link 
        href="/admin/dashboard" 
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-700 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
        </svg>
        Return to Dashboard
      </Link>
    </div>
  );
}