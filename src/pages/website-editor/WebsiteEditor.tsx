import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useParam from '@hooks/useParam';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { TitleButtons } from '@constants/Buttons';
import { INFORMATION } from '@information-texts/WebsiteEditor';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ElementsProvider, SidebarProvider, ScreensProvider } from './editor/context';
import { ADD_POLITICS, Editor, Preview, PREVIEW, AddPolitics, CREATE_POLITICS, CreatePolitics, RESIZE } from '.';

const WebsiteEditor: React.FC = () => {
    const history = useHistory();
    const { queryParam } = useParam('page');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = (): void => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener(RESIZE, handleResize);

        return (): void => {
            window.removeEventListener(RESIZE, handleResize);
        };
    }, []);

    if (queryParam === PREVIEW) return <Preview />;
    if (queryParam === ADD_POLITICS) return <AddPolitics />;
    if (queryParam === CREATE_POLITICS) return <CreatePolitics />;

    if (isMobile) {
        return (
            <div className="relative flex items-center h-screen w-76 -left-3">
                <div className="flex flex-col items-center w-full text-center">
                    <div className="flex flex-row items-start w-full mb-2">
                        <Icon name="infoBlue" onClick={(): void => {}} className="header__icon" alt="info-modal" />
                        <h3 className="ml-2 text-xl font-allerbold leading-xl text-blue">Información</h3>
                    </div>
                    <div className="w-full text-base font-normal text-left leading-base text-gray-dark font-aller">
                        {INFORMATION.MOBILE_INFORMATION}
                    </div>
                    <div className="flex justify-center mt-5">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: 'editor',
                                action: ActionElementType.BACK,
                                elementType: ElementType.BTN,
                            })}
                            text={TitleButtons.BACK}
                            onClick={(): void => history.goBack()}
                            classes="m-auto shadow-templateDesign"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ScreensProvider>
            <ElementsProvider>
                <SidebarProvider>
                    <Editor />
                </SidebarProvider>
            </ElementsProvider>
        </ScreensProvider>
    );
};

export default WebsiteEditor;
