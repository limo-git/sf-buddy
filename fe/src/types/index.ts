export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    topics: string[];
    completedTopics: string[];
    quizScores: QuizScore[];
    lastActive: Date;
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    resources: Resource[];
    quiz: Quiz;
}

export interface Resource {
    id: string;
    title: string;
    type: 'video' | 'article' | 'exercise';
    url: string;
    tags: string[];
    duration: number; // in minutes
}

export interface Quiz {
    id: string;
    topicId: string;
    questions: Question[];
}

export interface Question {
    id: string;
    text: string;
    type: 'multiple-choice' | 'free-text';
    options?: string[];
    correctAnswer?: string;
}

export interface QuizScore {
    quizId: string;
    score: number;
    feedback: string;
    completedAt: Date;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface LearningProgress {
    userId: string;
    topicId: string;
    status: 'not-started' | 'in-progress' | 'completed';
    lastAccessed: Date;
    resourcesCompleted: string[];
} 