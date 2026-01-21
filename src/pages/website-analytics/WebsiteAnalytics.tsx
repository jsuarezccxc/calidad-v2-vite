import React from 'react';
import { useSelector } from 'react-redux';
import { WEBSITE_PLANS } from '@constants/WebsiteNode';
import { RootState } from '@redux/rootReducer';
import WebsiteDashboard from './pages/website-dashboard';
import WebsiteMetrics from './pages/website-metrics';

const WebsiteAnalytics: React.FC = () => {
    const {
        membership: { planWebsiteActive },
    } = useSelector((state: RootState) => state);

    return planWebsiteActive === WEBSITE_PLANS.BASIC_PLAN || planWebsiteActive === WEBSITE_PLANS.ADVANCED_PLAN ? (
        <WebsiteDashboard />
    ) : (
        <WebsiteMetrics />
    );
};

export default WebsiteAnalytics;
