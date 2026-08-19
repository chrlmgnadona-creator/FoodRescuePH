/**
 * FoodRescue PH - Food Management JavaScript (food.js)
 * Handles food listing creation, search/filtering, and claim/pickup requests.
 */

document.addEventListener('DOMContentLoaded', () => {
    setupFoodForm();
    setupFoodFilters();
    loadPublicFoodListings();
});

/**
 * Handles the submission of new food posts from post-food.html
 */
function setupFoodForm() {
    const foodForm = document.getElementById('food-post-form');
    if (!foodForm) return;

    foodForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('food-title').value;
        const category = document.getElementById('food-category').value;
        const quantity = document.getElementById('food-quantity').value;
        const barangay = document.getElementById('food-barangay').value;
        const notes = document.getElementById('food-notes').value || 'No special instructions.';

        const newPost = {
            id: Date.now(),
            title: `${title} (${quantity})`,
            category: category,
            location: barangay,
            time: 'Just now',
            notes: notes,
            status: 'Active'
        };

        // Save to localStorage for both user dashboard and public feed
        let userPosts = JSON.parse(localStorage.getItem('foodRescueUserPosts')) || [];
        userPosts.unshift(newPost);
        localStorage.setItem('foodRescueUserPosts', JSON.stringify(userPosts));

        let publicPosts = JSON.parse(localStorage.getItem('foodRescuePublicPosts')) || [];
        publicPosts.unshift(newPost);
        localStorage.setItem('foodRescuePublicPosts', JSON.stringify(publicPosts));

        alert('Success! Your food post has been shared with the community. / Matagumpay na naibahagi ang pagkain!');
        window.location.href = 'dashboard.html';
    });
}

/**
 * Loads public food listings dynamically into find-food.html or index.html
 */
function loadPublicFoodListings() {
    const feedContainer = document.getElementById('food-listings-feed');
    if (!feedContainer) return;

    // Default sample listings combined with user-created posts
    const defaultPosts = [
        { id: 101, title: 'Rice Meals (30 packs)', category: 'cooked', location: 'Barangay San Jose', time: 'Posted 1h ago', notes: 'Packed in clean containers. Ready for pickup.' },
        { id: 102, title: 'Fresh Pan de Sal (50 pcs)', category: 'bakery', location: 'Barangay Poblacion', time: 'Posted 30m ago', notes: 'Freshly baked this morning.' },
        { id: 103, title: 'Surplus Canned Goods (10 cans)', category: 'canned', location: 'Barangay Baybay', time: 'Posted 2h ago', notes: 'Unopened sardines and corned beef.' }
    ];

    let userPosts = JSON.parse(localStorage.getItem('foodRescuePublicPosts')) || [];
    let allPosts = [...userPosts, ...defaultPosts];

    if (allPosts.length === 0) {
        feedContainer.innerHTML = `
            <div class="col-span-full text-center py-12 bg-white rounded-3xl border-4 border-emerald-600 shadow">
                <span class="text-4xl mb-2 block">🍱</span>
                <p class="text-xl font-extrabold text-emerald-900">Walang nakitang pagkain sa ngayon.</p>
                <p class="text-slate-600 font-medium">Mag-post ng extra food para makatulong sa kapitbahay!</p>
            </div>
        `;
        return;
    }

    let html = '';
    allPosts.forEach(post => {
        html += `
            <div class="bg-white p-6 rounded-3xl shadow-xl border-4 border-emerald-600 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <span class="bg-emerald-100 text-emerald-900 font-extrabold px-3 py-1 rounded-full text-xs">📍 ${post.location}</span>
                        <span class="text-xs font-bold text-slate-500">${post.time}</span>
                    </div>
                    <h3 class="text-2xl font-extrabold text-emerald-900 mb-2">${post.title}</h3>
                    <p class="text-slate-700 font-medium mb-4">${post.notes}</p>
                </div>
                <button onclick="claimFoodItem('${post.title}', '${post.location}')" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-3 px-4 rounded-2xl shadow transition text-center">
                    🤝 Kunin / Request Pickup
                </button>
            </div>
        `;
    });

    feedContainer.innerHTML = html;
}

/**
 * Sets up search input and category filter listeners
 */
function setupFoodFilters() {
    const searchInput = document.getElementById('food-search-input');
    const categoryFilter = document.getElementById('category-filter');

    if (searchInput) {
        searchInput.addEventListener('input', filterFoodListings);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterFoodListings);
    }
}

function filterFoodListings() {
    const searchTerm = document.getElementById('food-search-input')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('category-filter')?.value || 'all';

    // Filter logic can be tied directly to DOM elements rendered on the page
    const cards = document.querySelectorAll('#food-listings-feed > div');
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || text.includes(selectedCategory);

        if (matchesSearch && matchesCategory) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Action triggered when a user wants to claim or request pickup for a food item
 */
function claimFoodItem(title, location) {
    alert(`Pickup Request Sent!\n\nYou requested: ${title}\nLocation: ${location}\n\nPlease coordinate directly with the donor or visit the designated barangay pickup point.`);
}
