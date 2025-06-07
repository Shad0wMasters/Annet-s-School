document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Get modal elements
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    // Get login/register buttons from nav.js
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');

    // Modal handling
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');
            
            // Сбрасываем ошибки
            hideError(email);
            hideError(password);
            
            // Получаем пользователей
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Ищем пользователя
            const user = users.find(u => u.email === email.value && u.password === password.value);
            
            if (user) {
                // Сохраняем данные пользователя
                localStorage.setItem('currentUser', JSON.stringify(user));
                sessionStorage.setItem('user', JSON.stringify(user));
                
                // Закрываем модальное окно
                loginModal.style.display = 'none';
                loginForm.reset();
                
                // Обновляем навигацию
                updateNavBar();
                
                // Показываем приветствие
                let welcomeMsg = 'Добро пожаловать!';
                switch (user.role) {
                    case 'teacher':
                        welcomeMsg = 'С возвращением, Учитель! Ваши классы ждут.';
                        break;
                    case 'director':
                        welcomeMsg = 'Добро пожаловать, Директор! Панель управления готова.';
                        break;
                    case 'creator':
                        welcomeMsg = 'С возвращением, Администратор! Полный доступ предоставлен.';
                        break;
                    default:
                        welcomeMsg = 'Добро пожаловать в Школу Аниты!';
                }
                alert(welcomeMsg);
                
                // Перенаправляем на профиль
                window.location.href = 'profile.html';
            } else {
                showError(email, 'Неверный email или пароль');
            }
        });
    }

    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Validate email format
            if (!validateEmail(email)) {
                showError(document.getElementById('registerEmail'), 'Пожалуйста, введите корректный email');
                return;
            }

            // Validate password
            if (!validatePassword(password)) {
                showError(document.getElementById('registerPassword'), 'Пароль должен быть не менее 8 символов');
                return;
            }

            // Check if passwords match
            if (password !== confirmPassword) {
                showError(document.getElementById('registerConfirmPassword'), 'Пароли не совпадают');
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                showError(document.getElementById('registerEmail'), 'Этот email уже зарегистрирован');
                return;
            }
            
            // Create new user data
            const userData = {
                name: name,
                email: email,
                password: password,
                role: 'student',
                registrationDate: new Date().toISOString()
            };

            // Check for creator code
            const creatorCode = document.getElementById('creatorCode');
            if (creatorCode && creatorCode.value === 'AnnetsSchool2024') {
                userData.role = 'creator';
            }
            
            // Save to users array
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Save current user
            localStorage.setItem('currentUser', JSON.stringify(userData));
            sessionStorage.setItem('user', JSON.stringify(userData));
            
            // Close modal and reset form
            const registerModal = document.getElementById('registerModal');
            if (registerModal) {
                registerModal.style.display = 'none';
            }
            registerForm.reset();
            
            // Update navigation
            updateNavBar();
            
            alert('Регистрация успешна! Добро пожаловать в Школу Аниты!');
            
            // Redirect to profile page
            window.location.href = 'profile.html';
        });
    }

    // Button ripple effect
    const buttons = document.querySelectorAll('.cta-button, .contact-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Bubble animation
    const createBubble = () => {
        const bubbles = document.querySelector('.bubbles');
        if (!bubbles) return;

        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 60 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 4 + 6}s`;
        
        bubbles.appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, 10000);
    };

    // Create bubbles periodically
    setInterval(createBubble, 1000);

    // Wave animation enhancement
    const waves = document.querySelectorAll('.wave');
    waves.forEach((wave, index) => {
        wave.style.animationDelay = `${index * 0.2}s`;
    });

    // Navigation scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksArray = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');
    });

    // Get DOM elements
    const userMenu = document.querySelector('.user-menu');
    const logoutBtn = document.querySelector('.logout-btn');
    const profileIcon = document.querySelector('.profile-icon');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Toggle dropdown menu
    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (userMenu && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });

    // Prevent dropdown from closing when clicking inside
    if (dropdownMenu) {
        dropdownMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Check if user is logged in on page load
    function checkLoginStatus() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            userMenu.style.display = 'block';
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            updateUserInfo();
        } else {
            userMenu.style.display = 'none';
            loginBtn.style.display = 'inline-block';
            registerBtn.style.display = 'inline-block';
        }
    }

    // Call on page load
    checkLoginStatus();

    // Update user info in navbar
    function updateUserInfo() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const navbarUsername = document.querySelector('.user-name');
            const navbarAvatar = document.querySelector('.avatar');
            const userMenuAvatar = document.querySelector('.user-menu .avatar');
            
            if (navbarUsername) {
                navbarUsername.textContent = currentUser.name;
            }
            
            // Загружаем аватар
            const savedAvatar = localStorage.getItem(`avatar_${currentUser.email}`) || currentUser.avatar;
            const avatarSrc = savedAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`;
            
            if (navbarAvatar) {
                navbarAvatar.src = avatarSrc;
            }
            if (userMenuAvatar) {
                userMenuAvatar.src = avatarSrc;
            }
        }
    }

    // Check for avatar updates every second
    const updateInterval = setInterval(updateUserInfo, 1000);

    // Store registered users
    let registeredUsers = [];

    // Form Validation Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function showError(inputElement, message) {
        const errorElement = document.getElementById(inputElement.id + 'Error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
        inputElement.classList.remove('valid');
        inputElement.parentElement.classList.add('error-shake');
        setTimeout(() => {
            inputElement.parentElement.classList.remove('error-shake');
        }, 300);
    }

    function hideError(inputElement) {
        const errorElement = document.getElementById(inputElement.id + 'Error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
        inputElement.classList.add('valid');
    }

    // Function to check if user is logged in
    function isUserLoggedIn() {
        const user = sessionStorage.getItem('user') || localStorage.getItem('user');
        return user !== null;
    }

    // Function to get current user
    function getCurrentUser() {
        const user = sessionStorage.getItem('user') || localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Function to save user data
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

    // Load registered users from localStorage on page load
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
        registeredUsers = JSON.parse(savedUsers);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Intersection Observer for animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe course cards for animation
    document.querySelectorAll('.course-card').forEach(card => {
        observer.observe(card);
    });

    // Add hover effect to course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = +counter.innerText;
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Course Card Hover Effect with Tilt
    courseCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Feature Card Animation
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });

    // Parallax Effect for Statistics Section
    const statistics = document.querySelector('.statistics');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (statistics) {
            statistics.style.backgroundPosition = `center ${rate}px`;
        }
    });

    // Scroll handling
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollToTopButton = document.querySelector('.scroll-to-top');

    // Update scroll progress
    window.addEventListener('scroll', () => {
        // Calculate scroll progress
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = window.scrollY / totalScroll;
        scrollProgress.style.transform = `scaleX(${progress})`;
        
        // Show/hide scroll to top button
        if (window.scrollY > 500) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });

    // Smooth scroll to top
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('user');
            checkLoginStatus();
            window.location.href = 'index.html';
        });
    }

    // Cleanup interval on page unload
    window.addEventListener('unload', () => {
        clearInterval(updateInterval);
    });

    // Handle menu items clicks
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('logout-btn')) {
                return; // Let logout button handle itself
            }

            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                e.preventDefault();
                alert('Please log in to access this feature');
                loginModal.style.display = 'block';
            }
        });
    });

    // Функция обновления навигации
    function updateNavBar() {
        const userMenu = document.querySelector('.user-menu');
        const userName = userMenu.querySelector('.user-name');
        const avatar = userMenu.querySelector('.avatar');
        const loginBtn = document.querySelector('.login-btn');
        const registerBtn = document.querySelector('.register-btn');
        const adminLink = userMenu.querySelector('.admin-link');

        const userData = JSON.parse(localStorage.getItem('currentUser'));

        if (userData) {
            userMenu.style.display = 'block';
            userName.textContent = userData.name;
            
            // Загружаем аватар с приоритетом
            const savedAvatar = localStorage.getItem(`avatar_${userData.email}`);
            const userAvatar = userData.avatar;
            const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`;
            
            // Используем первый доступный аватар
            avatar.src = savedAvatar || userAvatar || defaultAvatar;
            
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';

            // Show admin link for director and creator roles
            if (adminLink) {
                adminLink.style.display = (userData.role === 'director' || userData.role === 'creator') ? 'flex' : 'none';
            }
        } else {
            userMenu.style.display = 'none';
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'block';
            if (adminLink) {
                adminLink.style.display = 'none';
            }
        }
    }

    // Инициализация при загрузке
    updateNavBar();
}); 