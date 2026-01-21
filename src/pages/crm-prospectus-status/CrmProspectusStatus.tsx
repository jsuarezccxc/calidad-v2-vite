import React from 'react';

const CrmProspectusStatus: React.FC = () => {
    return <iframe width="100%" height="100%" src={`${process.env.REACT_APP_CRM_URL}/crm/sales-management/prospectus-status`} />;
};

export default CrmProspectusStatus;
