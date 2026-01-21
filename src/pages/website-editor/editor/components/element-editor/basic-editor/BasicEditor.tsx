/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useMemo, useState } from 'react';
import { CSSObject } from '@emotion/react';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { Icon as IconModal } from '@components/icon';
import { FontVariant, StyleProp } from '@constants/WebsiteNode';
import { ElementType } from '@models/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { TOOLS_PER_ELEMENT } from '@pages/website-editor/editor';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { ElementType as ElementTypeId, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { IDraggableElement, ZERO } from '../../drag-and-drop';
import { CommonTools } from './CommonTools';
import { Icon, getBorderStyle, getRotationStyle } from '.';

import './BasicEditor.scss';

export const BasicEditor: React.FC = () => {
    const { elements, selectElement, selectedElement, updateElements, updateDeletedElements } = useContext(ElementsContext);
    const { styleKey } = useContext(ScreensContext);
    const [deleteFooter, setDeleteFooter] = useState<boolean>(false);

    const optionsWithFrontBack = [
        ElementType.Form,
        ElementType.Carousel,
        ElementType.Banner,
        ElementType.Collage,
        ElementType.Catalog,
        ElementType.Blog,
    ];

    const deleteElement = (): void => {
        if (selectedElement?.type === ElementType.Footer && !deleteFooter) {
            setDeleteFooter(true);
            return;
        }
        if (selectedElement) {
            updateElements(
                elements.map(element => ({ ...element, delete: selectedElement.id === element.id || element.delete }))
            );
            updateDeletedElements(selectedElement.id);
            selectElement(null);
        }
    };

    const handleStyleChange = ({ name, value, pageIdLink = '' }: IGenericRecord): void => {
        const isFont = name === StyleProp.FONT_FAMILY;
        if (selectedElement) {
            const newStyle = {
                ...selectedElement.style,
                pageIdLink: pageIdLink ? pageIdLink : '',
                ...assignStyleValue({ name, value }, selectedElement),
                [name]: value,
                ...(isFont && { fontWeight: FontVariant.Regular }),
            };
            const moveOtherElements = newStyle?.zIndex !== undefined && newStyle.zIndex === ZERO;
            const newElement = {
                ...selectedElement,
                style: {
                    ...newStyle,
                    zIndex: moveOtherElements ? 1 : newStyle?.zIndex,
                },
                [styleKey]: { ...selectedElement?.[styleKey], ...newStyle, zIndex: moveOtherElements ? 1 : newStyle?.zIndex },
            };
            selectElement(newElement);
            updateElements(
                elements.map(element =>
                    element.id === newElement.id
                        ? newElement
                        : {
                              ...element,
                              style: {
                                  ...element.style,
                                  ...(pageIdLink && { pageIdLink }),
                                  zIndex:
                                      element?.style?.zIndex && moveOtherElements
                                          ? element?.style?.zIndex + 1
                                          : element?.style?.zIndex,
                              },
                          }
                )
            );
        }
    };

    const assignStyleValue = ({ name: property, value }: IGenericRecord, selectedElement: IDraggableElement): CSSObject => {
        if (property === 'borderStyle') return getBorderStyle(selectedElement, value);
        if (property === 'turn') return getRotationStyle(selectedElement, value);
        return {};
    };

    const Tools = useMemo(() => (selectedElement ? TOOLS_PER_ELEMENT[selectedElement.type] : null), [selectedElement?.type]);
    return (
        <div className="basic-editor">
            {Tools && <Tools handleStyleChange={handleStyleChange} style={selectedElement?.style} />}
            {selectedElement?.type !== ElementType.Header && (
                <>
                    {optionsWithFrontBack.some(element => selectedElement?.type === element) && (
                        <>
                            <Icon
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `editor-action`,
                                    action: ActionElementType.PUT_FORWARD,
                                    elementType: ElementTypeId.ICO,
                                })}
                                name="putForward"
                                className="mr-2 icon-size--common"
                                onClick={(): void => handleStyleChange({ name: 'zIndex', value: 10 })}
                            />
                            <Icon
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `editor-action`,
                                    action: ActionElementType.PUT_BACK,
                                    elementType: ElementTypeId.ICO,
                                })}
                                name="putBack"
                                className="icon-size--common"
                                onClick={(): void => handleStyleChange({ name: 'zIndex', value: 0 })}
                            />
                        </>
                    )}
                    <CommonTools deleteElement={deleteElement} justDelete={selectedElement?.type === ElementType.Footer} />
                </>
            )}
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-action-delete-footer`,
                    action: ActionElementType.INFO,
                    elementType: ElementTypeId.MDL,
                })}
                open={deleteFooter}
                handleClose={(): void => setDeleteFooter(false)}
            >
                <div className="basic-editor__modal-footer">
                    <IconModal name="recycleBin" className="mb-2" />
                    <p className="mb-2 text-xl font-bold text-blue font-allerbold">Eliminar</p>
                    <p className="mb-5 text-base text-center text-gray-dark">
                        De acuerdo con el <span className="text-purple">Artículo 2.2.2.25.3.1</span> del
                        <span className="text-purple"> Decreto único reglamentario 1074 de 2015</span>, las políticas de
                        tratamiento de datos personales deberán constar en medio electrónico.
                    </p>
                    <p className="mb-5 text-base text-center text-gray-dark">
                        Por lo que se recomienda mantener estás políticas de manera visible en su página web. En caso de
                        eliminarlas, CCxC Colombia S.A.S. se exime de cualquier tipo de responsabilidad.
                    </p>
                    <p className="text-base text-center mb-7 text-gray-dark">¿Confirma la eliminación del pie de página?</p>
                    <div className="flex items-center justify-center">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-action-delete-footer`,
                                action: ActionElementType.OMIT,
                                elementType: ElementTypeId.BTN,
                            })}
                            text="Omitir"
                            classes="mr-7"
                            onClick={(): void => setDeleteFooter(false)}
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-action-delete-footer`,
                                action: ActionElementType.DELETE,
                                elementType: ElementTypeId.BTN,
                            })}
                            text="Eliminar"
                            onClick={deleteElement}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
