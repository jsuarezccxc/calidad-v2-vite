//--- Libraries ---//
import React, { ReactElement, useState } from 'react';
import { useHistory } from 'react-router';
//--- Components ---//
import { PageTitle } from '@components/page-title';
import { ModalType } from '@components/modal-custom';
import { BreadCrumb } from '@components/bread-crumb';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Advisory, Contact, Definitions, InstructionCards } from './components';
//--- Constants ---//
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
//--- Hooks ---//
import useParam from '@hooks/useParam';
//--- Information texts ---//
import { INFORMATION, PAGE_TEXTS } from '@information-texts/HelpCenter';
//--- Models ---//
import { Help } from '@models/HelpCenter';
//--- Utils ---//
import { getRoute, getRouteName } from '@utils/Paths';
//--- Root ---//
import { getRoutes, MAIN, NAME, WORDS } from '.';
//--- Styles ---//
import './HelpCenter.scss';
import { ModuleApp } from '@utils/GenerateId';

const HelpCenter: React.FC = () => {
    const history = useHistory();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const { queryParam } = useParam(NAME);
    const { queryParam: words } = useParam(WORDS);

    const { description, title } = PAGE_TEXTS[queryParam || MAIN];
    const routes = getRoutes(title);

    const selectHelp = (help: Help): void => history.push(`?${NAME}=${help}`);

    const toggleModal = (): void => setOpenModal(!openModal);

    const help: { [key: string]: ReactElement } = {
        [Help.Advisory]: <Advisory toggleModal={toggleModal} />,
        [Help.Contact]: <Contact toggleModal={toggleModal} />,
        [Help.Definitions]: <Definitions words={words} />,
    };
    const validateHelpValues = Object.values(Help);

    return (
        <div className="help-center">
            <main className="flex-1">
                {!!queryParam && (
                    <>
                        <PageTitle title={getRouteName(Routes.HELP_CENTER)} />
                        <BreadCrumb routes={routes} />
                    </>
                )}
                <h2 className={`help-center__caption ${queryParam ? '' : 'mt-7'}`}>{title}</h2>
                {words && <h3 className="font-allerbold text-blue text-lg -mb-2.5 mt-4.5">{PAGE_TEXTS[queryParam].subTitle}</h3>}
                <p className="text-gray-dark my-4.5">{words ? PAGE_TEXTS[queryParam].subDescription : description}</p>
                {queryParam ? help[queryParam] : <InstructionCards selectHelp={selectHelp} />}
            </main>
            {!validateHelpValues.includes(queryParam as Help) && (
                <PageButtonsFooter
                    moduleId={ModuleApp.HELP_CENTER}
                    titleButtonLeft={TitleButtons.BACK}
                    titleButtonRight={TitleButtons.NEXT}
                    onClickButtonLeft={(): void => history.goBack()}
                    onClickButtonRight={(): void => history.push(`${getRoute(Routes.HELP_CENTER)}?name=definitions`)}
                />
            )}
            {openModal && <ModalType  show showModal={toggleModal} {...INFORMATION.MODAL} />}
        </div>
    );
};

export default HelpCenter;
