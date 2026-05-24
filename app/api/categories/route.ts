import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';
import Category from '@/lib/models/Category';

const schema = z.object({
  name:        z.string().min(1).max(60),
  description: z.string().max(200).optional(),
});

async function getStore(userId: string) {
  return Store.findOne({ ownerId: userId }).lean();
}

// GET — list all categories for my store
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const store = await getStore(session.user.id);
  if (!store) return NextResponse.json({ categories: [] });

  const categories = await Category.find({ storeId: store._id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ categories });
}

// POST — create category
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  await connectDB();
  const store = await getStore(session.user.id);
  if (!store) return NextResponse.json({ error: 'Create your store first' }, { status: 400 });

  const category = await Category.create({ ...parsed.data, storeId: store._id });
  return NextResponse.json({ category }, { status: 201 });
}
