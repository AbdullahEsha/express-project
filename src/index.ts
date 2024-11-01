import app from './app';
import { connectDB } from './config/db';

// Port configuration
const port = Number(process.env.PORT) || 5000;

// Start the server only after a successful database connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
