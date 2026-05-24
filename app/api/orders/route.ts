import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';
import Order from '@/lib/models/Order';

const orderSchema = z.object({
  storeId:  z.string().min(1),
  customer: z.object({
    name:    z.string().min(1),
    phone:   z.string().min(1),
    address: z.string().min(1),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    title:     z.string().min(1),
    price:     z.number().min(0),
    qty:       z.number().min(1),
  })).min(1),
  total: z.number().min(0),
});

// POST — public, no auth needed (customers place orders)
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    await connectDB();

    const store = await Store.findById(parsed.data.storeId).lean();
    if (!store || !store.isActive) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const order = await Order.create({
      storeId:  store._id,
      ownerId:  store.ownerId,
      customer: parsed.data.customer,
      items:    parsed.data.items,
      total:    parsed.data.total,
      status:   'new',
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET — authenticated store owner sees their own orders
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const store = await Store.findOne({ ownerId: session.user.id }).lean();
  if (!store) return NextResponse.json({ orders: [], total: 0 });

  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const status   = searchParams.get('status') ?? '';
  const pageSize = 20;

  const query: Record<string, unknown> = { storeId: store._id };
  if (status && ['new', 'seen', 'fulfilled'].includes(status)) query.status = status;

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    Order.countDocuments(query),
  ]);

  return NextResponse.json({ orders, total, page, pageSize });
}
