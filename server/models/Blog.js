import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: '/assets/blog-default.webp',
  },
  category: {
    type: String,
    required: true,
    default: 'Engineering',
    index: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft',
    index: true,
  },
  readTime: {
    type: String,
    default: '4 min read',
  },
  author: {
    type: String,
    default: 'Dimple',
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  seoTitle: {
    type: String,
    maxlength: 120,
  },
  seoDescription: {
    type: String,
    maxlength: 200,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

blogSchema.index({ status: 1, publishedAt: -1 });

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
