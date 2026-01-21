/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import { RootState } from '@redux/rootReducer';
import { putPublishWebsite, putUpdateWebsiteById, updatePages, uploadImage } from '@redux/website-node/actions';
import { postUpdateDiscount } from '@redux/website/actions';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType, IPageWebsite, Screen } from '@models/WebsiteNode';
import { getCurrentPublishMessage, getPageElements } from '@utils/WebsiteNode';
import { ElementType as ElementTypeId, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ZERO } from '@constants/UtilsConstants';
import { Tooltip } from '@components/tooltip';
import { Button, Link } from '@components/button';
import { Icon } from '@components/icon';
import { Checkbox } from '@components/checkbox';
import { Modal } from '@components/modal';
import usePermissions from '@hooks/usePermissions';
import usePopper from '@hooks/usePopper';
import { DROP_ZONE, IDraggableElement } from '../drag-and-drop';
import { ElementsContext, ScreensContext } from '../../context';
import { MessageButton } from './MessageButton';
import { IMAGE_TYPE, TypeStatusSave, autoSaveTimes, dataURLtoBlob, propMessage } from '.';
import './SaveButtons.scss';

export const SaveButtons: React.FC = () => {
    const dispatch = useDispatch();
    const { loader } = useSelector((state: RootState) => state.loader);
    const { activePage, selectedWebsite } = useSelector((state: RootState) => state.websiteNode);
    const { elements, updateElements, saveChanges: saveChangesProvider, selectElement } = useContext(ElementsContext);
    const { selectScreen, activeScreen } = useContext(ScreensContext);
    const [automaticSave, setAutomaticSave] = useState('');
    const [timeElapsed, setTimeElapsed] = useState(ZERO);
    const [messagePublish, setMessagePublish] = useState<string>('');
    const [publish, setPublish] = useState(new Date());
    const [isOpenModalPublish, setIsOpenModalPublish] = useState<boolean>(false);
    const [isOpenModalPublished, setIsOpenModalPublished] = useState<boolean>(false);
    const [websitePages, setWebsitePages] = useState<IGenericRecord[]>(
        selectedWebsite?.pages.map(page => ({
            id: page.id,
            tab_name: page.tab_name,
            order: page.order,
            is_enable: page.is_enable,
        }))
    );

    const { anchorEl: anchorElSaveButton, mouseProps: mousePropsSaveButton } = usePopper();
    const { anchorEl: anchorElPublishButton, mouseProps: mousePropsPublishButton } = usePopper();
    const { anchorEl: anchorElPolitics, mouseProps: mousePropsPolitics } = usePopper();

    const { disabledInputs } = usePermissions();
    const closeModal = (): void => setIsOpenModalPublish(false);

    useEffect(() => {
        setWebsitePages(
            selectedWebsite?.pages.map(page => ({
                id: page.id,
                tab_name: page.tab_name,
                order: page.order,
                is_enable: page.is_enable,
            }))
        );
    }, [selectedWebsite?.pages]);
    const [elementsSave, setElementsSave] = useState<IDraggableElement[]>([]);

    useEffect(() => {
        if (selectedWebsite?.published_at) setPublish(new Date(selectedWebsite?.published_at) || new Date());
    }, [activePage, elements]);

    useEffect(() => {
        setElementsSave(elements);
    }, [elements]);

    useEffect(() => {
        timeElapsed === autoSaveTimes.sixtySeconds && automaticSave === propMessage.save && setAutomaticSave(propMessage.minute);
    }, [timeElapsed]);

    useEffect(() => {
        updateMessage();
        const interval = setInterval(updateMessage, autoSaveTimes.oneMinutesMil);
        return (): void => {
            clearInterval(interval);
        };
    }, [publish]);

    useEffect(() => {
        updateWebsiteElements();
    }, [selectedWebsite]);

    const saveCurrentlyScreen = (): Screen => {
        const screen: Screen = activeScreen;
        selectScreen(Screen.Desktop);
        return screen;
    };

    const selectWebsitePage = (id: string): void => {
        setWebsitePages(
            websitePages.map(page => {
                if (page.id === id) {
                    return {
                        id: page.id,
                        tab_name: page.tab_name,
                        order: page.order,
                        is_enable: !page.is_enable,
                    };
                } else {
                    return page;
                }
            })
        );
    };

    const updateWebsiteElements = (): void => {
        if (activePage) {
            const page = selectedWebsite.pages?.find((page: IPageWebsite) => page.id === activePage.id);
            if (page) updateElements(getPageElements(page, selectedWebsite).map(element => ({ ...element, isNew: false })));
        }
    };

    const saveChanges = async (): Promise<void> => {
        const screen = saveCurrentlyScreen();
        const create: any = await saveChangesProvider();
        setAutomaticSave(create?.website?.id ? propMessage.save : propMessage.error);
        setTimeElapsed(ZERO);
        selectScreen(screen);
    };

    const getNewDiscounts = (): void => {
        let discounts: IGenericRecord[] = [];
        elementsSave.forEach(element => {
            if (element.type === ElementType.Banner) {
                discounts = element?.setting?.products?.map((product: IGenericRecord) => ({
                    unique_product_id: product.productId,
                    discount_website: product.discount,
                }));
                dispatch(postUpdateDiscount(discounts));
            }
        });
    };

    const handlePublishWebsite = async (): Promise<void> => {
        closeModal();
        if (websitePages.some(page => page.is_enable)) {
            selectElement(null);
            const screen = saveCurrentlyScreen();
            await dispatch(updatePages(websitePages));
            const data: any = await dispatch(putPublishWebsite(selectedWebsite.id));
            getNewDiscounts();
            if (data) {
                setIsOpenModalPublished(true);

                setPublish(
                    new Date(data?.find((item: IGenericRecord) => item.id === selectedWebsite.id).published_at) || new Date()
                );
                captureScreenshot();
            }
            selectScreen(screen);
        }
    };

    const captureScreenshot = async (): Promise<void> => {
        const contentWebsite = document.getElementById(DROP_ZONE);
        if (contentWebsite) {
            const canvas = await html2canvas(contentWebsite, { allowTaint: true });

            if (canvas) {
                const dataURL = canvas.toDataURL(IMAGE_TYPE);
                const typeBlob = dataURLtoBlob(dataURL);
                const typeFile = new File([typeBlob], 'screen.png', { type: IMAGE_TYPE });
                const result = await dispatch(uploadImage(typeFile));

                if (typeof result === 'string') {
                    await dispatch(putUpdateWebsiteById(selectedWebsite.id, { preview_website_url: result }));
                }
            }
        }
    };

    const updateMessage = (): void => {
        setMessagePublish(getCurrentPublishMessage(publish, autoSaveTimes));
    };

    const publishWithoutPages = websitePages?.every(page => page?.is_enable === false);

    return (
        <>
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-menu-publish`,
                    action: ActionElementType.INFO,
                    elementType: ElementTypeId.MDL,
                })}
                open={isOpenModalPublish}
                handleClose={(): void => closeModal()}
            >
                <div className="save-buttons__modal-publish">
                    <p className="text-xl font-bold text-blue font-allerbold mb-4.5">Publicar</p>
                    <p className="text-base text-gray-dark mb-4.5">Selecciona las páginas que desea publicar en su sitio web</p>
                    <div className="w-45">
                        {websitePages?.map(page => (
                            <div className="flex mb-2" key={page.id}>
                                <Checkbox
                                    id={generateId({
                                        module: ModuleApp.WEBSITE,
                                        submodule: `${ModuleApp.MODALS}-editor-menu-publish-page-${page.id}`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementTypeId.CHK,
                                    })}
                                    checked={!!page?.is_enable}
                                    onChange={(): void => selectWebsitePage(page.id)}
                                    label={page.tab_name}
                                    classLabel="text-gray-dark"
                                    classContainer="pl-8"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-4.5">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-menu-publish`,
                                action: ActionElementType.BACK,
                                elementType: ElementTypeId.BTN,
                            })}
                            text="Atrás"
                            classes="mr-4.5"
                            onClick={(): void => closeModal()}
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-menu-publish`,
                                action: ActionElementType.PUBLISH,
                                elementType: ElementTypeId.BTN,
                            })}
                            text="Publicar"
                            disabled={publishWithoutPages}
                            onClick={handlePublishWebsite}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-menu-publish-success`,
                    action: ActionElementType.INFO,
                    elementType: ElementTypeId.MDL,
                })}
                handleClose={(): void => setIsOpenModalPublished(false)}
                open={isOpenModalPublished}
            >
                <div className="page-carousel__delete-modal">
                    <Icon name="www" className="mb-2" />
                    <p className="mb-2 text-xl font-bold text-blue font-allerbold">¡Publicación exitosa!</p>
                    <p className="text-base text-center text-gray-dark">
                        Felicidades, su sitio web ha sido publicado con éxito. Sigue personalizándolo para llevar su empresa al
                        siguiente nivel.
                    </p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-menu-publish-success`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementTypeId.BTN,
                            })}
                            onClick={(): void => setIsOpenModalPublished(false)}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </Modal>
            <div className="mt-2">
                <div className="relative flex items-center cursor-pointer" onClick={saveChanges}>
                    <span {...mousePropsPolitics}>
                        <Icon name="infoGreen" className="w-4 h-4 mr-1 cursor-pointer" />
                    </span>
                    <Link
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-product-service`,
                            action: ActionElementType.ADD,
                            elementType: ElementTypeId.LNK,
                        })}
                        href="/product-database?add-product=true"
                        classes="underline text-purple text-tiny hover:text-purple mr-6"
                        text="Agregue un producto/servicio"
                    />
                    <span {...mousePropsPolitics}>
                        <Icon name="infoGreen" className="w-4 h-4 mr-1 cursor-pointer" />
                    </span>
                    <Link
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-politics`,
                            action: ActionElementType.ADD,
                            elementType: ElementTypeId.LNK,
                        })}
                        href="?page=add-politics"
                        classes="underline text-purple text-tiny hover:text-purple"
                        text="Agregue y/o edite las políticas de su sitio web"
                    />
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-politics`,
                            action: ActionElementType.INFO,
                            elementType: ElementTypeId.TOOL,
                        })}
                        iconName="infoBlue"
                        placement="top-start"
                        anchorEl={anchorElPolitics}
                        textStyles="text-blue"
                        title="Agregue y/o edite las políticas de su sitio web:"
                        description="Es la pantalla en diggi pymes para organizar y editar su propia política de tratamiento de datos para su sitio web, teniendo en cuenta el modelo de política de tratamiento de datos de CCXC."
                        wrapperClassName="rounded-lg"
                    />
                </div>
                <div className="flex mt-3 ml-64 gap-7">
                    <button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor`,
                            action: ActionElementType.SAVE,
                            elementType: ElementTypeId.BTN,
                        })}
                        className={disabledInputs || loader ? 'save-buttons__save--disabled' : 'save-buttons__save'}
                    >
                        <span {...mousePropsSaveButton}>
                            <Icon name="infoGreen" className="w-4 h-4 cursor-pointer" />
                        </span>

                        <span
                            {...(!disabledInputs && { onClick: saveChanges })}
                            className="flex items-center justify-center w-full h-full"
                        >
                            Guardar
                        </span>
                    </button>
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor`,
                            action: ActionElementType.SAVE,
                            elementType: ElementTypeId.TOOL,
                        })}
                        anchorEl={anchorElSaveButton}
                        iconName="infoBlue"
                        title="Guardar:"
                        description="Almacenar todos los cambios que agregó en su editor web."
                        placement="top-start"
                        textStyles="text-blue"
                        wrapperClassName="rounded-lg"
                    />
                    <button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor`,
                            action: ActionElementType.PUBLISH,
                            elementType: ElementTypeId.BTN,
                        })}
                        className={disabledInputs || loader ? 'save-buttons__published--disabled' : 'save-buttons__published'}
                    >
                        <span {...mousePropsPublishButton}>
                            <Icon name="infoGreen" className="w-4 h-4 cursor-pointer" />
                        </span>
                        <span
                            {...(!disabledInputs && { onClick: (): void => setIsOpenModalPublish(true) })}
                            className="flex items-center justify-center w-full h-full font-allerbold"
                        >
                            Publicar
                        </span>

                        <Tooltip
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `editor`,
                                action: ActionElementType.PUBLISH,
                                elementType: ElementTypeId.TOOL,
                            })}
                            anchorEl={anchorElPublishButton}
                            iconName="infoBlue"
                            title="Publicar:"
                            description="publique el contenido de su sitio web con los últimos cambios guardados."
                            placement="top-start"
                            textStyles="text-blue"
                            wrapperClassName="rounded-lg"
                        />
                    </button>
                </div>
                <MessageButton
                    statusSave={automaticSave as TypeStatusSave}
                    isDraft={selectedWebsite.is_draft}
                    publish={publish}
                    messagePublish={messagePublish}
                />
            </div>
        </>
    );
};
