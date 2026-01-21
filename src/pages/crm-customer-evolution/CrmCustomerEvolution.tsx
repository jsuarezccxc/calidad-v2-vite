import React from 'react';

const CrmCustomerEvolution: React.FC = () => {
    return <iframe width="100%" height="100%" src={`${process.env.REACT_APP_CRM_URL}/crm/sales-management/customer-evolution`} />;
};

export default CrmCustomerEvolution;
