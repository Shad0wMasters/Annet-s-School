document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const profileSections = document.querySelectorAll('.profile-section');
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const avatarImg = document.querySelector('.large-avatar');
    const roleDisplay = document.querySelector('.role-display');
    const roleDescription = document.querySelector('.role-description');
    const creatorCodeInput = document.getElementById('creatorCode');
    const verifyButton = document.getElementById('verifyCode');
    const codeInputGroup = document.querySelector('.code-input-group');

    // Код создателя
    const CREATOR_CODE = 'AnnetsSchool2024';

    // Описания ролей
    const ROLE_DESCRIPTIONS = {
        student: 'Доступ к курсам и учебным материалам.',
        teacher: 'Управление группами и материалами курсов.',
        director: 'Управление школой и аналитика.',
        creator: 'Полный доступ к системе.'
    };

    // Названия ролей на русском
    const ROLE_NAMES = {
        student: 'СТУДЕНТ',
        teacher: 'УЧИТЕЛЬ',
        director: 'ДИРЕКТОР',
        creator: 'АДМИНИСТРАТОР'
    };

    // Функция для обновления аватара везде
    function updateAvatarEverywhere(imageData) {
        return new Promise((resolve) => {
            // Получаем текущего пользователя
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                console.error('Пользователь не найден');
                return;
            }

            // Обновляем все аватары на странице
            const avatars = document.querySelectorAll('.avatar, .large-avatar');
            avatars.forEach(avatar => {
                avatar.src = imageData;
            });

            // Сохраняем аватар в localStorage
            localStorage.setItem(`avatar_${currentUser.email}`, imageData);

            // Обновляем данные пользователя
            currentUser.avatar = imageData;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            sessionStorage.setItem('user', JSON.stringify(currentUser));

            // Обновляем пользователя в общем списке
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex].avatar = imageData;
                localStorage.setItem('users', JSON.stringify(users));
            }

            resolve();
        });
    }

    // Функция для обработки загрузки файла
    function handleAvatarUpload(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('Файл не выбран');
                return;
            }

            // Проверяем тип файла
            if (!file.type.startsWith('image/')) {
                reject('Пожалуйста, выберите изображение');
                return;
            }

            // Проверяем размер файла (максимум 5MB)
            if (file.size > 5 * 1024 * 1024) {
                reject('Размер файла не должен превышать 5MB');
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject('Ошибка при чтении файла');
            };

            reader.readAsDataURL(file);
        });
    }

    // Инициализация обработчиков аватара
    function initializeAvatarHandlers() {
        const avatarUpload = document.getElementById('avatar-upload');
        const avatarPreview = document.getElementById('avatar-preview');
        const avatarForm = document.getElementById('avatarForm');

        if (avatarUpload && avatarPreview) {
            avatarUpload.addEventListener('change', async (e) => {
                try {
                    const file = e.target.files[0];
                    const imageData = await handleAvatarUpload(file);
                    
                    // Предварительный просмотр
                    avatarPreview.src = imageData;
                    
                    // Обновляем аватар везде
                    await updateAvatarEverywhere(imageData);
                    
                    // Сбрасываем форму
                    if (avatarForm) {
                        avatarForm.reset();
                    }

                    alert('Аватар успешно обновлен!');
                } catch (error) {
                    alert(error);
                    if (avatarForm) {
                        avatarForm.reset();
                    }
                }
            });
        }
    }

    // Инициализация профиля
    function initializeProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('user'));
        if (!currentUser) {
            window.location.href = 'index.html';
            return;
        }

        // Обновляем информацию профиля
        if (profileName) profileName.textContent = currentUser.name;
        if (profileEmail) profileEmail.textContent = currentUser.email;

        // Загружаем аватар
        const avatarPreview = document.getElementById('avatar-preview');
        if (avatarPreview) {
            const savedAvatar = localStorage.getItem(`avatar_${currentUser.email}`);
            const userAvatar = currentUser.avatar;
            const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`;
            
            avatarPreview.src = savedAvatar || userAvatar || defaultAvatar;
        }

        // Заполняем форму профиля
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        
        if (nameInput) nameInput.value = currentUser.name;
        if (emailInput) emailInput.value = currentUser.email;
        if (phoneInput) phoneInput.value = currentUser.phone || '';

        // Обновляем отображение роли
        if (roleDisplay) {
            roleDisplay.textContent = ROLE_NAMES[currentUser.role] || ROLE_NAMES.student;
            roleDisplay.className = `role-display ${currentUser.role || 'student'}`;
        }

        // Обновляем описание роли
        if (roleDescription) {
            roleDescription.textContent = ROLE_DESCRIPTIONS[currentUser.role] || ROLE_DESCRIPTIONS.student;
        }

        // Скрываем форму кода создателя, если уже создатель
        const creatorCodeSection = document.querySelector('.creator-code-section');
        if (currentUser.role === 'creator' && creatorCodeSection) {
            creatorCodeSection.style.display = 'none';
        }

        // Загружаем настройки уведомлений
        loadNotificationSettings(currentUser);

        // Инициализируем обработчики аватара
        initializeAvatarHandlers();
    }

    // Обработка навигации по боковому меню
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            
            // Обновляем активные состояния
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Показываем целевую секцию
            profileSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Обработка формы основных настроек
    const mainForm = document.getElementById('mainForm');
    if (mainForm) {
        mainForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('user'));
            if (currentUser) {
                // Сохраняем старый аватар
                const oldAvatar = localStorage.getItem(`avatar_${currentUser.email}`);
                
                // Обновляем данные пользователя
                const newEmail = document.getElementById('email').value;
                currentUser.name = document.getElementById('name').value;
                currentUser.email = newEmail;
                currentUser.phone = document.getElementById('phone').value;
                
                // Если email изменился, переносим аватар на новый email
                if (oldAvatar && currentUser.email !== newEmail) {
                    localStorage.setItem(`avatar_${newEmail}`, oldAvatar);
                    localStorage.removeItem(`avatar_${currentUser.email}`);
                }
                
                // Сохраняем обновленные данные пользователя
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                sessionStorage.setItem('user', JSON.stringify(currentUser));
                
                // Обновляем отображение на странице
                if (profileName) profileName.textContent = currentUser.name;
                if (profileEmail) profileEmail.textContent = currentUser.email;
                
                // Обновляем аватар везде
                const savedAvatar = localStorage.getItem(`avatar_${newEmail}`) || currentUser.avatar;
                if (savedAvatar) {
                    updateAvatarEverywhere(savedAvatar);
                } else {
                    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`;
                    updateAvatarEverywhere(defaultAvatar);
                }
                
                alert('Изменения сохранены успешно!');
            }
        });
    }

    // Обработка формы безопасности
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('user'));
            if (currentUser && currentUser.password === currentPassword) {
                if (newPassword === confirmPassword) {
                    currentUser.password = newPassword;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    sessionStorage.setItem('user', JSON.stringify(currentUser));
                    alert('Пароль успешно обновлен!');
                    securityForm.reset();
                } else {
                    alert('Новые пароли не совпадают!');
                }
            } else {
                alert('Текущий пароль неверен!');
            }
        });
    }

    // Загрузка настроек уведомлений
    function loadNotificationSettings(user) {
        const settings = JSON.parse(localStorage.getItem(`notifications_${user.email}`)) || {
            email: true,
            course: true,
            group: false
        };

        const emailNotif = document.getElementById('emailNotif');
        const courseNotif = document.getElementById('courseNotif');
        const groupNotif = document.getElementById('groupNotif');

        if (emailNotif) emailNotif.checked = settings.email;
        if (courseNotif) courseNotif.checked = settings.course;
        if (groupNotif) groupNotif.checked = settings.group;

        // Обработчики изменений
        [emailNotif, courseNotif, groupNotif].forEach(checkbox => {
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    const newSettings = {
                        email: emailNotif.checked,
                        course: courseNotif.checked,
                        group: groupNotif.checked
                    };
                    localStorage.setItem(`notifications_${user.email}`, JSON.stringify(newSettings));
                });
            }
        });
    }

    // Обработка проверки кода создателя
    if (verifyButton) {
        verifyButton.addEventListener('click', () => {
            const code = creatorCodeInput.value.trim();
            
            if (code === CREATOR_CODE) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('user'));
                if (currentUser) {
                    currentUser.role = 'creator';
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    sessionStorage.setItem('user', JSON.stringify(currentUser));

                    // Показываем успешное обновление
                    codeInputGroup.classList.remove('error');
                    roleDisplay.textContent = ROLE_NAMES.creator;
                    roleDisplay.className = 'role-display creator verification-success';
                    roleDescription.textContent = ROLE_DESCRIPTIONS.creator;

                    // Скрываем форму кода
                    setTimeout(() => {
                        document.querySelector('.creator-code-section').style.display = 'none';
                    }, 1000);

                    // Показываем сообщение об успехе
                    alert('Доступ подтвержден. Страница будет перезагружена.');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            } else {
                // Показываем ошибку
                codeInputGroup.classList.add('error');
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Неверный ключ доступа';
                
                // Удаляем предыдущее сообщение об ошибке, если оно есть
                const existingError = codeInputGroup.nextElementSibling;
                if (existingError && existingError.classList.contains('error-message')) {
                    existingError.remove();
                }
                
                codeInputGroup.after(errorMessage);
                creatorCodeInput.value = '';
            }
        });
    }

    // Запускаем инициализацию при загрузке страницы
    initializeProfile();
}); 