const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Comment class extending Model
class Comment extends Model {}

// Define the schema for Comment
const commentSchema = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    comment_body: {
        type: DataTypes.STRING,
        allowNull: false,
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
    blogPost_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "blogPost",
            key: "id",
        },
    },
};

// Model configuration
const commentConfig = {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "comment",
};

// Initialize Comment model
Comment.init(commentSchema, commentConfig);

// Export
module.exports = Comment;
