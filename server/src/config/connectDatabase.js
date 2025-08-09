import { Sequelize} from 'sequelize';
// Đường dẫn đến file .env
import dotenv from 'dotenv';
dotenv.config();

// Thử kết nối với mật khẩu trống
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    logging: false, // Tắt logging nếu không cần thiết
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default connectDatabase;