//--- Libraries ---//
import React, { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router';
//--- Assets ---//
import FinishStepExample from '@assets/images/finish-step-visibility.png';
//--- Components ---//
import { PageButtonsFooter } from '@components/page-buttons-footer';
//--- Constants ---//
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
//--- Utils ---//
import { getRoute } from '@utils/Paths';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
//--- Root ---//
import { buttonProps } from '.';

export const FinishStep: React.FC<{
    setCurrentStep?: Dispatch<SetStateAction<number>>;
}> = ({ setCurrentStep }) => {
    const history = useHistory();

    const finishStep = (): void => {
        history.push(getRoute(Routes.WEBSITE_SOCIAL));
    };

    const backStep = (): void => {
        history.push(getRoute(Routes.WEBSITE_VISIBILITY));
        if (setCurrentStep) setCurrentStep(4);
    };

    return (
        <div>
            <div className="bg-blue rounded-lg mb-4.5 desc-step-finish h-auto">
                <p className="text-base text-white font-allerbold">Paso 4: ¡Felicidades!</p>
            </div>
            <div className="bg-white rounded component-step wrapper-finish-step">
                <div className="flex flex-col items-center">
                    <img src={FinishStepExample} alt="First step example" width={721} height={265} />
                    <button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'visibility-finish-step-social-networks',
                            action: ActionElementType.ADD,
                            elementType: ElementType.BTN,
                        })}
                        className="text-white cursor-pointer bg-blue button-social mt-4.5"
                        onClick={(): void => {
                            history.push(getRoute(Routes.WEBSITE_SOCIAL));
                        }}
                    >
                        Agregar Redes Sociales
                    </button>
                </div>
            </div>
            <div className="footer-info">
                <PageButtonsFooter
                    {...buttonProps(history, finishStep, backStep)}
                    titleButtonLeft={TitleButtons.PREV_STEP}
                    classNameBtnLeft="px-2"
                    className="flex justify-end"
                />
            </div>
        </div>
    );
};
