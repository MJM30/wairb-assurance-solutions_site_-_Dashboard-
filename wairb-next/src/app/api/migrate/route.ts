import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { handleOptions, jsonWithCors } from "@/lib/cors";

export function OPTIONS() {
  return handleOptions();
}

// POST /api/migrate - Apply database migration for payment fields
export async function POST(req: NextRequest) {
  try {
    const migrations = [
      // Check and add modePaiement column
      `ALTER TABLE wairb_clients 
       ADD COLUMN IF NOT EXISTS modePaiement VARCHAR(50) NULL 
       COMMENT 'Mode de paiement: virement ou especes'`,
      
      // Check and add preuvePaiementNom column
      `ALTER TABLE wairb_clients 
       ADD COLUMN IF NOT EXISTS preuvePaiementNom VARCHAR(255) NULL 
       COMMENT 'Nom du fichier de preuve de paiement'`,
      
      // Check and add preuvePaiementType column
      `ALTER TABLE wairb_clients 
       ADD COLUMN IF NOT EXISTS preuvePaiementType VARCHAR(100) NULL 
       COMMENT 'Type MIME du fichier de preuve'`,
      
      // Check and add preuvePaiementData column
      `ALTER TABLE wairb_clients 
       ADD COLUMN IF NOT EXISTS preuvePaiementData LONGTEXT NULL 
       COMMENT 'Données du fichier en base64'`
    ];

    const results = [];
    for (const sql of migrations) {
      try {
        await query(sql);
        results.push({ sql, status: 'success' });
      } catch (err: any) {
        // If column already exists, MySQL might throw an error
        // We'll continue and report it
        results.push({ sql, status: 'skipped', error: err.message });
      }
    }

    return jsonWithCors({ 
      success: true, 
      message: 'Migration completed',
      results 
    });
  } catch (err: any) {
    console.error("Migration error:", err);
    return jsonWithCors({ 
      error: "Migration failed", 
      details: err.message 
    }, { status: 500 });
  }
}
