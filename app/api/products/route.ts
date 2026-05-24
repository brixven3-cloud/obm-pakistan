import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';
import Product from '@/lib/models/Product';

const productSchema = z.object({
  title:       z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  price:       z.number().min(0),
  images:      z.array(z.string()).default([]),
  inStock:     z.boolean().default(true),
  categoryId:  z.string().optional().nullable(),
});

async function getStore(userId: string) {
  return Store.findOne({ ownerId: userId }).lean();
}

// GET — list products (paginated)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const store = await getStore(session.user.id);
  if (!store) return NextResponse.json({ products: [], total: 0 });

  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const pageSize = 20;

  const [products, total] = await Promise.all([
    Product.find({ storeId: store._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Product.countDocuments({ storeId: store._id }),
  ]);

  return NextResponse.json({ products, total, page, pageSize });
}

// POST — create product
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const store = await getStore(session.user.id);
  if (!store) return NextResponse.json({ error: 'Create your store first' }, { status: 400 });

  const { categoryId, ...rest } = parsed.data;
  const product = await Product.create({
    ...rest,
    storeId: store._id,
    ...(categoryId ? { categoryId } : {}),
  });
  return NextResponse.json({ product }, { status: 201 });
}
