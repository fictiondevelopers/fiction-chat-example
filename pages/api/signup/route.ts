import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

type ResponseData = {
  id?: string;
  email?: string;
  name?: string;
  avatar?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  error?: string;
}

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, name, avatar } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({ 
                error: 'Email, password and name are required' 
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                avatar: avatar || null
            }
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return res.status(201).json(userWithoutPassword);

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
