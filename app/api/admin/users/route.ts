import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

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
  const q        = searchParams.get('q') ?? '';
  const pageSize = 20;

  const query = q
    ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).select('-passwordHash').sort({ createdAt: -1 })
      .skip((page - 1) * pageSize).limit(pageSize).lean(),
    User.countDocuments(query),
  ]);

  return NextResponse.json({ users, total, page, pageSize });
}
