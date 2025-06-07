document.addEventListener('DOMContentLoaded', () => {
    const groupsList = document.querySelector('.groups-list');
    const noGroupsMessage = document.querySelector('.no-groups-message');
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser') || sessionStorage.getItem('user');
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'index.html#login';
        return;
    }

    // User is logged in, show their groups
    showUserGroups(JSON.parse(currentUser));

    function showUserGroups(user) {
        // Get user's groups
        const userGroups = JSON.parse(localStorage.getItem(`groups_${user.email}`)) || [];
        
        if (userGroups.length === 0) {
            if (noGroupsMessage) noGroupsMessage.style.display = 'block';
            if (groupsList) groupsList.style.display = 'none';
        } else {
            if (noGroupsMessage) noGroupsMessage.style.display = 'none';
            if (groupsList) {
                groupsList.style.display = 'grid';
                displayGroups(userGroups);
            }
        }
    }

    function displayGroups(groups) {
        if (!groupsList) return;
        
        groupsList.innerHTML = '';
        groups.forEach(group => {
            const groupCard = createGroupCard(group);
            groupsList.appendChild(groupCard);
        });
    }

    function createGroupCard(group) {
        const card = document.createElement('div');
        card.className = 'group-card';
        
        card.innerHTML = `
            <div class="group-header">
                <div class="group-icon">
                    <i class="fas ${group.icon || 'fa-users'}"></i>
                </div>
                <div class="group-info">
                    <h3>${group.name}</h3>
                    <p>${group.level}</p>
                </div>
            </div>
            <div class="group-details">
                <div class="detail-item">
                    <i class="fas fa-calendar"></i>
                    <span>${group.schedule}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-user-friends"></i>
                    <span>${group.members} members</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <span>Teacher: ${group.teacher}</span>
                </div>
            </div>
            <div class="group-actions">
                <button class="group-btn info-btn">
                    <i class="fas fa-info-circle"></i>
                    Details
                </button>
                <button class="group-btn join-btn">
                    <i class="fas fa-sign-in-alt"></i>
                    Join Class
                </button>
            </div>
        `;

        // Add event listeners for buttons
        const infoBtn = card.querySelector('.info-btn');
        const joinBtn = card.querySelector('.join-btn');

        infoBtn.addEventListener('click', () => showGroupDetails(group));
        joinBtn.addEventListener('click', () => joinGroup(group));

        return card;
    }

    function showGroupDetails(group) {
        // Implement group details view
        console.log('Show details for:', group);
        alert('Group details feature coming soon!');
    }

    function joinGroup(group) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('user'));
        if (currentUser && currentUser.email) {
            const userGroups = JSON.parse(localStorage.getItem(`groups_${currentUser.email}`)) || [];
            if (!userGroups.some(g => g.id === group.id)) {
                userGroups.push(group);
                localStorage.setItem(`groups_${currentUser.email}`, JSON.stringify(userGroups));
                alert('Successfully joined the group!');
                showUserGroups(currentUser);
            } else {
                alert('You are already a member of this group');
            }
        }
    }

    // Add sample groups if none exist
    if (!localStorage.getItem('sampleGroups')) {
        const sampleGroups = [
            {
                id: 1,
                name: "Beginner English A1",
                level: "Beginner",
                schedule: "Mon, Wed 18:00-19:30",
                members: 5,
                teacher: "Anna Smith",
                icon: "fa-book"
            },
            {
                id: 2,
                name: "Business English",
                level: "Intermediate",
                schedule: "Tue, Thu 19:00-20:30",
                members: 8,
                teacher: "John Davis",
                icon: "fa-briefcase"
            }
        ];
        localStorage.setItem('sampleGroups', JSON.stringify(sampleGroups));
    }
}); 