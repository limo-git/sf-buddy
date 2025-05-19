import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { mockTopics } from '@/lib/mockData';
import TopicList from '@/components/TopicList';
import ProgressTracker from '@/components/ProgressTracker';
import RecommendedTopics from '@/components/RecommendedTopics';

export default async function DashboardPage() {
    const session = await getServerSession();

    if (!session) {
        redirect('/api/auth/signin');
    }

    return (
        <div className="min-h-screen bg-black">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left sidebar with progress */}
                    <div className="md:col-span-3">
                        <ProgressTracker topics={mockTopics} />
                    </div>

                    {/* Main content area */}
                    <div className="md:col-span-6">
                        <h1 className="text-3xl font-bold mb-6">Your Learning Journey</h1>
                        <TopicList topics={mockTopics} />
                    </div>

                    {/* Right sidebar with recommendations */}
                    <div className="md:col-span-3">
                        <RecommendedTopics topics={mockTopics} />
                    </div>
                </div>
            </main>
        </div>
    );
} 