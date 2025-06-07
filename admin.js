// Check if user is logged in and has admin rights
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    if (!userData || (userData.role !== 'director' && userData.role !== 'creator')) {
        window.location.href = 'index.html';
        return;
    }

    // Update user menu
    updateUserMenu(userData);
    
    // Load initial data
    loadDashboardStats();
    loadUsers();
    loadCourses();
    loadGroups();
    loadTeachers();
    loadSettings();

    // Set up menu navigation
    setupNavigation();
});

// Update user menu in navigation
function updateUserMenu(userData) {
    const userMenu = document.querySelector('.user-menu');
    const userName = userMenu.querySelector('.user-name');
    const avatar = userMenu.querySelector('.avatar');

    userMenu.style.display = 'block';
    userName.textContent = userData.name;
    avatar.src = `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`;

    // Setup logout functionality
    document.querySelector('.logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    });
}

// Setup navigation between sections
function setupNavigation() {
    const menuItems = document.querySelectorAll('.admin-menu-item');
    const sections = document.querySelectorAll('.admin-section');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('data-section');

            // Update active states
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Load dashboard statistics
function loadDashboardStats() {
    const stats = {
        totalUsers: getTotalUsers(),
        activeCourses: getActiveCourses(),
        activeGroups: getActiveGroups(),
        totalTeachers: getTotalTeachers()
    };

    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('activeCourses').textContent = stats.activeCourses;
    document.getElementById('activeGroups').textContent = stats.activeGroups;
    document.getElementById('totalTeachers').textContent = stats.totalTeachers;
}

// Load users table
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${new Date(user.registrationDate).toLocaleDateString('ru-RU')}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteUser('${user.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Setup search functionality
    document.getElementById('userSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Load courses table
function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const tableBody = document.getElementById('coursesTableBody');
    tableBody.innerHTML = '';

    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.teacher}</td>
            <td>${course.students.length}</td>
            <td>${course.status}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editCourse('${course.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteCourse('${course.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Setup search functionality
    document.getElementById('courseSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Load groups table
function loadGroups() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const tableBody = document.getElementById('groupsTableBody');
    tableBody.innerHTML = '';

    groups.forEach(group => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${group.name}</td>
            <td>${group.course}</td>
            <td>${group.teacher}</td>
            <td>${group.students.length}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editGroup('${group.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteGroup('${group.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Setup search functionality
    document.getElementById('groupSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Load teachers table
function loadTeachers() {
    const teachers = JSON.parse(localStorage.getItem('teachers')) || [];
    const tableBody = document.getElementById('teachersTableBody');
    tableBody.innerHTML = '';

    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.name}</td>
            <td>${teacher.specialization}</td>
            <td>${teacher.groups.length}</td>
            <td>${teacher.totalStudents}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editTeacher('${teacher.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteTeacher('${teacher.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Setup search functionality
    document.getElementById('teacherSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings')) || {
        siteName: 'Annet\'s School',
        adminEmail: '',
        allowRegistration: true,
        emailVerification: true
    };

    document.getElementById('siteName').value = settings.siteName;
    document.getElementById('adminEmail').value = settings.adminEmail;
    document.getElementById('allowRegistration').checked = settings.allowRegistration;
    document.getElementById('emailVerification').checked = settings.emailVerification;

    // Setup settings form submission
    document.getElementById('siteSettingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings = {
            siteName: document.getElementById('siteName').value,
            adminEmail: document.getElementById('adminEmail').value
        };
        saveSettings(newSettings);
    });

    document.getElementById('registrationSettingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings = {
            allowRegistration: document.getElementById('allowRegistration').checked,
            emailVerification: document.getElementById('emailVerification').checked
        };
        saveSettings(newSettings);
    });
}

// Helper functions for statistics
function getTotalUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.length;
}

function getActiveCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    return courses.filter(course => course.status === 'active').length;
}

function getActiveGroups() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    return groups.length;
}

function getTotalTeachers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.filter(user => user.role === 'teacher').length;
}

// CRUD operations for users
function editUser(userId) {
    // Implementation for editing user
    console.log('Editing user:', userId);
}

function deleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(user => user.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
        loadDashboardStats();
    }
}

function showAddUserModal() {
    // Implementation for showing add user modal
    console.log('Showing add user modal');
}

// CRUD operations for courses
function editCourse(courseId) {
    // Implementation for editing course
    console.log('Editing course:', courseId);
}

function deleteCourse(courseId) {
    if (confirm('Вы уверены, что хотите удалить этот курс?')) {
        let courses = JSON.parse(localStorage.getItem('courses')) || [];
        courses = courses.filter(course => course.id !== courseId);
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
        loadDashboardStats();
    }
}

function showAddCourseModal() {
    // Implementation for showing add course modal
    console.log('Showing add course modal');
}

// CRUD operations for groups
function editGroup(groupId) {
    // Implementation for editing group
    console.log('Editing group:', groupId);
}

function deleteGroup(groupId) {
    if (confirm('Вы уверены, что хотите удалить эту группу?')) {
        let groups = JSON.parse(localStorage.getItem('groups')) || [];
        groups = groups.filter(group => group.id !== groupId);
        localStorage.setItem('groups', JSON.stringify(groups));
        loadGroups();
        loadDashboardStats();
    }
}

function showAddGroupModal() {
    // Implementation for showing add group modal
    console.log('Showing add group modal');
}

// CRUD operations for teachers
function editTeacher(teacherId) {
    // Implementation for editing teacher
    console.log('Editing teacher:', teacherId);
}

function deleteTeacher(teacherId) {
    if (confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
        let teachers = JSON.parse(localStorage.getItem('teachers')) || [];
        teachers = teachers.filter(teacher => teacher.id !== teacherId);
        localStorage.setItem('teachers', JSON.stringify(teachers));
        loadTeachers();
        loadDashboardStats();
    }
}

function showAddTeacherModal() {
    // Implementation for showing add teacher modal
    console.log('Showing add teacher modal');
}

// Save settings
function saveSettings(newSettings) {
    const currentSettings = JSON.parse(localStorage.getItem('siteSettings')) || {};
    const updatedSettings = { ...currentSettings, ...newSettings };
    localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
    alert('Настройки сохранены успешно!');
} 