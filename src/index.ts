import express from "express";
import dotenv from 'dotenv';
import { router as userRouter } from './routes/userRoutes';
import { router as blogsRouter } from './routes/blogRoutes';
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Middle to handle api routes
app.use('/api/user', userRouter);
app.use('/api/blogs', blogsRouter);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(8000, () => console.log('listening on PORT 8000'));



