import app from './app';
import { sequelize, PORT } from './config';
import './models';


async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    await sequelize.sync({ alter: true });
    console.log('Models synced');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();