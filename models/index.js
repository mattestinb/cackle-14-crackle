const User = require("./user");
const BlogPost = require("./blogPost");
const Comment = require("./comment");

// User and BlogPost Associations
User.hasMany(BlogPost, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
BlogPost.belongsTo(User, {
  foreignKey: "user_id",
});

// User and Comment Associations
User.hasMany(Comment, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Comment.belongsTo(User, {
  foreignKey: "user_id",
});

// BlogPost and Comment Associations
BlogPost.hasMany(Comment, {
  foreignKey: "blogPost_id",
  onDelete: "CASCADE",
});
Comment.belongsTo(BlogPost, {
  foreignKey: "blogPost_id",
  onDelete: "CASCADE",
});

// Export
module.exports = { User, BlogPost, Comment };
