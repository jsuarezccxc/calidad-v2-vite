import React, { useState } from 'react';
import { currentDateInUnix } from '@utils/Date';
import InvoiceCorrection from './components/invoice-correction';

const CorrectionBusinessDocument: React.FC = () => {
    const [dateInput] = useState<number>(currentDateInUnix());

    return (
        <div className="flex flex-col h-full">
            <InvoiceCorrection dateInput={dateInput} />
        </div>
    );
};

export default CorrectionBusinessDocument;
