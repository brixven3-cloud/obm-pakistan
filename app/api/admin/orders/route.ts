import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const status   = searchParams.get('status') ?? '';
  const pageSize = 20;

  const query: Record<string, string> = {};
  if (status && ['new', 'seen', 'fulfilled'].includes(status)) query.status = status;

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 })
      .skip((page - 1) * pageSize).limit(pageSize)
      .populate('storeId', 'name slug').lean(),
    Order.countDocuments(query),
  ]);

  return NextResponse.json({ orders, total, page, pageSize });
}
