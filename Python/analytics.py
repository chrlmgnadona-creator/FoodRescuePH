"""
FoodRescue PH - Python Analytics Service
Computes community food rescue impact, total metrics, and barangay statistics.
"""

import mysql.connector
import requests
from datetime import datetime

# Database Configuration (Connects to the same MySQL database layer)
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'foodrescue_db'
}

# Optional Node.js Main API endpoint for telemetry integration
NODE_API_URL = 'http://localhost:3000/api/analytics/metrics'

def fetch_impact_metrics():
    """Queries MySQL directly to calculate community impact statistics."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # 1. Get total posts count
        cursor.execute("SELECT COUNT(*) AS total_posts FROM food_posts")
        posts_result = cursor.fetchone()
        total_posts = posts_result['total_posts'] if posts_result else 0

        # 2. Get total registered users count
        cursor.execute("SELECT COUNT(*) AS total_users FROM users")
        users_result = cursor.fetchone()
        total_users = users_result['total_users'] if users_result else 0

        # 3. Get distribution by barangay/location
        cursor.execute("SELECT location, COUNT(*) as count FROM food_posts GROUP BY location")
        barangay_stats = cursor.fetchall()

        cursor.close()
        conn.close()

        # Estimated impact calculation (e.g., average 3kg of food per rescue post)
        estimated_kg_saved = total_posts * 3.5

        report = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "totalRescuedPosts": total_posts,
            "totalRegisteredUsers": total_users,
            "estimatedKgFoodSaved": round(estimated_kg_saved, 2),
            "barangayBreakdown": barangay_stats
        }

        return report

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        return None

def check_node_api_health():
    """Checks the status of the Node.js Main API service."""
    try:
        response = requests.get(NODE_API_URL, timeout=3)
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.RequestException:
        return {"status": "Offline / Unreachable"}
    return {"status": "Unknown"}

if __name__ == "__main__":
    print("==========================================")
    print(" FoodRescue PH - Python Analytics Engine")
    print("==========================================")
    
    # Check Node.js API status
    api_health = check_node_api_health()
    print(f"Node.js API Integration Status: {api_health.get('status', 'Connected')}")

    # Generate and display impact metrics report
    metrics = fetch_impact_metrics()
    if metrics:
        print("\n--- Community Impact Report ---")
        print(f"Generated At: {metrics['timestamp']}")
        print(f"Total Food Rescue Posts: {metrics['totalRescuedPosts']}")
        print(f"Total Community Users: {metrics['totalRegisteredUsers']}")
        print(f"Estimated Food Rescued: {metrics['estimatedKgFoodSaved']} kg")
        print("\nBreakdown by Location:")
        for item in metrics['barangayBreakdown']:
            print(f"  - {item['location']}: {item['count']} post(s)")
    else:
        print("Could not retrieve metrics. Ensure MySQL service is running.")
    print("==========================================")
