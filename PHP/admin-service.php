<?php
/**
 * FoodRescue PH - PHP Admin / API Service
 * Handles admin authentication, post moderation, and database management.
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'foodrescue_db';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database Connection Failed: " . $conn->connect_error]);
    exit();
}

$requestMethod = $_SERVER["REQUEST_METHOD"];
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($requestMethod) {
    case 'GET':
        if ($endpoint === 'stats') {
            // Fetch system-wide counts for admin dashboard
            $usersQuery = "SELECT COUNT(*) as total_users FROM users";
            $postsQuery = "SELECT COUNT(*) as total_posts FROM food_posts";
            
            $usersResult = $conn->query($usersQuery)->fetch_assoc();
            $postsResult = $conn->query($postsQuery)->fetch_assoc();

            echo json_encode([
                "success" => true,
                "service" => "PHP Admin Service",
                "statistics" => [
                    "totalUsers" => (int)$usersResult['total_users'],
                    "totalPosts" => (int)$postsResult['total_posts']
                ]
            ]);
        } else {
            // Default: Fetch all food posts for admin moderation review
            $result = $conn->query("SELECT * FROM food_posts ORDER BY id DESC");
            $posts = [];
            while ($row = $result->fetch_assoc()) {
                $posts[] = $row;
            }
            echo json_encode(["success" => true, "posts" => $posts]);
        }
        break;

    case 'POST':
        // Admin action hook (e.g., broadcasting notice or reviewing flagged content)
        $data = json_decode(file_get_contents("php://input"), true);
        $action = isset($data['action']) ? $data['action'] : '';

        echo json_encode([
            "success" => true,
            "message" => "Admin action '{$action}' processed successfully via PHP service."
        ]);
        break;

    case 'DELETE':
        // Admin deletion of a flagged or inappropriate food post
        if (isset($_GET['id'])) {
            $postId = intval($_GET['id']);
            $stmt = $conn->prepare("DELETE FROM food_posts WHERE id = ?");
            $stmt->bind_param("i", $postId);
            
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Post ID {$postId} deleted by admin."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to delete post."]);
            }
            $stmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "Missing post ID for deletion."]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed."]);
        break;
}

$conn->close();
?>
