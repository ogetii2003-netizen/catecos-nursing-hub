import pg from "pg";

const { Pool } = pg;

export async function runMigrations(connectionString: string): Promise<void> {
  const needsSsl = connectionString.includes(".render.com");
  const pool = new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });

  // Always end the pool, even if connect() throws
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT NOT NULL,
          location TEXT NOT NULL,
          service TEXT NOT NULL,
          preferred_date TEXT NOT NULL,
          notes TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;
        UPDATE bookings SET updated_at = created_at WHERE updated_at IS NULL;

        CREATE TABLE IF NOT EXISTS site_settings (
          id SERIAL PRIMARY KEY,
          key TEXT NOT NULL UNIQUE,
          value TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}
