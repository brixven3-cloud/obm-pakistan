import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'client' | 'admin';
  status: 'pending' | 'approved' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
    status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'approved', index: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);
export default User;
