import { analytics } from "@/utils/analytics";

const Page = async () => {
    const pageView = await analytics.retrieve("pageview");
    return <p>page</p>;
};

export default Page;
