-- Migration script pour ajouter les champs de paiement à la table wairb_clients
-- Exécuter ce script sur votre base de données existante

USE wairb_db;

-- Ajouter la colonne modePaiement si elle n'existe pas
ALTER TABLE wairb_clients 
ADD COLUMN IF NOT EXISTS modePaiement VARCHAR(50) NULL COMMENT 'Mode de paiement: virement ou especes';

-- Ajouter la colonne preuvePaiementNom si elle n'existe pas
ALTER TABLE wairb_clients 
ADD COLUMN IF NOT EXISTS preuvePaiementNom VARCHAR(255) NULL COMMENT 'Nom du fichier de preuve de paiement';

-- Ajouter la colonne preuvePaiementType si elle n'existe pas
ALTER TABLE wairb_clients 
ADD COLUMN IF NOT EXISTS preuvePaiementType VARCHAR(100) NULL COMMENT 'Type MIME du fichier de preuve';

-- Ajouter la colonne preuvePaiementData si elle n'existe pas
ALTER TABLE wairb_clients 
ADD COLUMN IF NOT EXISTS preuvePaiementData LONGTEXT NULL COMMENT 'Données du fichier en base64';
