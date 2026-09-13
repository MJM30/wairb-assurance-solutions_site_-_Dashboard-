CREATE DATABASE IF NOT EXISTS wairb_db;
USE wairb_db;

-- Table for Admin/Staff Users
CREATE TABLE IF NOT EXISTS wairb_users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'admin', 'percepteur', 'financier'
  phone VARCHAR(50),
  address TEXT,
  avatar TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default users
INSERT INTO wairb_users (id, name, email, password, role, phone, address, createdAt)
VALUES 
  ('usr_001', 'Fleury Ngoma', 'admin@wairbdrc.com', 'Wairb@2024', 'admin', '+243 812 345 678', 'Gombe, Kinshasa', CURRENT_TIMESTAMP),
  ('usr_002', 'Moïse Kapend', 'percepteur@wairbdrc.com', 'Wairb@2024', 'percepteur', '+243 899 123 456', 'Ngaliema, Kinshasa', CURRENT_TIMESTAMP),
  ('usr_003', 'Chantal Mboyo', 'financier@wairbdrc.com', 'Wairb@2024', 'financier', '+243 821 555 777', 'Limete, Kinshasa', CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Table for Clients / Insurance Requests
CREATE TABLE IF NOT EXISTS wairb_clients (
  id VARCHAR(50) PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telephone VARCHAR(50) NOT NULL,
  adressePhysique TEXT,
  adressePostale VARCHAR(100),
  domaineActivite VARCHAR(100),
  ville VARCHAR(100),
  pays VARCHAR(100),
  typeAssurance VARCHAR(50) NOT NULL,
  typeAssuranceLabel VARCHAR(100) NOT NULL,
  matricule VARCHAR(50) UNIQUE NOT NULL,
  dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  statut VARCHAR(50) DEFAULT 'en_attente', -- 'en_attente', 'paye'
  datePaiement TIMESTAMP NULL,
  montantPaye DECIMAL(10,2) NULL,
  modePaiement VARCHAR(50) NULL, -- 'virement', 'especes'
  preuvePaiementNom VARCHAR(255) NULL,
  preuvePaiementType VARCHAR(100) NULL,
  preuvePaiementData LONGTEXT NULL, -- Base64 encoded file
  detailsAssurance JSON -- Stores type-specific form details dynamically
);

-- Table for Expenses
CREATE TABLE IF NOT EXISTS wairb_expenses (
  id VARCHAR(50) PRIMARY KEY,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  disburserName VARCHAR(100) NOT NULL,
  recipientName VARCHAR(100) NOT NULL,
  justification TEXT,
  attachmentName VARCHAR(255),
  attachmentType VARCHAR(100),
  attachmentData LONGTEXT, -- Base64 encoded or path
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'effectue' -- 'effectue', 'annule'
);

-- Table for Expense Budgets
CREATE TABLE IF NOT EXISTS wairb_expense_budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month VARCHAR(2) NOT NULL,
  year VARCHAR(4) NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  UNIQUE KEY unique_budget (month, year, category)
);

-- Table for Visitors
CREATE TABLE IF NOT EXISTS wairb_visitors (
  date DATE PRIMARY KEY,
  count INT DEFAULT 0
);
