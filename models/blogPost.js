const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// BlogPost class extending Model
class BlogPost extends Model {}

// Define the schema for BlogPost
const blogPostSchema = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    date_created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "user",
            key: "id",
        },
    },
};

// Model configuration
const blogPostConfig = {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "blogPost",
};

// Initialize BlogPost model
BlogPost.init(blogPostSchema, blogPostConfig);

// Export
module.exports = BlogPost;

