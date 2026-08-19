/**
 * FoodRescue PH - Dashboard JavaScript (dashboard.js)
 * Manages user profile state, active donation posts, and local storage synchronization for dashboard.html.
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

/**
 * Initializes dashboard data and UI elements
 */
function initDashboard() {
    loadUserProfile();
    loadUserDashboardPosts();
}

/**
 * Loads and displays the logged-in user's details from localStorage
 */
function loadUserProfile() {
    const nameDisplay = document.getElementById('user-name-display');
    const roleDisplay = document.getElementById('user-role-display');

    const savedName = localStorage.getItem('foodRescueUserName');
    const savedBarangay = localStorage.getItem('foodRescueBarangay');

    if (nameDisplay && savedName) {
        nameDisplay.textContent = savedName;
    }

    if (roleDisplay && savedBarangay) {
        roleDisplay.textContent = `Barangay ${savedBarangay} Member`;
    }
}

/**
 * Loads user-created active posts onto the dashboard
 */
function loadUserDashboardPosts() {
    const container = document.getElementById('user-posts-container');
    if (!container) return;

    let userPosts = JSON.parse(localStorage.getItem('foodRescueUserPosts')) || [
        { id: 1, title: 'Rice Meals (30 packs)', location: 'Barangay San Jose', time: 'Posted Today', status: 'Active' }
    ];

    if (userPosts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
                <p class="text-slate-700 font-extrabold text-lg mb-3">Wala ka pang active food posts.</p>
                <a href="post-food.html" class="inline-block bg-orange-600 hover:bg-orange-700 text-white font-extrabold px-6 py-3 rounded-xl text-base shadow transition">
                    🎁 Magbahagi ng Pagkain / Post Food
                </a>
            </div>
        `;
        return;
    }

    let html = '';
    userPosts.forEach(post => {
        html += `
            <div class="bg-white p-6 rounded-2xl border-2 border-emerald-300 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="text-2xl">🍚</span>
                        <h3 class="text-xl font-extrabold text-emerald-900">${post.title}</h3>
                    </div>
                    <p class="text-slate-600 font-bold text-sm">📍 ${post.location} &bull; ${post.time}</p>
                </div>
                <div class="flex items-center space-x-3 w-full sm:w-auto">
                    <button onclick="completeUserPost(${post.id})" class="flex-grow sm:flex-grow-0 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-sm shadow transition">
                        ✓ Mark Complete
                    </button>
                    <button onclick="deleteUserPost(${post.id})" class="bg-red-100 hover:bg-red-200 text-red-700 font-extrabold px-4 py-2.5 rounded-xl text-sm shadow transition">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Marks a user post as complete and removes it from active listings
 */
function completeUserPost(postId) {
    let userPosts = JSON.parse(localStorage.getItem('foodRescueUserPosts')) || [];
    userPosts = userPosts.filter(p => p.id !== postId);
    localStorage.setItem('foodRescueUserPosts', JSON.stringify(userPosts));

    alert('Post marked as completed! Maraming salamat sa pagtulong sa komunidad.');
    loadUserDashboardPosts();
}

/**
 * Deletes a user post
 */
function deleteUserPost(postId) {
    if (confirm('Sigurado ka bang gusto mong burahin ang post na ito?')) {
        let userPosts = JSON.parse(localStorage.getItem('foodRescueUserPosts')) || [];
        userPosts = userPosts.filter(p => p.id !== postId);
        localStorage.setItem('foodRescueUserPosts', JSON.stringify(userPosts));

        loadUserDashboardPosts();
    }
}

/**
 * Handles user logout
 */
function handleLogout() {
    localStorage.removeItem('foodRescueUserName');
    localStorage.removeItem('foodRescueBarangay');
    alert('Matagumpay na naka-log out.');
    window.location.href = 'index.html';
}
