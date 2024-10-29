import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type ResponseData = {
    id?: string;
    email?: string;
    name?: string;
    avatar?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    error?: string;
    token?: string;
    message?: string;
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
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid password'
            });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        // Sign JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            ...userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
