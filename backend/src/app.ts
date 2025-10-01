import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import articleRoutes from './routes/article.routes';
import commentRoutes from './routes/comment.routes';
import tagRoutes from './routes/tag.routes';
import categoryRoutes from './routes/category.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api', commentRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;