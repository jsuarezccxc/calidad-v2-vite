import React from 'react';
import useIframeToken from '@hooks/useIframeToken';
import useIframeRedirect from '@hooks/useIframeRedirect';

const CrmDashboard: React.FC = () => {
    const URL = process.env.REACT_APP_CRM_URL || '';
    const { iframeRef } = useIframeToken(URL);
    useIframeRedirect();

    return <iframe ref={iframeRef} width="100%" height="100%" src={URL} title="CRM Iframe" />;
};

export default CrmDashboard;
