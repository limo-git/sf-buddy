import { NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful learning assistant. Your goal is to help students understand concepts, provide explanations, and create practice questions. Keep responses clear, concise, and educational."
                },
                {
                    role: "user",
                    content: message
                }
            ],
        });

        return NextResponse.json({
            message: response.choices[0].message.content
        });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process your request' },
            { status: 500 }
        );
    }
} 