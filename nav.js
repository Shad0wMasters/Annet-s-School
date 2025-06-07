// Create and insert navigation bar
function createNavBar() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="nav-brand">
            <a href="index.html">Anita's School</a>
        </div>
        <div class="nav-links">
            <a href="index.html">Главная</a>
            <a href="courses.html">Курсы</a>
            <a href="groups.html">Группы</a>
            <a href="#contact">Контакты</a>
        </div>
        <div class="nav-buttons">
            <button class="login-btn">Войти</button>
            <button class="register-btn">Регистрация</button>
            <div class="user-menu" style="display: none;">
                <div class="user-info">
                    <img class="avatar" src="" alt="Avatar">
                    <span class="user-name"></span>
                    <span class="role-badge"></span>
                </div>
                <div class="dropdown-menu">
                    <!-- Common menu items -->
                    <a href="profile.html" class="menu-item" data-role="student,teacher,director,creator">
                        <i class="fas fa-user"></i>
                        Профиль
                    </a>
                    <a href="groups.html" class="menu-item" data-role="student">
                        <i class="fas fa-users"></i>
                        Мои группы
                    </a>
                    
                    <!-- Teacher menu items -->
                    <a href="manage-groups.html" class="menu-item" data-role="teacher,director,creator">
                        <i class="fas fa-chalkboard-teacher"></i>
                        Управление группами
                    </a>
                    <a href="manage-students.html" class="menu-item" data-role="teacher,director,creator">
                        <i class="fas fa-user-graduate"></i>
                        Управление студентами
                    </a>
                    
                    <!-- Director menu items -->
                    <a href="manage-teachers.html" class="menu-item" data-role="director,creator">
                        <i class="fas fa-user-tie"></i>
                        Управление учителями
                    </a>
                    <a href="analytics.html" class="menu-item" data-role="director,creator">
                        <i class="fas fa-chart-bar"></i>
                        Аналитика
                    </a>
                    
                    <!-- Creator menu items -->
                    <a href="site-settings.html" class="menu-item" data-role="creator">
                        <i class="fas fa-cogs"></i>
                        Настройки сайта
                    </a>
                    
                    <div class="divider"></div>
                    <a href="#" class="menu-item logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        Выйти
                    </a>
                </div>
            </div>
        </div>
    `;

    // Insert at the beginning of body
    document.body.insertBefore(nav, document.body.firstChild);
    
    // Add event listeners
    const userMenu = nav.querySelector('.user-menu');
    const userInfo = nav.querySelector('.user-info');
    const dropdownMenu = nav.querySelector('.dropdown-menu');
    const logoutBtn = nav.querySelector('.logout-btn');
    const loginBtn = nav.querySelector('.login-btn');
    const registerBtn = nav.querySelector('.register-btn');

    // Check login status on load
    checkLoginStatus();

    // Logout handler
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('mainUserData');
        sessionStorage.removeItem('user');
        checkLoginStatus();
        // Redirect to home if on protected page
        const protectedPages = ['groups.html', 'profile.html', 'manage-groups.html', 'manage-students.html', 'manage-teachers.html', 'analytics.html', 'site-settings.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'index.html';
        }
    });

    // Login button handler
    loginBtn.addEventListener('click', () => {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'block';
    });

    // Register button handler
    registerBtn.addEventListener('click', () => {
        const registerModal = document.getElementById('registerModal');
        if (registerModal) registerModal.style.display = 'block';
    });

    function checkLoginStatus() {
        const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('user');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            userMenu.style.display = 'block';
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            updateUserInfo(userData);
            
            // Set role on user menu for styling
            userMenu.setAttribute('data-role', userData.role);
            
            // Show/hide menu items based on role
            const menuItems = dropdownMenu.querySelectorAll('.menu-item[data-role]');
            menuItems.forEach(item => {
                const allowedRoles = item.getAttribute('data-role').split(',');
                item.style.display = allowedRoles.includes(userData.role) ? 'flex' : 'none';
            });
        } else {
            userMenu.style.display = 'none';
            loginBtn.style.display = 'inline-block';
            registerBtn.style.display = 'inline-block';
        }
    }

    function updateUserInfo(user) {
        if (!user) return;
        
        const userNameSpan = userMenu.querySelector('.user-name');
        const avatarImg = userMenu.querySelector('.avatar');
        const roleBadge = userMenu.querySelector('.role-badge');
        
        if (userNameSpan) userNameSpan.textContent = user.name;
        if (avatarImg) {
            const avatarSrc = localStorage.getItem(`avatar_${user.email}`) || 
                             `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`;
            avatarImg.src = avatarSrc;
        }
        if (roleBadge) {
            roleBadge.textContent = user.role.toUpperCase();
            roleBadge.className = `role-badge ${user.role}`;
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', createNavBar);

// Add CSS styles for navigation
function addNavStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            background: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }

        .nav-brand a {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            color: #666;
            text-decoration: none;
            transition: color 0.3s;
        }

        .nav-links a:hover {
            color: #333;
        }

        .auth-section {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .login-btn, .register-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .login-btn {
            background: #f0f0f0;
            color: #333;
        }

        .register-btn {
            background: #007bff;
            color: white;
        }

        .user-menu {
            position: relative;
            cursor: pointer;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .user-info:hover {
            background: #f0f0f0;
        }

        .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
        }

        .user-name {
            color: #333;
            font-weight: 500;
        }

        .dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 0.5rem 0;
            min-width: 200px;
        }

        .dropdown-menu.show {
            display: block;
        }

        .dropdown-menu a {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            color: #333;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .dropdown-menu a:hover {
            background: #f0f0f0;
        }

        .dropdown-menu i {
            width: 20px;
            text-align: center;
            color: #666;
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .navbar {
                padding: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addNavStyles();
    createNavBar();
}); 