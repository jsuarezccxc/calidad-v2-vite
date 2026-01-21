import React from 'react';
import { ContentWrapper, Footer, Header } from './components';
import DocsInstructionProvider from './context/DocsInstructionProvider';
import './DocInstructions.scss';

const DocsInstructions: React.FC = () => {
    return (
        <DocsInstructionProvider>
            <Header />
            <ContentWrapper />
            <Footer />
        </DocsInstructionProvider>
    );
};

export default DocsInstructions;
