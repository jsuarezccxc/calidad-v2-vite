import React, { useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { CopyableAction, ElementsContext } from '@pages/website-editor/editor/context';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IDraggableElement } from '../../drag-and-drop';
import { Icon, ICommonToolsProps } from '.';

export const CommonTools: React.FC<ICommonToolsProps> = ({ deleteElement, justDelete = false }) => {
    const {
        addElement,
        copyableElement,
        elements,
        selectElement,
        selectedElement,
        selectCopyableElement,
        updateElements,
    } = useContext(ElementsContext);
    const { Copy, Cut } = CopyableAction;

    const applyActionToElement = (action: CopyableAction): void => {
        if (selectedElement) {
            selectCopyableElement({ id: selectedElement.id, action });
            if (action === Cut) {
                updateElements(
                    elements.map(element => {
                        if (selectedElement?.id === element.id) {
                            return {
                                ...element,
                                delete: true,
                            };
                        }
                        return element;
                    })
                );
            }
        }
    };

    const getElementToPaste = (element: IDraggableElement): IDraggableElement => ({
        ...element,
        ...(copyableElement?.action === Copy && { id: uuid() }),
    });

    const pasteElement = (): void => {
        if (!copyableElement) return;
        const element = elements.find(element => element.id === copyableElement.id);
        if (element) {
            selectCopyableElement(null);
            selectElement(null);
            const newElement = getElementToPaste(element);
            if (copyableElement.action === Copy) return addElement(newElement);
            if (copyableElement.action === Cut) newElement.delete = false;
            updateElements([...elements.filter(item => item.id !== element.id), newElement]);
        }
    };

    return (
        <div className="flex justify-end gap-2 ml-auto">
            {!justDelete && (
                <>
                    <Icon
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-action`,
                            action: ActionElementType.COPY,
                            elementType: ElementType.ICO,
                        })}
                        name="copy"
                        onClick={(): void => applyActionToElement(Copy)}
                        className="w-4 h-4.5"
                    />
                    <Icon
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-action`,
                            action: ActionElementType.PASTE,
                            elementType: ElementType.ICO,
                        })}
                        name="paste"
                        onClick={pasteElement}
                        className="w-4 h-4.5"
                    />
                    <Icon
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-action`,
                            action: ActionElementType.CUT,
                            elementType: ElementType.ICO,
                        })}
                        name="cut"
                        onClick={(): void => applyActionToElement(Cut)}
                        className="icon-size--common"
                    />
                </>
            )}
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action`,
                    action: ActionElementType.DELETE,
                    elementType: ElementType.ICO,
                })}
                name="delete"
                onClick={deleteElement}
                className="w-5.5 h-5.5"
            />
        </div>
    );
};
