import React from 'react';
import { NumberRangeProvider } from './context/NumberRangeProvider';
import { ContentWrapper } from './components/ContentWrapper';
import { Footer, Header, Modals } from './components';

import './NumberRange.scss';

const NumberRange: React.FC = () => {
    return (
        <NumberRangeProvider>
            <Modals />
            <div className="xs:px-2">
                <Header />
                <ContentWrapper />
            </div>
            <Footer />
        </NumberRangeProvider>
    );
};

export default NumberRange;
