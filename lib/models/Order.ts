import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  title: string;
  price: number;
  qty: number;
}

export interface IOrder extends Document {
  storeId: Types.ObjectId;
  ownerId: Types.ObjectId;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: IOrderItem[];
  total: number;
  status: 'new' | 'seen' | 'fulfilled';
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: { type: String, enum: ['new', 'seen', 'fulfilled'], default: 'new' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

OrderSchema.index({ storeId: 1, createdAt: -1 });
OrderSchema.index({ ownerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
