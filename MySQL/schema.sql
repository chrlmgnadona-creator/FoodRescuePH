-- FoodRescue PH Database Schema
CREATE DATABASE IF NOT EXISTS foodrescue_db;
USE foodrescue_db;

-- Users Table for registration and login
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL UNIQUE,
    barangay VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food Posts Table for community sharing
CREATE TABLE IF NOT EXISTS food_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    notes TEXT,
    time_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
