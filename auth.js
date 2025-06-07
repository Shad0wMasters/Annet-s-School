// Shared authentication functions
function isUserLoggedIn() {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    return localUser !== null || sessionUser !== null;
}

function getCurrentUser() {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    const userData = localUser || sessionUser;
    
    try {
        return userData ? JSON.parse(userData) : null;
    } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
    }
}

function saveUserData(userData) {
    // Save to both storage systems for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('user', JSON.stringify(userData));
    
    // Also save to users list if not already there
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (!users.some(u => u.email === userData.email)) {
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function logout() {
    // Clear both storage systems
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    
    // Redirect to home if on protected page
    const protectedPages = ['groups.html', 'courses.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
        window.location.href = 'index.html';
    }
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const protectedPages = ['groups.html', 'courses.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isUserLoggedIn()) {
        window.location.href = 'index.html#login';
        return;
    }
}); 