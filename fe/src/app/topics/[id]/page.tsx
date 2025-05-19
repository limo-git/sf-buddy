import { notFound } from 'next/navigation';
import { mockTopics } from '@/lib/mockData';
import { PlayCircleIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

interface TopicPageProps {
    params: {
        id: string;
    };
}

export default function TopicPage({ params }: TopicPageProps) {
    const topic = mockTopics.find((t) => t.id === params.id);

    if (!topic) {
        notFound();
    }

    const resourceIcons = {
        video: PlayCircleIcon,
        article: DocumentTextIcon,
        exercise: AcademicCapIcon,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Topic Header */}
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                        <h1 className="text-3xl font-bold mb-4">{topic.title}</h1>
                        <p className="text-gray-600 mb-4">{topic.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {topic.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
                        <h2 className="text-2xl font-semibold mb-6">Learning Resources</h2>
                        <div className="space-y-4">
                            {topic.resources.map((resource) => {
                                const Icon = resourceIcons[resource.type];
                                return (
                                    <a
                                        key={resource.id}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                                    >
                                        <Icon className="w-6 h-6 text-blue-500 mt-1" />
                                        <div className="ml-4">
                                            <h3 className="font-medium mb-1">{resource.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                {resource.duration} minutes • {resource.type}
                                            </p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quiz */}
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold mb-6">Knowledge Check</h2>
                        <form className="space-y-6">
                            {topic.quiz.questions.map((question) => (
                                <div key={question.id} className="space-y-4">
                                    <p className="font-medium">{question.text}</p>

                                    {question.type === 'multiple-choice' ? (
                                        <div className="space-y-2">
                                            {question.options?.map((option) => (
                                                <label
                                                    key={option}
                                                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={question.id}
                                                        value={option}
                                                        className="text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <textarea
                                            name={question.id}
                                            rows={4}
                                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter your answer..."
                                        />
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Submit Quiz
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
} 