import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const response = await fetch('http://127.0.0.1:8080/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Backend responded with error');
    }

    const data = await response.json();
    return NextResponse.json({ response: data.response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to contact chatbot' }, { status: 500 });
  }
}
