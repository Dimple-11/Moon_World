import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  category: {
    type: String,
    default: 'Aesthetic',
    index: true,
  },
  albumId: {
    type: String,
    default: 'default',
  },
  altText: {
    type: String,
    default: 'Gallery photograph',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  dateTaken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  }
});

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
