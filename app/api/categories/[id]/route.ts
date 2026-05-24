import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';
import Category from '@/lib/models/Category';

const schema = z.object({
  name:        z.string().min(1).max(60).optional(),
  description: z.string().max(200).optional(),
});

// PATCH — update category
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const store = await Store.findOne({ ownerId: session.user.id });
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  const cat = await Category.findOneAndUpdate(
    { _id: params.id, storeId: store._id },
    { $set: parsed.data },
    { new: true }
  );

  if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  return NextResponse.json({ category: cat });
}

// DELETE — delete category
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const store = await Store.findOne({ ownerId: session.user.id });
  if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

  await Category.findOneAndDelete({ _id: params.id, storeId: store._id });
  return NextResponse.json({ message: 'Deleted' });
}
