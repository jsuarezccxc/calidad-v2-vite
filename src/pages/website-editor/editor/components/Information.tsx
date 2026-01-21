import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from '@components/button';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { PageTitle } from '@components/page-title';
import { DROPZONE_WIDTH, SCREEN_WEBSITE, TEMPLATE } from '@constants/WebsiteNode';
import { VARIABLE_TYPE } from '@constants/DataTypes';
import { Routes } from '@constants/Paths';
import usePopper from '@hooks/usePopper';
import { CommonProperty, Screen } from '@models/WebsiteNode';
import { RootState } from '@redux/rootReducer';
import { getCommonProperties } from '@redux/website-node/actions';
import { getRoute } from '@utils/Paths';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ScreensContext } from '../context';
import { Screens } from './work-space';
import { DROP_ZONE } from './drag-and-drop';

export const Information: React.FC = () => {
    const [dispatch, history] = [useDispatch(), useHistory()];

    const {
        commonProperties: { domain },
    } = useSelector(({ websiteNode }: RootState) => websiteNode);

    const { selectScreen, activeScreen } = useContext(ScreensContext);
    const { anchorEl, togglePopper, mouseProps: mousePropsAddElements } = usePopper();
    const { anchorEl: anchorElPreview, mouseProps } = usePopper();

    const previewPage = (): void => {
        const { clientWidth } = document.querySelector(`#${DROP_ZONE}`) ?? { clientHeight: 0, clientWidth: 0 };
        localStorage.removeItem(TEMPLATE);
        localStorage.setItem(DROPZONE_WIDTH, clientWidth.toString());
        localStorage.setItem(SCREEN_WEBSITE, activeScreen);
    };

    const handleScreenChange = (screen: Screen): void => selectScreen(screen);

    useEffect(() => {
        dispatch(getCommonProperties([CommonProperty.Domain]));
    }, []);

    const handleRedirect = (path: Routes | string, openWindow = false): void => {
        if (!openWindow && typeof path !== VARIABLE_TYPE.STRING) return history.push(getRoute(path as Routes));
        window.open(`https://${path}`, '_blank');
    };

    return (
        <div className="information">
            <div>
                <PageTitle classContainer="editor__title" title="Mi sitio web" classTitle="text-xl" />
                <div className="flex items-center cursor-pointer" onClick={togglePopper} {...mousePropsAddElements}>
                    <Icon name="purpleLight" className="w-5.5 h-5.5 mr-1" />
                    <p className="underline text-purple">¿Cómo agregar los elementos al espacio de trabajo?</p>
                </div>
                <Tooltip
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-information-add-elements',
                        action: ActionElementType.INFO,
                        elementType: ElementType.TOOL,
                    })}
                    anchorEl={anchorEl}
                    iconName="light"
                    description="Para agregar los elementos al espacio de trabajo, selecciónelos con un clic sobre ellos. Si elige una plantilla, se añadirá automáticamente. Para los demás elementos, selecciónelos uno por uno y arrástrelos a la ubicación deseada."
                    placement="bottom-start"
                    textStyles="text-blue"
                    wrapperClassName="rounded-lg"
                />
            </div>
            <div className="flex items-center mr-2">
                <Screens handleScreenChange={handleScreenChange} activeScreen={activeScreen} />
                <div className="information__preview-button ml-7">
                    <span className="flex items-center" {...mouseProps}>
                        <Icon name="infoGreen" className="w-4 h-4 cursor-pointer" />
                    </span>

                    <Link
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-page`,
                            action: ActionElementType.PREVIEW,
                            elementType: ElementType.LNK,
                        })}
                        href="?page=preview"
                        classes="no-underline hover:no-underline mt-2 text-blue font-allerbold w-full h-full text-center text-xs"
                        text="Previsualizar"
                        target="_blank"
                        onClick={previewPage}
                    />
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-info-page`,
                            action: ActionElementType.PREVIEW,
                            elementType: ElementType.TOOL,
                        })}
                        anchorEl={anchorElPreview}
                        iconName="infoBlue"
                        title="Previsualizar:"
                        description="Visualice su sitio web en la versión de escritorio o versión móvil antes de publicarlo."
                        placement="bottom-start"
                        textStyles="text-blue"
                        wrapperClassName="rounded-lg"
                    />
                </div>
                <div
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-page`,
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.BTN,
                    })}
                    className="go-website"
                    onClick={(): void => handleRedirect(domain, true)}
                >
                    <p className="text-xs text-white cursor-pointer">Ir al sitio web</p>
                </div>
            </div>
        </div>
    );
};
