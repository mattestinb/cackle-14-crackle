const sequelize = require("../config/connection");
const { User, BlogPost, Comment } = require("../models");

const userData = require("./userData.json");
const blogPostData = require("./blogPostData.json");
const commentData = require("./commentData.json");

// Function to seed users
async function seedUsers() {
  return User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
}

// Function to seed blog posts
async function seedBlogPosts(users) {
  const blogPostPromises = blogPostData.map(blogPost => {
    const user_id = users[Math.floor(Math.random() * users.length)].id;
    return BlogPost.create({ ...blogPost, user_id });
  });

  return Promise.all(blogPostPromises);
}

// Function to seed comments
async function seedComments() {
  return Comment.bulkCreate(commentData);
}

// Main function to seed the database
async function seedDatabase() {
  await sequelize.sync({ force: true });

  const users = await seedUsers();
  await seedBlogPosts(users);
  await seedComments();

  process.exit(0);
}

// Seed the database
seedDatabase();
