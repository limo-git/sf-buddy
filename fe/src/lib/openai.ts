import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeUserProgress(topics: string[], scores: number[]) {
    const prompt = `
    Given a student's completed topics: ${topics.join(', ')}
    And their scores: ${scores.join(', ')}
    Analyze their performance and suggest next topics to focus on.
    Format your response as JSON with fields:
    - strengths: string[]
    - weaknesses: string[]
    - recommendedTopics: string[]
    - feedback: string
  `;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content || '{}');
}

export async function evaluateQuizAnswer(question: string, answer: string) {
    const prompt = `
    Question: ${question}
    Student's Answer: ${answer}
    
    Evaluate the answer and provide:
    - A score between 0 and 100
    - Specific feedback on what was good
    - Areas for improvement
    Format as JSON with fields: score, feedback, improvements
  `;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content || '{}');
}

export default openai; 