import React from 'react';

const CrmPqrsf: React.FC = () => {
    return <iframe width="100%" height="100%" src={`${process.env.REACT_APP_CRM_URL}/crm/services/pqrsf`} />;
};

export default CrmPqrsf;
