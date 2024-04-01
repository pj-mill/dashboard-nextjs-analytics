import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { analytics } from "@/utils/analytics";

const Page = async () => {
    const pageView = await analytics.retrieveDays("pageview", 2);

    <div className="min-h-screen w-full py-12 flex justify-center items-center">
        <div className="relative w-full max-w-6xl mx-auto text-white">
            <AnalyticsDashboard />
        </div>
    </div>;
};

export default Page;
