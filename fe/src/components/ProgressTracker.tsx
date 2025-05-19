import { Topic } from '@/types';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ProgressTrackerProps {
    topics: Topic[];
}

export default function ProgressTracker({ topics }: ProgressTrackerProps) {
    // Mock progress data (in a real app, this would come from the database)
    const mockProgress = {
        completedTopics: ['1'],
        inProgressTopics: ['2'],
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>

            <div className="space-y-4">
                {topics.map((topic) => {
                    const isCompleted = mockProgress.completedTopics.includes(topic.id);
                    const isInProgress = mockProgress.inProgressTopics.includes(topic.id);

                    return (
                        <div
                            key={topic.id}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50"
                        >
                            {isCompleted ? (
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            ) : isInProgress ? (
                                <ClockIcon className="w-5 h-5 text-blue-500" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                            )}

                            <span className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                                {topic.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Completed</span>
                    <span>{mockProgress.completedTopics.length}/{topics.length}</span>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{
                            width: `${(mockProgress.completedTopics.length / topics.length) * 100}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
} 