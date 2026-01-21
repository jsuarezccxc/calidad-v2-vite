import React, { useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { Icon } from '@components/icon';
import { Information } from '@components/information';
import { PRODUCT_NAME } from '@constants/ProductName';
import { DocsInstructionContext } from '../context';
import { StepsCard } from '../components';
import { IStep } from '..';
import { EMPTY_STEPS } from '.';

export const Steps: React.FC = () => {
    const { docSteps, stepInstructions = null, doc, handleSelectStep } = useContext(DocsInstructionContext);
    const stepInstructionsDoc = stepInstructions ? (stepInstructions[doc] ?? EMPTY_STEPS) : EMPTY_STEPS;
    return (
        <>
            <Information
                classNameContainer="mb-7 mt-7"
                classNameTitle="text-blue"
                title={`Tan sencillo como hacerlo en ${docSteps.length} simples pasos`}
                description=""
            />
            <div className="flex flex-wrap items-start justify-center gap-12">
                <div className="flex flex-col">
                    {docSteps.map((step: IStep) => {
                        return (
                            <StepsCard
                                {...step}
                                onClick={(): void => handleSelectStep(step.type)}
                                stepComplete={stepInstructionsDoc.completedSteps.includes(step.type)}
                                key={uuid()}
                            />
                        );
                    })}
                </div>
                <div className="flex flex-col items-center -mt-14">
                    <div className="help-text">
                        <p className="text-sm text-white">Preguntas frecuentes</p>
                        <Icon name="questionGreen" className="absolute top-0 -right-9" />
                    </div>
                    <div className="help-card">
                        <p className="text-sm text-center text-gray-dark">
                            <span className="font-allerbold">Definiciones cortas</span> y claras de los términos que encontrará en
                            la factura electrónica y que usted podría no conocer
                        </p>
                    </div>
                    <div className="help-card">
                        <p className="text-sm text-center text-gray-dark">
                            <span className="font-allerbold">Acompañamiento</span> de un experto en facturación electrónica de
                            <span className="font-allerbold"> {PRODUCT_NAME}</span> para entender este módulo.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
