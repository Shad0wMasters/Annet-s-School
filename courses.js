document.addEventListener('DOMContentLoaded', () => {
    // Get all elements
    const courseCards = document.querySelectorAll('.course-card');
    const enrollButtons = document.querySelectorAll('.enroll-button');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const contactModal = document.getElementById('contactModal');
    const closeContactModal = contactModal.querySelector('.close-modal');

    // Add hover effect to course cards
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Handle course filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Show/hide courses based on filter
            courseCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-level') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Function to check if user is logged in using main site's auth
    function isUserLoggedIn() {
        const user = sessionStorage.getItem('user') || localStorage.getItem('user');
        return user !== null;
    }

    // Function to get current user from main site's auth
    function getCurrentUser() {
        const user = sessionStorage.getItem('user') || localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Handle enroll button clicks
    enrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!isUserLoggedIn()) {
                // Redirect to main site login with return URL
                window.location.href = 'index.html#login';
                return;
            }

            // Get course info
            const courseCard = button.closest('.course-card');
            const courseInfo = {
                level: courseCard.querySelector('h2').textContent,
                price: courseCard.querySelector('.price').textContent + courseCard.querySelector('.period').textContent
            };
            
            // Store selected course
            localStorage.setItem('selectedCourse', JSON.stringify(courseInfo));
            
            // Show contact modal with animation
            contactModal.style.display = 'block';
            setTimeout(() => {
                contactModal.style.opacity = '1';
            }, 10);
        });
    });

    // Handle modal closing
    function closeModal() {
        contactModal.style.opacity = '0';
        setTimeout(() => {
            contactModal.style.display = 'none';
        }, 300);
    }

    closeContactModal.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });

    // Prevent closing when clicking inside modal content
    contactModal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Handle contact option clicks
    document.querySelectorAll('.contact-option').forEach(option => {
        option.addEventListener('click', () => {
            const user = getCurrentUser();
            const courseInfo = JSON.parse(localStorage.getItem('selectedCourse'));
            
            // Add enrollment to user's data
            if (user && courseInfo) {
                const enrollments = JSON.parse(localStorage.getItem(`enrollments_${user.email}`)) || [];
                enrollments.push({
                    course: courseInfo,
                    date: new Date().toISOString(),
                    status: 'pending'
                });
                localStorage.setItem(`enrollments_${user.email}`, JSON.stringify(enrollments));
            }

            // Close modal with animation
            closeModal();
        });
    });

    // Check for redirect from login
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'login' && isUserLoggedIn()) {
        const selectedCourse = localStorage.getItem('selectedCourse');
        if (selectedCourse) {
            contactModal.style.display = 'block';
            setTimeout(() => {
                contactModal.style.opacity = '1';
            }, 10);
        }
    }

    // Add smooth scroll for navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}); 