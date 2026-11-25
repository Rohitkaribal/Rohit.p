// ============================================
// MULTI-AI SYSTEM - DATABASE CONNECTION
// Everything Mixed - Nothing Separate
// ============================================

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../models/schema';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'multi_ai_system',
};

// Create connection pool
const pool = new Pool(dbConfig);

// Create Drizzle ORM instance
export const db = drizzle(pool, { schema });

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnection(): Promise<void> {
  await pool.end();
}

// Export pool for migrations
export { pool };
