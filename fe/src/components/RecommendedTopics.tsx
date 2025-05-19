import { Topic } from '@/types';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface RecommendedTopicsProps {
    topics: Topic[];
}

export default function RecommendedTopics({ topics }: RecommendedTopicsProps) {
    // In a real app, this would be filtered based on user's progress and interests
    const recommendedTopics = topics.slice(0, 3);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
                <SparklesIcon className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold">Recommended</h2>
            </div>

            <div className="space-y-4">
                {recommendedTopics.map((topic) => (
                    <Link
                        key={topic.id}
                        href={`/topics/${topic.id}`}
                        className="block p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                    >
                        <h3 className="font-medium mb-1">{topic.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{topic.description}</p>

                        <div className="flex flex-wrap gap-1">
                            {topic.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-4 text-center">
                <Link
                    href="/topics"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                    View all topics →
                </Link>
            </div>
        </div>
    );
} 