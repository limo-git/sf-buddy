import { Topic, Resource, Quiz } from '@/types';

export const mockTopics: Topic[] = [
    {
        id: '1',
        title: 'Introduction to Algebra',
        description: 'Learn the basics of algebraic expressions and equations',
        tags: ['math', 'algebra', 'beginner'],
        difficulty: 'beginner',
        resources: [
            {
                id: 'r1',
                title: 'Understanding Variables',
                type: 'video',
                url: 'https://example.com/algebra-intro',
                tags: ['algebra', 'variables'],
                duration: 15
            },
            {
                id: 'r2',
                title: 'Solving Simple Equations',
                type: 'article',
                url: 'https://example.com/simple-equations',
                tags: ['algebra', 'equations'],
                duration: 20
            }
        ],
        quiz: {
            id: 'q1',
            topicId: '1',
            questions: [
                {
                    id: 'q1_1',
                    text: 'What is the value of x in 2x + 3 = 7?',
                    type: 'multiple-choice',
                    options: ['1', '2', '3', '4'],
                    correctAnswer: '2'
                },
                {
                    id: 'q1_2',
                    text: 'Explain what a variable is and provide an example.',
                    type: 'free-text'
                }
            ]
        }
    },
    {
        id: '2',
        title: 'Basic Probability',
        description: 'Understanding probability concepts and calculations',
        tags: ['math', 'probability', 'statistics'],
        difficulty: 'intermediate',
        resources: [
            {
                id: 'r3',
                title: 'Probability Fundamentals',
                type: 'video',
                url: 'https://example.com/prob-basics',
                tags: ['probability'],
                duration: 25
            }
        ],
        quiz: {
            id: 'q2',
            topicId: '2',
            questions: [
                {
                    id: 'q2_1',
                    text: 'What is the probability of rolling a 6 on a fair die?',
                    type: 'multiple-choice',
                    options: ['1/2', '1/3', '1/6', '1/4'],
                    correctAnswer: '1/6'
                }
            ]
        }
    }
]; 