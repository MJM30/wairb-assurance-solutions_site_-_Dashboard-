import { Pool } from '@neondatabase/serverless';

let pool: Pool;

export function getDbPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set. Please set it to your Neon connection string.");
    }
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

/**
 * Execute a SQL query.
 * Automatically translates MySQL style `?` placeholders to PostgreSQL `$1, $2`
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const db = getDbPool();
  
  // Translate `?` to `$1`, `$2`...
  let pgSql = sql;
  if (params && params.length > 0) {
    let i = 1;
    pgSql = pgSql.replace(/\?/g, () => `$${i++}`);
  }

  // Handle common MySQL syntax that needs translation for Postgres
  pgSql = pgSql.replace(/LONGTEXT/gi, 'TEXT');
  pgSql = pgSql.replace(/DATETIME/gi, 'TIMESTAMP');
  
  // ON DUPLICATE KEY UPDATE -> ON CONFLICT
  // This is a naive replacement for our specific queries
  pgSql = pgSql.replace(/ON DUPLICATE KEY UPDATE data = \$\d+/i, 'ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data');
  pgSql = pgSql.replace(/ON DUPLICATE KEY UPDATE count = count \+ 1/i, 'ON CONFLICT (date) DO UPDATE SET count = wairb_visitors.count + 1');

  try {
    const { rows } = await db.query(pgSql, params);
    return rows as unknown as T;
  } catch (err) {
    console.error(`Query failed: ${pgSql}`, err);
    throw err;
  }
}

export async function initDb() {
  // Create tables if they don't exist
  await query(`
    CREATE TABLE IF NOT EXISTS wairb_cms_store (
      id INT PRIMARY KEY,
      data JSONB NOT NULL
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS wairb_visitors (
      date DATE PRIMARY KEY,
      count INT DEFAULT 1
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS wairb_expenses (
      id VARCHAR(50) PRIMARY KEY,
      date DATE,
      amount DECIMAL(10,2),
      category VARCHAR(100),
      disburserName VARCHAR(255),
      recipientName VARCHAR(255),
      justification TEXT,
      attachmentName VARCHAR(255),
      attachmentType VARCHAR(100),
      attachmentData TEXT,
      status VARCHAR(50),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS wairb_users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(50),
      phone VARCHAR(50),
      address TEXT,
      avatar TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS wairb_clients (
      id VARCHAR(50) PRIMARY KEY,
      nom VARCHAR(255),
      email VARCHAR(255),
      telephone VARCHAR(50),
      adressePhysique TEXT,
      adressePostale TEXT,
      domaineActivite VARCHAR(255),
      ville VARCHAR(100),
      pays VARCHAR(100),
      typeAssurance VARCHAR(100),
      typeAssuranceLabel VARCHAR(255),
      matricule VARCHAR(100),
      dateInscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      statut VARCHAR(50),
      datePaiement TIMESTAMP,
      montantPaye DECIMAL(10,2),
      modePaiement VARCHAR(50),
      preuvePaiementNom VARCHAR(255),
      preuvePaiementType VARCHAR(100),
      preuvePaiementData TEXT,
      detailsAssurance JSONB
    )
  `);
}
