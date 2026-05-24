import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IProduct extends Document {
  storeId: Types.ObjectId;
  title: string;
  description?: string;
  price: number;
  images: string[]; // Cloudinary URLs
  inStock: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ProductSchema.index({ storeId: 1, createdAt: -1 });

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
