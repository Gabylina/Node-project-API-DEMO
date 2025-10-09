/* migrated from database/migrations/0001_01_01_000002_create_jobs_table.php */

export const SQL_UP = `
CREATE TABLE jobs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: For MySQL, use AUTO_INCREMENT */
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL, /* TODO: For MySQL, consider LONGTEXT if actual long text is expected */
    attempts SMALLINT NOT NULL,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE INDEX jobs_queue_index ON jobs (queue);

CREATE TABLE job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL, /* TODO: For MySQL, consider LONGTEXT if actual long text is expected */
    options TEXT NULL, /* TODO: For MySQL, consider MEDIUMTEXT if actual medium text is expected */
    cancelled_at INTEGER NULL,
    created_at INTEGER NOT NULL,
    finished_at INTEGER NULL
);

CREATE TABLE failed_jobs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: For MySQL, use AUTO_INCREMENT */
    uuid VARCHAR(255) NOT NULL UNIQUE,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL, /* TODO: For MySQL, consider LONGTEXT if actual long text is expected */
    exception TEXT NOT NULL, /* TODO: For MySQL, consider LONGTEXT if actual long text is expected */
    failed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP /* TODO: For MySQL, use DATETIME DEFAULT CURRENT_TIMESTAMP */
);
`;

export const SQL_DOWN = `
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS job_batches;
DROP TABLE IF EXISTS failed_jobs;
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
