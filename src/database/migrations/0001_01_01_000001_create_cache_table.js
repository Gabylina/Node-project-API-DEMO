/* migrated from database/migrations/0001_01_01_000001_create_cache_table.php */

export const SQL_UP = `
CREATE TABLE cache (
    key VARCHAR(255) PRIMARY KEY,
    value MEDIUMTEXT, /* TODO: Consider TEXT for broader database compatibility (e.g., PostgreSQL) */
    expiration INT
);

CREATE TABLE cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255),
    expiration INT
);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS cache;
DROP TABLE IF EXISTS cache_locks;
`;

export async function up(db, deps = {}) {
  if (db?.query) {
    await db.query(SQL_UP);
  } else {
    console.warn(`db.query not found. Execute manually:\n`, SQL_UP);
  }
}

export async function down(db, deps = {}) {
  if (db?.query) {
    await db.query(SQL_DOWN);
  } else {
    console.warn(`db.query not found. Execute manually:\n`, SQL_DOWN);
  }
}

export default { up, down };
