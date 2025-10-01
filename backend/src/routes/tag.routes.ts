import { Router, Request, Response } from 'express';
import { Tag } from '../models';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const tags = await Tag.findAll({
      order: [['name', 'ASC']]
    });
    
    res.json({ 
      tags: tags.map(tag => tag.name) 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;