import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { TitleButtons } from '@constants/Buttons';
import { lengthEqualToZero } from '@utils/Length';
import { ModuleApp } from '@utils/GenerateId';
import useParam from '@hooks/useParam';
import { IGenericRecord } from '@models/GenericRecord';
import { MENU, Direction, DocsInstructionContext } from '../context';
import { stepsUrl } from '../pages';

export const Footer: React.FC = () => {
    const history = useHistory();
    const { queryParam } = useParam(MENU);
    const { getNextStepRoute, step } = useContext(DocsInstructionContext);

    const nameButton = (step: stepsUrl): { back: string; next: string } => {
        const defaultTexts = {
            back: TitleButtons.BACK,
            next: TitleButtons.NEXT,
            prev_step: TitleButtons.PREV_STEP,
            next_step: TitleButtons.NEXT_STEP,
        };

        const textButtons: IGenericRecord = {
            [stepsUrl.REQUEST]: {
                back: defaultTexts.back,
                next: defaultTexts.next_step,
            },
            [stepsUrl.SYNC]: {
                back: defaultTexts.prev_step,
                next: defaultTexts.next_step,
            },
        };

        return textButtons[step] || { back: defaultTexts.back, next: defaultTexts.next };
    };

    return (
        <>
            {step !== stepsUrl.GENERATE && (
                <PageButtonsFooter
                    moduleId={ModuleApp.FOOTER}
                    titleButtonLeft={nameButton(step as stepsUrl).back}
                    titleButtonRight={nameButton(step as stepsUrl).next}
                    onClickButtonRight={(): void => getNextStepRoute(Direction.NEXT)}
                    onClickButtonLeft={(): void => {
                        if (lengthEqualToZero(step) || queryParam) return history.goBack();
                        getNextStepRoute(Direction.PREV);
                    }}
                    classNameBtnLeft="px-2.5"
                    className="buttons-footer"
                />
            )}
        </>
    );
};
