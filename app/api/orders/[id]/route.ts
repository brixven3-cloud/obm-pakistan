import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import Store from '@/lib/models/Store';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const { status } = await req.json();
  if (!['new', 'seen', 'fulfilled'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  // Make sure this order belongs to the user's store
  const store = await Store.findOne({ ownerId: session.user.id }).lean();
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  const order = await Order.findOneAndUpdate(
    { _id: params.id, storeId: store._id },
    { status },
    { new: true }
  );
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  return NextResponse.json({ order });
}
