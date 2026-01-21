import React from 'react';

const CrmCustomReports: React.FC = () => {
    return <iframe width="100%" height="100%" src={process.env.REACT_APP_CRM_URL} />;
};

export default CrmCustomReports;
