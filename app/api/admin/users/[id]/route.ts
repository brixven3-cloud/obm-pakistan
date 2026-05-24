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

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const body = await req.json();

  const update: Record<string, string> = {};
  if (body.status && ['pending', 'approved', 'blocked'].includes(body.status)) update.status = body.status;
  if (body.role   && ['client', 'admin'].includes(body.role))                  update.role   = body.role;

  // Prevent admin from modifying their own role
  if (params.id === session.user.id && update.role) {
    return NextResponse.json({ error: 'Apna role change nahi kar sakte' }, { status: 400 });
  }

  const user = await User.findByIdAndUpdate(params.id, update, { new: true }).select('-passwordHash');
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  if (params.id === session.user.id) {
    return NextResponse.json({ error: 'Apna account delete nahi kar sakte' }, { status: 400 });
  }

  await connectDB();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
