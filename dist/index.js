import express from "express";
import dotenv from 'dotenv';
import { router as userRouter } from './routes/userRoutes.js';
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from 'cookie-parser';
// Load environment variables
dotenv.config();
const app = express();
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userRouter);
// Error handling middleware
app.use(errorHandler);
app.listen(8000, () => console.log('listening on PORT 8000'));
//# sourceMappingURL=index.js.map