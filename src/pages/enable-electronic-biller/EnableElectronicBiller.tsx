import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { postInstructions } from '@redux/company/actions';
import { getDynamicData } from '@redux/warehouses/actions';
import { INFORMATION } from '@information-texts/EnableElectronicBiller';
import { SharedModal } from '@components/modal';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Routes } from '@constants/Paths';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { Source } from '@constants/Onboarding';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import { IGenericRecord } from '@models/GenericRecord';
import { Step } from '@models/EnableElectronicBiller';
import { getRoute, getRouteName } from '@utils/Paths';
import { ModuleApp } from '@utils/GenerateId';
import { CompanyInformation, DianRegistration, Enablement, Steps } from './components';
import { dynamicDataRequest, getRoutes } from '.';
import './EnableElectronicBiller.scss';

const EnableElectronicBiller: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const routes = getRoutes();

    const [activeStep, setActiveStep] = useState<Step>(Step.CompanyInformation);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [showSteps, setShowSteps] = useState<boolean>(true);
    const [stepsCompleted, setStepsCompleted] = useState<number[]>([]);
    const [stepInstructions, setStepInstructions] = useState<IGenericRecord>({});
    const [fullStepOne, setFullStepOne] = useState(false);

    const { information } = useSelector(({ company }: RootState) => company);

    const { handlePostConfirmation } = useOnboardingNavigation(Source.ElectronicDocuments);

    useEffect(() => {
        dispatch(getDynamicData(dynamicDataRequest));
    }, []);

    useEffect(() => {
        if (information) setStepInstructions(information.step_instructions);
        if (information?.step_instructions?.enable_biller?.completedSteps.length) {
            setShowSteps(true);
            setStepsCompleted(information?.step_instructions.enable_biller?.completedSteps);
        }
    }, []);

    useEffect(() => {
        if (information?.step_instructions?.enable_biller?.completedSteps.length) {
            setStepsCompleted(information?.step_instructions.enable_biller?.completedSteps);
        }
    }, [information?.step_instructions]);

    const saveCompleteStep = (stepsCompleted: number[]): void => {
        const uniqueSteps = Array.from(new Set(stepsCompleted));
        dispatch(
            postInstructions({
                ...stepInstructions,
                enable_biller: {
                    completedSteps: uniqueSteps,
                    isComplete: false,
                },
            })
        );
    };

    const completeStep = (step: Step): void => {
        const hasStepCompleted = stepsCompleted.includes(step);

        if (step === Step.CompanyInformation) {
            if (!hasStepCompleted) {
                saveCompleteStep([...stepsCompleted, step]);
            }
            setFullStepOne(true);
            return;
        }

        if (hasStepCompleted) return;

        const newStepsCompleted = [...stepsCompleted, step];
        setStepsCompleted(newStepsCompleted);
        saveCompleteStep(newStepsCompleted);
    };

    const completeCompanyInformation = (): void => {
        if (activeStep === Step.Enablement) return handlePostConfirmation(toggleModal);
        toggleModal();
        completeStep(Step.CompanyInformation);
    };

    const selectStep = (step: Step): void => {
        setActiveStep(step);
        setShowSteps(false);
    };

    const returnStep = (showSteps = false): void => {
        setActiveStep(activeStep - 1);
        showSteps && setShowSteps(true);
    };

    const toggleModal = (): void => setOpenModal(!openModal);

    const saveAndRedirect = (): void => {
        completeStep(Step.Enablement);
        history.push(getRoute(Routes.NUMBER_RANGE));
    };

    const stepComponents: IGenericRecord = {
        [Step.CompanyInformation]: (
            <CompanyInformation
                returnStep={returnStep}
                toggleModal={toggleModal}
                fullStepOne={fullStepOne}
                selectStep={selectStep}
                completedStep={(e): void => completeStep(e)}
            />
        ),
        [Step.DianRegistration]: (
            <DianRegistration
                finalAction={(): void => {
                    completeStep(Step.DianRegistration);
                    setActiveStep(Step.Enablement);
                }}
                returnStep={returnStep}
                selectStep={selectStep}
            />
        ),
        [Step.Enablement]: <Enablement finalAction={saveAndRedirect} toggleModal={toggleModal} returnStep={returnStep} />,
    };

    return (
        <div className="electronic-biller">
            <div className="flex flex-col">
                <PageTitle title={getRouteName(Routes.ELECTRONIC_DOCUMENTS)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
                <BreadCrumb routes={routes} />
                <h2 className="electronic-biller__welcome-title">
                    {showSteps ? INFORMATION.WELCOME_TITLE : INFORMATION.STEPS_TITLE}
                </h2>
                {showSteps ? <Steps selectStep={selectStep} stepsCompleted={stepsCompleted} /> : stepComponents[activeStep]}
            </div>
            {openModal && (
                <SharedModal
                    moduleId={`${ModuleApp.ELECTRONIC_DOCUMENTS}-enable-biller`}
                    finalAction={completeCompanyInformation}
                    open
                />
            )}
        </div>
    );
};

export default EnableElectronicBiller;
