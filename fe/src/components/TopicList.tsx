import { Topic } from '@/types';
import Link from 'next/link';

interface TopicListProps {
    topics: Topic[];
}

export default function TopicList({ topics }: TopicListProps) {
    return (
        <div className="space-y-4">
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {topic.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            {topic.resources.length} resources available
                        </span>
                        <Link
                            href={`/topics/${topic.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Start Learning
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
} 