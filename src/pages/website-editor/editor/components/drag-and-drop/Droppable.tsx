import React, { useContext, useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType, Screen } from '@models/WebsiteNode';
import { ElementsContext, SidebarContext, updateElementStyles } from '@pages/website-editor/editor/context';
import { getCenterCoordinates } from '@utils/WebsiteNode';
import { remToPx, specificPxToRecalculate } from '@utils/Size';
import { ReplacementModal } from '../replacement-modal';
import {
    DEFAULT_DIMENSION,
    DROP_ZONE,
    ELEMENT,
    FORM,
    HEADER_HEIGHT,
    IDraggableElement,
    IDroppableProps,
    MANDATORY_ELEMENTS,
} from '.';

export const Droppable: React.FC<IDroppableProps> = ({ activeScreen, background, children }) => {
    const { addElement, selectElement, elements, saveElement, updateElements, selectedElement } = useContext(ElementsContext);
    const { selectItem } = useContext(SidebarContext);
    const { setNodeRef } = useDroppable({ id: 'droppable' });
    const [replacementElement, setReplacementElement] = useState<IDraggableElement | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const headerHeight = useMemo(
        () => specificPxToRecalculate(elements.find(element => element.type === ElementType.Header)?.style?.height),
        [elements]
    );

    const handleDropEnd = (e: IGenericRecord): void => {
        e.preventDefault();
        const element = JSON.parse(e.dataTransfer.getData(ELEMENT));
        if (element.type === ElementType.Catalog) {
            setOpenModal(true);
            return setReplacementElement({
                ...element,
                ...updateElementStyles(element, { ...getCenterCoordinates(element.style), top: 72 }),
            });
        }
        if (element.type === ElementType.Header || element.type === ElementType.Footer) return replaceFixedElement(element);
        if (element.type === ElementType.Banner)
            return addElement({ ...element, style: { ...element.style, left: '0%', top: getCoordinates(e).top } });

        if (element) {
            const coordinates = getCoordinates(e);
            return addElement({
                ...element,
                style: { ...element.style, ...coordinates },
                desktopStyle: {
                    ...element?.desktopStyle,
                    ...coordinates,
                    ...(element.type === ElementType.Blog && {
                        articles: {
                            fontWeight: 'Bold',
                        },
                    }),
                },
                mobileStyle: {
                    ...element?.mobileStyle,
                    ...coordinates,
                    ...(element.type === ElementType.Blog && {
                        articles: {
                            fontWeight: 'Bold',
                        },
                    }),
                },
            });
        }
    };

    const addCatalog = (): void => {
        if (!replacementElement) return;
        const deleteElements: IDraggableElement[] = [];
        elements.forEach(item => {
            if (!MANDATORY_ELEMENTS.includes(item.type)) {
                deleteElements.push({
                    ...item,
                    is_delete: true,
                    delete: true,
                });
            }
        });
        const newElements = [
            ...elements.flatMap(element => (MANDATORY_ELEMENTS.includes(element.type) ? [element] : [])),
            ...deleteElements,
            replacementElement,
        ];
        updateElements(newElements);
        setOpenModal(false);
    };

    const replaceFixedElement = (element: IDraggableElement): void => {
        const currentElement = elements.find(item => item.type === element.type);
        if (currentElement) {
            const style = currentElement.style;
            saveElement({
                ...element,
                dbId: currentElement?.dbId,
                id: currentElement?.id,
                isNew: false,
                desktopStyle: { ...currentElement.desktopStyle, height: 0 },
                mobileStyle: { ...currentElement.mobileStyle, height: 0 },
                style: {
                    ...element.style,
                    top: style?.top,
                    left: style?.left,
                    width: style?.width,
                },
            });
        }
    };

    const getCoordinates = (e: IGenericRecord): { left: string; top: number } => {
        const { clientWidth, scrollTop } = document.querySelector(`#${DROP_ZONE}`) ?? {
            clientHeight: DEFAULT_DIMENSION,
            clientWidth: DEFAULT_DIMENSION,
        };
        const { left, top } = e?.target?.getBoundingClientRect();
        const calcTop = e?.clientY - top + (scrollTop ?? 0);
        return {
            left: ((e?.clientX - left) * 100) / clientWidth + '%',
            top: calcTop < headerHeight ? headerHeight + remToPx(HEADER_HEIGHT) : calcTop,
        };
    };

    const removeFocusedElement = ({ target: { tagName } }: IGenericRecord): void => {
        if (tagName === FORM) {
            selectElement(null);
            selectedElement && selectItem(null);
        }
    };

    return (
        <>
            <form
                className={`${DROP_ZONE} work-space__drop-zone bg-green-scrollbar ${
                    activeScreen === Screen.Mobile ? 'work-space__mobile invisible-scroll-bar' : ''
                }`}
                id={DROP_ZONE}
                autoComplete="off"
                onDrop={handleDropEnd}
                onDragOver={(e): void => e.preventDefault()}
                ref={setNodeRef}
                onClick={removeFocusedElement}
                style={{ background }}
            >
                {children}
            </form>
            {openModal && <ReplacementModal acceptChanges={addCatalog} toggleModal={(): void => setOpenModal(!openModal)} />}
        </>
    );
};
