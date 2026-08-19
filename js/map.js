/**
 * FoodRescue PH - Map JavaScript (map.js)
 * Handles interactive map initialization, location filtering, and barangay food pins.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupMapFilters();
});

/**
 * Initializes the interactive map (simulated/Leaflet integration placeholder)
 */
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Check if Leaflet is available globally, otherwise render a high-accessibility fallback view
    if (typeof L !== 'undefined') {
        // Centered around Eastern Visayas / Philippines default region
        const map = L.map('map').setView([11.2748, 125.0784], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Sample food pins across barangays
        const foodPins = [
            { lat: 11.2750, lng: 125.0750, title: 'Rice Meals (30 packs)', barangay: 'Barangay San Jose', time: 'Posted 1h ago' },
            { lat: 11.2720, lng: 125.0810, title: 'Fresh Pan de Sal (50 pcs)', barangay: 'Barangay Poblacion', time: 'Posted 30m ago' },
            { lat: 11.2780, lng: 125.0700, title: 'Surplus Canned Goods', barangay: 'Barangay Baybay', time: 'Posted 2h ago' }
        ];

        foodPins.forEach(pin => {
            const marker = L.marker([pin.lat, pin.lng]).addTo(map);
            marker.bindPopup(`
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
                    <h3 style="font-weight: 800; color: #15803d; font-size: 16px; margin-bottom: 4px;">${pin.title}</h3>
                    <p style="font-weight: 700; color: #475569; font-size: 14px; margin-bottom: 2px;">📍 ${pin.barangay}</p>
                    <p style="font-weight: 500; color: #64748b; font-size: 12px; margin-bottom: 8px;">🕒 ${pin.time}</p>
                    <button onclick="alert('Navigating to pickup details for: ${pin.title}')" style="background: #ea580c; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 13px;">View Details</button>
                </div>
            `);
        });
    } else {
        // Fallback layout if external map library isn't loaded
        mapContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full bg-emerald-50 p-6 text-center rounded-3xl border-4 border-emerald-300">
                <span class="text-5xl mb-3">📍</span>
                <h3 class="text-2xl font-extrabold text-emerald-900 mb-2">Interactive Barangay Map</h3>
                <p class="text-slate-700 font-medium mb-4">Showing active community food hubs and donation drop-offs near you.</p>
                <div class="bg-white p-4 rounded-2xl shadow border-2 border-emerald-200 text-left w-full max-w-md space-y-2">
                    <p class="font-extrabold text-emerald-900">🍚 Rice Meals - Barangay San Jose (1.2 km away)</p>
                    <p class="font-extrabold text-emerald-900">🥖 Pan de Sal - Barangay Poblacion (2.4 km away)</p>
                </div>
            </div>
        `;
    }
}

/**
 * Sets up filters for barangay selection on the map page
 */
function setupMapFilters() {
    const barangaySelect = document.getElementById('barangay-filter');
    if (barangaySelect) {
        barangaySelect.addEventListener('change', (e) => {
            const selectedBarangay = e.target.value;
            console.log(`Filtering map markers for: ${selectedBarangay}`);
            // Trigger marker visibility updates here
        });
    }
}
