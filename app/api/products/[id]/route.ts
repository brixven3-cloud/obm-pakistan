import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';
import Product from '@/lib/models/Product';

const updateSchema = z.object({
  title:       z.string().min(1).max(120).optional(),
  description: z.string().max(1000).optional(),
  price:       z.number().min(0).optional(),
  images:      z.array(z.string()).optional(),
  inStock:     z.boolean().optional(),
  categoryId:  z.string().nullable().optional(),
});

// PATCH — update product
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const store = await Store.findOne({ ownerId: session.user.id });
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  const product = await Product.findOneAndUpdate(
    { _id: params.id, storeId: store._id },
    { $set: parsed.data },
    { new: true }
  );

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  return NextResponse.json({ product });
}

// DELETE — delete product
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const store = await Store.findOne({ ownerId: session.user.id });
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  await Product.findOneAndDelete({ _id: params.id, storeId: store._id });
  return NextResponse.json({ message: 'Deleted' });
}
