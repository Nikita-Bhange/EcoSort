import { db } from "../connect.js";

const requiredColumns = [
  "ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0",
  "ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL",
  "ADD COLUMN verification_token_expires_at DATETIME DEFAULT NULL",
  "ADD COLUMN verified_at DATETIME DEFAULT NULL",
];

export const ensureAuthSchema = async () => {
  const [tables] = await db.promise().query("SHOW TABLES LIKE 'users'");

  if (!tables.length) {
    return;
  }

  const [columns] = await db.promise().query("SHOW COLUMNS FROM users");
  const columnNames = new Set(columns.map((column) => column.Field));

  const missing = requiredColumns.filter((statement) => {
    const parts = statement.split(" ");
    return !columnNames.has(parts[2]);
  });

  for (const statement of missing) {
    await db.promise().query(`ALTER TABLE users ${statement}`);
  }
};
