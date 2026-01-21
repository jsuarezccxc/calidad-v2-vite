import React from 'react';

const CrmContacts: React.FC = () => {
    return <iframe width="100%" height="62.5rem" src={`${process.env.REACT_APP_CRM_URL}/crm/contacts`} />;
};

export default CrmContacts;
