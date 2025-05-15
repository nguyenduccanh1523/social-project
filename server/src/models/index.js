import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';
import process from 'process';

// Biến xử lý đường dẫn trong ES Module (thay __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file JSON cấu hình DB
const configPath = path.join(__dirname, '../config/config.json');
const rawConfig = fs.readFileSync(configPath, 'utf-8');
const configFile = JSON.parse(rawConfig);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const db = {};

// Khởi tạo Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Tự động load toàn bộ model trong thư mục này
const files = fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
  );

// Dynamic import từng model
for (const file of files) {
  const filePath = path.join(__dirname, file);
  const { default: modelDefiner } = await import(`file://${filePath}`);
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Nếu model có associate thì gọi
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
