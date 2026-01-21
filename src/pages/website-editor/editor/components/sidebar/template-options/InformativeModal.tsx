//--- Libraries ---//
import React, { useContext } from 'react';
import { v4 } from 'uuid';
//--- Components ---//
import { Icon } from '@components/icon';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
//--- Pages ---//
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
//--- Utils ---//
import { PAGE_TEMPLATES } from '@utils/PageTemplates';
import { ElementType as ElementTypeId, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
//--- Models ---//
import { ElementType, Screen } from '@models/WebsiteNode';
//--- Interfaces ---//
import { IDraggableElement } from '../../drag-and-drop';
//--- Root ---//
import { IInformativeModalProps } from '.';

export const InformativeModal: React.FC<IInformativeModalProps> = ({ selectedTemplate, toggleModal }) => {
    const { activeScreen } = useContext(ScreensContext);
    const { updateElements, elements, selectElement } = useContext(ElementsContext);

    const addTemplateToWorkspace = (): void => {
        selectElement(null);
        const elementsToDelete: IDraggableElement[] = [];

        const headerAndFooter = elements.map(element => {
            if (element.type === ElementType.Header || element.type === ElementType.Footer) {
                return {
                    type: element.type,
                    id: element.dbId,
                    dbId: element.dbId,
                };
            }
        });

        elements.forEach(element => {
            if (element.type === ElementType.Header || element.type === ElementType.Footer) return;
            const elementToDelete = {
                ...element,
                delete: true,
            };
            elementsToDelete.push(elementToDelete);
        });

        const pageTemplates = PAGE_TEMPLATES[selectedTemplate].map(item => {
            if (item.type === ElementType.Header || item.type === ElementType.Footer) {
                return {
                    ...item,
                    id: headerAndFooter.find(element => element?.type === item?.type)?.id || '',
                    dbId: headerAndFooter.find(element => element?.type === item?.type)?.dbId || '',
                    style: {
                        ...item.style,
                        ...(activeScreen === Screen.Mobile ? { ...item.mobileStyle } : { ...item.desktopStyle }),
                    },
                };
            }

            return {
                ...item,
                id: v4(),
                style: activeScreen === Screen.Mobile ? item.mobileStyle || {} : item.desktopStyle || {},
            };
        });

        updateElements([...elementsToDelete, ...pageTemplates]);
        toggleModal();
    };

    return (
        <Modal
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `${ModuleApp.MODALS}-editor-tab-template-information`,
                action: ActionElementType.INFO,
                elementType: ElementTypeId.MDL,
            })}
            modalClassName="template-modal"
            open
            handleClose={toggleModal}
        >
            <div className="template-modal__content">
                <Icon name="warning" className="mb-2" />
                <h2 className="mb-2 text-xl text-blue font-allerbold">Información</h2>
                <p className="mt-2 text-center text-gray-dark mb-7">
                    Los cambios o componentes que se han agregado hasta el momento serán sobrescritos por la plantilla
                    seleccionada.
                </p>
                <div className="flex items-center justify-center">
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-tab-template-information`,
                            action: ActionElementType.CANCEL,
                            elementType: ElementTypeId.BTN,
                        })}
                        onClick={toggleModal}
                        text="Cancelar"
                        classes="mr-7"
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-tab-template-information`,
                            action: ActionElementType.ACCEPT,
                            elementType: ElementTypeId.BTN,
                        })}
                        onClick={addTemplateToWorkspace}
                        text="Aceptar"
                    />
                </div>
            </div>
        </Modal>
    );
};
