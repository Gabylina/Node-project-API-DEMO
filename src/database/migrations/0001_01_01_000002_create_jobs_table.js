/* migrated from database/migrations/0001_01_01_000002_create_jobs_table.php */

export const SQL_UP = `
CREATE TABLE jobs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: PostgreSQL: GENERATED ALWAYS AS IDENTITY; MySQL: AUTO_INCREMENT */
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL, /* TODO: For MySQL, consider LONGTEXT */
    attempts SMALLINT UNSIGNED NOT NULL, /* TODO: UNSIGNED is MySQL specific. For PostgreSQL, use SMALLINT and ensure non-negative via application logic or CHECK constraint. */
    reserved_at INT UNSIGNED NULL, /* TODO: UNSIGNED is MySQL specific. For PostgreSQL, use INT and ensure non-negative via application logic or CHECK constraint. */
    available_at INT UNSIGNED NOT NULL, /* TODO: UNSIGNED is MySQL specific. For PostgreSQL, use INT and ensure non-negative via application logic or CHECK constraint. */
    created_at INT UNSIGNED NOT NULL /* TODO: UNSIGNED is MySQL specific. For PostgreSQL, use INT and ensure non-negative via application logic or CHECK constraint. */
);
CREATE INDEX jobs_queue_index ON jobs (queue);

CREATE TABLE job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INT NOT NULL,
    pending_jobs INT NOT NULL,
    failed_jobs INT NOT NULL,
    failed_job_ids TEXT NOT NULL, /* TODO: For MySQL, consider LONGTEXT */
    options TEXT NULL, /* TODO: For MySQL, consider MEDIUMTEXT */
    cancelled_at INT NULL,
    created_at INT NOT NULL,
    finished_at INT NULL
);

CREATE TABLE failed_jobs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, /* TODO: PostgreSQL: GENERATED ALWAYS AS IDENTITY; MySQL: AUTO_INCREMENT */
    uuid VARCHAR(255) NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL, /* TODO: For MySQL, consider LONGTEXT */
    exception TEXT NOT NULL, /* TODO: For MySQL, consider LONGTEXT */
    failed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX failed_jobs_uuid_unique ON failed_jobs (uuid);
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