import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useParam from '@hooks/useParam';
import { STEPS } from '@information-texts/DocsInstruction';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { postInstructions } from '@redux/company/actions';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { CARD_OPTION_DEFAULT, stepsUrl } from '../pages';
import { IStep } from '..';
import { Direction, DOC, DocsInstructionContext, INSTRUCTION, MENU, TypeDoc } from '.';

const DocsInstructionProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch();
    const { queryParam } = useParam(DOC);
    const { queryParam: instructions } = useParam(INSTRUCTION);
    const { queryParam: menu } = useParam(MENU);
    const [doc, setDoc] = useState('');
    const [step, setStep] = useState('');
    const [docSteps, setDocSteps] = useState(STEPS[doc as TypeDoc]);
    const [currentStep, setCurrentStep] = useState<IStep>();
    const [stepInstructions, setStepInstructions] = useState<IGenericRecord | null>(null);
    const [cardsOptions, setCardsOptions] = useState(CARD_OPTION_DEFAULT);
    const [validateSelectedDoc, setValidateSelectedDoc] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const {
        company: { information },
    } = useSelector(({ company }: RootState) => ({ company }));

    useEffect(() => {
        handleSelectDoc(queryParam as TypeDoc);
        if (instructions) handleSelectStep(stepsUrl.SYNC);
        if (menu) handleSelectStep(stepsUrl.MENU);
    }, [queryParam, instructions, menu]);

    useEffect(() => {
        if (information) setStepInstructions(information.step_instructions);
    }, [information]);

    useEffect(() => {
        const updatedCards = cardsOptions.map(card => ({
            ...card,
            isSelected: card.typeDoc === doc,
        }));
        setCardsOptions(updatedCards);
        setDocSteps(STEPS[doc as TypeDoc] ?? []);
    }, [doc]);

    useEffect(() => {
        if (lengthGreaterThanZero(step)) {
            setCurrentStep(docSteps.find(stepDoc => stepDoc.type === step));
        }
    }, [step, docSteps]);

    const handleValidateSelectedDocument = (value?: boolean): void => {
        setValidateSelectedDoc(value ?? !validateSelectedDoc);
    };
    const handleShowModal = (): void => {
        setShowModal(!showModal);
    };
    const handleSelectDoc = (value: TypeDoc): void => {
        setDoc(value);
    };
    const handleSelectStep = (value: stepsUrl): void => {
        setStep(value);
    };

    const getNextStepRoute = (direction: Direction = Direction.NEXT): void => {
        if (direction === Direction.NEXT && lengthEqualToZero(doc)) {
            handleValidateSelectedDocument(true);
            return;
        }

        if (lengthEqualToZero(step)) {
            return setStep(stepsUrl.MENU);
        }
        const stepsForDoc = STEPS[doc as TypeDoc];

        const currentIndex = step !== stepsUrl.MENU ? stepsForDoc.findIndex(s => s.type === step) : -1;

        if (direction === Direction.NEXT && currentIndex < stepsForDoc.length - 1) {
            const nextStep = stepsForDoc[currentIndex + 1];
            return setStep(nextStep.type);
        }

        if (direction === Direction.PREV && currentIndex > 0) {
            const previousStep = stepsForDoc[currentIndex - 1];
            return setStep(previousStep.type);
        }

        if (direction === Direction.PREV && (step === stepsUrl.MENU || currentIndex === -1)) {
            return setStep('');
        }

        return setStep(stepsUrl.MENU);
    };

    const saveCompleteStep = (): void => {
        if (!stepInstructions || !stepInstructions[doc]) {
            dispatch(
                postInstructions({
                    ...stepInstructions,
                    [doc]: {
                        completedSteps: [step],
                        isComplete: docSteps.every(({ type }) => [step].includes(type)),
                    },
                }),
            );
        } else if (!stepInstructions[doc].completedSteps.includes(step)) {
            dispatch(
                postInstructions({
                    ...stepInstructions,
                    [doc]: {
                        ...stepInstructions[doc],
                        completedSteps: [...stepInstructions[doc].completedSteps, step],
                        isComplete: docSteps.every(({ type }) => [...stepInstructions[doc].completedSteps, step].includes(type)),
                    },
                }),
            );
        }
    };

    return (
        <DocsInstructionContext.Provider
            value={{
                cardsOptions,
                doc,
                step,
                getNextStepRoute,
                docSteps,
                currentStep,
                stepInstructions,
                saveCompleteStep,
                handleValidateSelectedDocument,
                validateSelectedDoc,
                handleSelectDoc,
                handleSelectStep,
                handleShowModal,
                showModal,
            }}
        >
            <div id="instruction-content">{children}</div>
        </DocsInstructionContext.Provider>
    );
};

export default DocsInstructionProvider;
