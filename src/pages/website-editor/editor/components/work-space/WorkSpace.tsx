import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType, Screen } from '@models/WebsiteNode';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { RootState } from '@redux/rootReducer';
import { ElementType as ElementTypeId, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { PageCarousel } from '../page-carousel';
import { BasicEditor, Icon } from '../element-editor/basic-editor';
import { DEFAULT_DIMENSION, DROP_ZONE, Draggable, Droppable, IDraggableElement, ZERO } from '../drag-and-drop';
import { DEFAULT_TOP_FOOTER, MARGIN_FOOTER } from '..';
import { ActionButtons, PageEditor } from '.';
import './WorkSpace.scss';

export const WorkSpace: React.FC = () => {
    const { elements, selectedElement, copyableElement, updateElements, pasteElement } = useContext(ElementsContext);
    const { activeScreen } = useContext(ScreensContext);
    const { activePage } = useSelector((state: RootState) => state.websiteNode);

    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } });
    const sensors = useSensors(mouseSensor, touchSensor);
    const handleDragEnd = (e: IGenericRecord): void => {
        const { clientWidth } = document.querySelector(`#${DROP_ZONE}`) ?? {
            clientHeight: DEFAULT_DIMENSION,
            clientWidth: DEFAULT_DIMENSION,
        };

        const componentId = e.active?.id;
        let lastElement: number;
        const currentElement = elements.find((element: IDraggableElement) => element.id === componentId);
        if (currentElement) {
            const topCurrentElement = getCoordinates(e, currentElement).top + currentElement.style.height;
            const topHighestElement = getElementWithHighestBottom(
                elements.filter(
                    element => element.type !== ElementType.Footer && element.type !== ElementType.Header && !element.delete
                )
            );
            lastElement =
                Math.max(
                    topCurrentElement,
                    topHighestElement?.style.top + topHighestElement?.style.height || ZERO,
                    DEFAULT_TOP_FOOTER
                ) + MARGIN_FOOTER;
        }

        updateElements(
            elements.map(element => {
                return {
                    ...element,
                    ...(element.type === ElementType.Footer && {
                        style: {
                            ...element.style,
                            top: lastElement,
                        },
                    }),
                    ...(element.type === ElementType.Footer &&
                        activeScreen === Screen.Desktop && {
                            desktopStyle: {
                                ...element.desktopStyle,
                                top: lastElement,
                            },
                        }),
                    ...(element.type === ElementType.Footer &&
                        activeScreen === Screen.Mobile && {
                            mobileStyle: {
                                ...element.mobileStyle,
                                top: lastElement,
                            },
                        }),
                    ...(element.id === componentId && {
                        style: {
                            ...element.style,
                            top: getCoordinates(e, element).top,
                            left: (getCoordinates(e, element).left * 100) / clientWidth + '%',
                        },
                    }),
                };
            })
        );
    };

    const getElementWithHighestBottom = (elements: IDraggableElement[]): IDraggableElement | null => {
        return elements.reduce<IDraggableElement | null>((maxElement, element) => {
            const { top, height } = element.style;
            const maxTop = (top || ZERO) + (height || ZERO);

            if (!maxElement || maxTop > (maxElement.style.top || ZERO) + (maxElement.style.height || ZERO)) {
                return element;
            }
            return maxElement;
        }, null);
    };

    const getCoordinates = (e: IGenericRecord, element: IDraggableElement): { top: number; left: number } => {
        const { clientWidth } = document.querySelector(`#${DROP_ZONE}`) ?? { clientHeight: 0, clientWidth: 0 };
        const leftPX = (element?.style?.left?.split('%')[0] / 100) * clientWidth;
        return {
            top: element?.style?.top + e?.delta?.y,
            left: leftPX + e?.delta?.x,
        };
    };

    return (
        <div className="work-space" id="work-space">
            <div className="work-space__box">
                <div className="flex items-center w-full pr-2 border-b border-gray-smoke">
                    {selectedElement ? <BasicEditor /> : <PageEditor />}
                    {copyableElement && !selectedElement && (
                        <Icon
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `editor-action-workspace`,
                                action: ActionElementType.PASTE,
                                elementType: ElementTypeId.ICO,
                            })}
                            name="paste"
                            onClick={pasteElement}
                            className="icon--paste"
                        />
                    )}
                    <ActionButtons />
                </div>
                <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                    <Droppable activeScreen={activeScreen} background={activePage?.style?.background}>
                        {elements.map((element, index) =>
                            element.delete ? null : <Draggable key={`${element.id}${index}`} element={element} />
                        )}
                    </Droppable>
                </DndContext>
                <PageCarousel />
            </div>
        </div>
    );
};
