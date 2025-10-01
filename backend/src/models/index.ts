import { User } from './user';
import { Article } from './Article';
import { Comment } from './comment';
import { Tag } from './tag';

User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Article.hasMany(Comment, { foreignKey: 'articleId', as: 'comments' });
Comment.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });

Article.belongsToMany(Tag, { 
  through: 'article_tags', 
  as: 'tags',
  foreignKey: 'articleId'
});
Tag.belongsToMany(Article, { 
  through: 'article_tags', 
  as: 'articles',
  foreignKey: 'tagId'
});

export { User, Article, Comment, Tag };