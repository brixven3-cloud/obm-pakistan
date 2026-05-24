import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  storeId: Types.ObjectId;
  name: string;
  description?: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    storeId:     { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    name:        { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

CategorySchema.index({ storeId: 1, createdAt: -1 });

const Category: Model<ICategory> =
  mongoose.models.Category ?? mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
