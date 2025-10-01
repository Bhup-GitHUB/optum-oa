import { Router, Request, Response } from 'express';
import { Category } from '../models';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;