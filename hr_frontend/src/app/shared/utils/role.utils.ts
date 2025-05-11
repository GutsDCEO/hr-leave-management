// src/app/shared/utils/role.utils.ts

// Defines UI permissions for different roles
export type RolePermissions = {
    canViewDashboard: boolean;
    canManageUsers: boolean;
    canApproveLeaves: boolean;
    canClockInOut: boolean;
};

// Maps roles to their UI permissions
export function getPermissionsForRole(role: string | null): RolePermissions {
    switch (role) {
        case 'ADMIN':
            return {
                canViewDashboard: true,
                canManageUsers: true,
                canApproveLeaves: true,
                canClockInOut: false
            };
        case 'MANAGER':
            return {
                canViewDashboard: true,
                canManageUsers: false,
                canApproveLeaves: true,
                canClockInOut: false
            };
        case 'EMPLOYEE':
            return {
                canViewDashboard: true,
                canManageUsers: false,
                canApproveLeaves: false,
                canClockInOut: true
            };
        default:
            return {
                canViewDashboard: false,
                canManageUsers: false,
                canApproveLeaves: false,
                canClockInOut: false
            };
    }
}

export function getPermissionsForRoles(role: string | null): RolePermissions {
    if (!role) {
        return {
            canViewDashboard: false,
            canManageUsers: false,
            canApproveLeaves: false,
            canClockInOut: false
        };
    }
    return getPermissionsForRole(role);
}