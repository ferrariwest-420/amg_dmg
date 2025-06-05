import { query } from './index.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration(migrationFile) {
  try {
    console.log(`Запуск миграции: ${migrationFile}`);
    const filePath = path.join(__dirname, '../../db/migrations', migrationFile);
    const sql = await fs.readFile(filePath, 'utf-8');
    
    try {
      await query(sql);
      console.log(`Миграция успешно выполнена: ${migrationFile}`);
    } catch (err) {
      console.error(`Ошибка при выполнении миграции ${migrationFile}:`, err);
      throw err;
    }
  } catch (err) {
    console.error('Ошибка миграции:', err);
    process.exit(1);
  }
}

// Запускаем конкретную миграцию
runMigration('005_add_size_to_cart_items.sql'); 