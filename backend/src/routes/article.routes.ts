import { Router, Request, Response } from 'express';
import { Article, User, Tag } from '../models';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'image']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ articles });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'image']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ]
    });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ article });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { title, description, body, tagList } = req.body;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const article = await Article.create({
      title,
      description,
      body,
      slug,
      authorId: req.user!.id
    });
    
    if (tagList && Array.isArray(tagList)) {
      const tagInstances = await Promise.all(
        tagList.map(async (tagName: string) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: tagName.toLowerCase() }
          });
          return tag;
        })
      );
      
      await (article as any).setTags(tagInstances);
    }
    
    const articleWithAssociations = await Article.findByPk(article.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'image']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ]
    });
    
    res.status(201).json({ article: articleWithAssociations });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:slug', auth, async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug }
    });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    if (article.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { title, description, body, tagList } = req.body;
    
    await article.update({
      title: title || article.title,
      description: description || article.description,
      body: body || article.body
    });
    
    if (tagList && Array.isArray(tagList)) {
      const tagInstances = await Promise.all(
        tagList.map(async (tagName: string) => {
          const [tag] = await Tag.findOrCreate({
            where: { name: tagName.toLowerCase() }
          });
          return tag;
        })
      );
      
      await (article as any).setTags(tagInstances);
    }
    
    const updatedArticle = await Article.findByPk(article.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'image']
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['name'],
          through: { attributes: [] }
        }
      ]
    });
    
    res.json({ article: updatedArticle });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:slug', auth, async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug }
    });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    if (article.authorId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await article.destroy();
    res.json({ message: 'Article deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:slug/viewed', async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug }
    });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    article.viewCount += 1;
    await article.save();
    
    res.json({ 
      message: 'View counted',
      viewCount: article.viewCount 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;