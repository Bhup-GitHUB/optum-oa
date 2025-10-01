import { Router, Request, Response } from 'express';
import { Comment, Article, User } from '../models';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/articles/:slug/comments', async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug }
    });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    const comments = await Comment.findAll({
      where: { articleId: article.id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'image']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ comments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/articles/:slug/comments', auth, async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug }
    });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    const { body } = req.body;
    
    if (!body || body.trim() === '') {
      return res.status(400).json({ error: 'Comment body is required' });
    }
    
    const comment = await Comment.create({
      body,
      articleId: article.id,
      authorId: req.user!.id
    });
    
    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'image']
        }
      ]
    });
    
    res.status(201).json({ comment: commentWithAuthor });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/articles/:slug/comments/:id', auth, async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;