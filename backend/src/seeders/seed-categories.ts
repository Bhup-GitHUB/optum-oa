import { Category } from '../models/Category';
import { sequelize } from '../config';

const categories = [
  { name: 'Technology', description: 'Articles about technology, programming, and software development' },
  { name: 'Travel', description: 'Travel guides, tips, and destination reviews' },
  { name: 'Food', description: 'Recipes, restaurant reviews, and culinary adventures' },
  { name: 'Lifestyle', description: 'Health, wellness, and daily living tips' },
  { name: 'Business', description: 'Business insights, entrepreneurship, and career advice' },
  { name: 'Science', description: 'Scientific discoveries and research' },
  { name: 'Sports', description: 'Sports news, analysis, and commentary' },
  { name: 'Entertainment', description: 'Movies, TV shows, music, and celebrity news' },
  { name: 'Education', description: 'Learning resources and educational content' },
  { name: 'Politics', description: 'Political news and analysis' }
];

export async function seedCategories() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });
    console.log('Models synced');

    for (const category of categories) {
      await Category.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
    }

    console.log('Categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedCategories();
}