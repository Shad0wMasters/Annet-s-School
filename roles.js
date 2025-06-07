// Role definitions
const ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    DIRECTOR: 'director',
    CREATOR: 'creator'
};

// Role hierarchy (higher roles inherit permissions from lower roles)
const ROLE_HIERARCHY = {
    creator: ['director', 'teacher', 'student'],
    director: ['teacher', 'student'],
    teacher: ['student'],
    student: []
};

// Permission definitions
const PERMISSIONS = {
    VIEW_COURSES: 'view_courses',
    JOIN_GROUPS: 'join_groups',
    MANAGE_OWN_PROFILE: 'manage_own_profile',
    CREATE_GROUPS: 'create_groups',
    MANAGE_GROUPS: 'manage_groups',
    MANAGE_STUDENTS: 'manage_students',
    MANAGE_TEACHERS: 'manage_teachers',
    MANAGE_CONTENT: 'manage_content',
    MANAGE_SITE: 'manage_site',
    VIEW_ANALYTICS: 'view_analytics'
};

// Role permissions mapping
const ROLE_PERMISSIONS = {
    student: [
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.JOIN_GROUPS,
        PERMISSIONS.MANAGE_OWN_PROFILE
    ],
    teacher: [
        PERMISSIONS.CREATE_GROUPS,
        PERMISSIONS.MANAGE_GROUPS,
        PERMISSIONS.MANAGE_STUDENTS,
        PERMISSIONS.MANAGE_CONTENT
    ],
    director: [
        PERMISSIONS.MANAGE_TEACHERS,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_SITE
    ],
    creator: [
        // Creator has all permissions through inheritance
    ]
};

// Helper functions for role management
function hasRole(user, role) {
    return user && user.role === role;
}

function hasPermission(user, permission) {
    if (!user || !user.role) return false;
    
    const userRole = user.role;
    const inheritedRoles = [userRole, ...(ROLE_HIERARCHY[userRole] || [])];
    
    return inheritedRoles.some(role => 
        ROLE_PERMISSIONS[role] && ROLE_PERMISSIONS[role].includes(permission)
    );
}

function isRoleHigherOrEqual(userRole, targetRole) {
    if (userRole === targetRole) return true;
    return ROLE_HIERARCHY[userRole]?.includes(targetRole) || false;
}

// Export the role management system
window.RoleManager = {
    ROLES,
    PERMISSIONS,
    hasRole,
    hasPermission,
    isRoleHigherOrEqual
}; 