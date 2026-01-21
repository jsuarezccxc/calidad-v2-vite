import React, { useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { DOCS_INSTRUCTION } from '@information-texts/DocsInstruction';
import { Information } from '@components/information';
import { DocsInstructionContext, TypeDoc } from '../context';
import { IRadioCard, RadioCard } from '../components';

export const DocSelector: React.FC = () => {
    const { SUBTITLE, DESCRIPTION } = DOCS_INSTRUCTION();
    const { cardsOptions, handleValidateSelectedDocument, validateSelectedDoc, handleSelectDoc } = useContext(
        DocsInstructionContext
    );

    const handleClickContainer = (typeDoc: string): void => {
        handleSelectDoc(typeDoc as TypeDoc);
        handleValidateSelectedDocument(false);
    };

    return (
        <>
            <Information classNameContainer="mb-7" classNameTitle="title-small" title={SUBTITLE} description={DESCRIPTION} />
            <div className="flex flex-row flex-wrap items-center justify-center w-full gap-7 mb-17">
                {cardsOptions.map((card: IRadioCard) => (
                    <RadioCard
                        {...card}
                        onClick={(): void => handleClickContainer(card.typeDoc)}
                        validate={validateSelectedDoc}
                        key={uuid()}
                    />
                ))}
            </div>
        </>
    );
};
