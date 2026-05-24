import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type BusinessType = 'mobile' | 'property' | 'laptop' | 'cloth' | 'perfume' | 'other';
export type ThemeKey = 'blue' | 'green' | 'darkGold' | 'pink' | 'teal' | 'coral';

export interface IStore extends Document {
  ownerId: Types.ObjectId;
  slug: string;
  businessType: BusinessType;
  name: string;
  tagline?: string;
  whatsappNumber: string;
  theme: ThemeKey;
  sections: {
    header: { logo?: string; announcement?: string };
    hero: { headline: string; subheadline?: string; imageUrl?: string };
    about: { title?: string; body?: string; imageUrl?: string };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    businessType: {
      type: String,
      enum: ['mobile', 'property', 'laptop', 'cloth', 'perfume', 'other'],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    // E.164 format: +92300xxxxxxx
    whatsappNumber: { type: String, required: true, trim: true },
    theme: {
      type: String,
      enum: ['blue', 'green', 'darkGold', 'pink', 'teal', 'coral'],
      default: 'blue',
    },
    sections: {
      header: {
        logo: String,
        announcement: String,
      },
      hero: {
        headline: { type: String, default: 'Welcome to our store' },
        subheadline: String,
        imageUrl: String,
      },
      about: {
        title: String,
        body: String,
        imageUrl: String,
      },
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

StoreSchema.index({ ownerId: 1 });
StoreSchema.index({ slug: 1 }, { unique: true });
StoreSchema.index({ isActive: 1 });

const Store: Model<IStore> = mongoose.models.Store ?? mongoose.model<IStore>('Store', StoreSchema);
export default Store;
