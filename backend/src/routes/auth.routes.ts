import { Router, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { User } from '../models/user';
import { auth } from '../middlewares/auth';


const router = Router();


router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/me', auth, async (req: Request, res: Response) => {
  res.json({
    user: {
      id: req.user!.id,
      username: req.user!.username,
      email: req.user!.email,
      bio: req.user!.bio,
      image: req.user!.image
    }
  });
});

export default router;