import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ChangeEvent } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType } from '@models/WebsiteNode';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { remToPx, specificPxToRecalculate } from '@utils/Size';
import { DEFAULT_TOP_FOOTER, DEFAULT_TOP_FOOTER_MOBILE } from '..';
import {
    DRAGGABLE_ELEMENT,
    IDraggableProps,
    ELEMENTS_WITH_FIXED_DIMENSIONS,
    MANDATORY_ELEMENTS,
    DROP_ZONE,
    resetSize,
    ZERO,
    HUNDRED,
    OPTIONS_COLLAGE_WITH_FIXED_DIMENSIONS,
    getCurrentDimensions,
    HEADER_HEIGHT,
    IDraggableElement,
} from '.';

export const Draggable: React.FC<IDraggableProps> = ({ element }) => {
    const { id, style, type, option, mobileStyle } = element;

    const { elements, saveElement, selectElement, selectedElement, updateElements, deletedElements } = useContext(
        ElementsContext
    );
    const { styleKey, isMobile } = useContext(ScreensContext);
    const [textBoxValue, setTextBoxValue] = useState<string>('');
    const containerRef = useRef<HTMLDivElement>(null);
    const Element = useMemo(() => DRAGGABLE_ELEMENT[type], [type]);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const transformStyle = { transform: CSS.Translate.toString(transform) };

    useEffect(() => {
        updateStylePerScreen();
    }, [style?.left, style?.top, style?.width, style?.height]);

    useEffect(() => {
        updateElements(
            elements.map(element => ({ ...element, style: { ...element.style, ...element?.[styleKey] } })),
            true
        );
    }, [styleKey]);

    useEffect(() => {
        const isCatalog = element.type === ElementType.Catalog;
        if (isCatalog) saveElement({ ...element, style: getCurrentDimensions(element, containerRef) });
    }, []);

    const handleSelectedElement = (): void => {
        const currentElement = elements.find(element => element.id === id);
        if (currentElement) selectElement(currentElement);
    };

    const headerHeight = useMemo(
        () => specificPxToRecalculate(elements.find(element => element.type === ElementType.Header)?.style?.height),
        [elements]
    );

    const updateStylePerScreen = (): void => {
        if (selectedElement) {
            const newValue: IGenericRecord = String(style?.left).includes('px')
                ? { left: getLeftInPercentage() }
                : { ...style, left: getLeft() };
            if (newValue?.top < headerHeight) newValue.top = headerHeight + remToPx(HEADER_HEIGHT);
            if (selectedElement?.type === ElementType.Text && textBoxValue) {
                selectedElement.value = textBoxValue;
            }
            saveElement({
                ...selectedElement,
                style: { ...selectedElement?.style, ...newValue },
                [styleKey]: { ...selectedElement?.[styleKey], ...newValue },
            });
        }
    };

    const getLeftInPercentage = (): string => {
        const droppableWidth = document.querySelector(`#${DROP_ZONE}`)?.clientWidth ?? 0;
        const [px] = style.left.split('px');
        return (Number(px) * 100) / droppableWidth + '%';
    };

    const handleMouseUp = (): void => {
        if (element.type === ElementType.Catalog) return;
        const currentElement = elements.find(element => element.id === selectedElement?.id);
        if (currentElement) saveElement({ ...currentElement, style: getCurrentDimensions(currentElement, containerRef) });
    };

    const handleTextChange = ({ target: { value, scrollHeight } }: ChangeEvent): void => {
        updateElements(
            elements.map(element => {
                const validationForElement = element.id === id;
                if (validationForElement) {
                    element.value = value;
                    if (element.type === ElementType.Text) {
                        const dynamicHeight = `${scrollHeight}px`;
                        style.height = dynamicHeight;
                        element.style.height = dynamicHeight;
                        setTextBoxValue(value);
                    }
                }
                return element;
            })
        );
    };

    const { allowResizing, elementListeners } = useMemo(
        () => ({
            allowResizing:
                type === ElementType.Collage
                    ? !OPTIONS_COLLAGE_WITH_FIXED_DIMENSIONS.includes(option)
                    : !ELEMENTS_WITH_FIXED_DIMENSIONS.includes(type),
            elementListeners: MANDATORY_ELEMENTS.includes(type) ? {} : listeners,
        }),

        [type]
    );

    const isFocused = useMemo(() => id === selectedElement?.id, [id, selectedElement?.id]);

    const parentStyle = useMemo(
        () => ({
            ...transformStyle,
            ...style,
            background: '',
            rotate: '',
            top: style?.top,
            left: type === ElementType.Header ? '0%' : style?.left,
            ...(type === ElementType.Header && { width: '100%' }),
        }),
        [transformStyle, style, elements, deletedElements]
    );

    const getDraggableClassName = (): string => {
        if (element.type === ElementType.Catalog) return '';
        return `draggable draggable--${element.type.toLowerCase()} ${
            isFocused && allowResizing ? 'resize overflow-hidden' : ''
        } draggable--${isFocused ? 'active' : 'inactive'}`;
    };

    const getElementDropZone = (): IDraggableElement => {
        const elementTopDownFilter = elements?.filter(
            item => item.type !== ElementType.Header && item.type !== ElementType.Footer && !item?.delete
        );
        return elementTopDownFilter?.reduce((element, item) => {
            const elementDownById = document.getElementById(element?.id.toString());
            const itemDownById = document.getElementById(item?.id.toString());

            if (elementDownById && itemDownById) {
                const valueDropDownElement = elementDownById.getBoundingClientRect();
                const valueDropDownItem = itemDownById.getBoundingClientRect();

                return valueDropDownItem?.top + itemDownById.scrollHeight >
                    valueDropDownElement?.top + elementDownById.scrollHeight
                    ? item
                    : element;
            }
            return element;
        }, elementTopDownFilter[ZERO]);
    };

    const getTopFooter = useCallback((): number => {
        const elementDropZone = document.getElementById(DROP_ZONE);
        const elementTopDownById = document.getElementById(getElementDropZone()?.id.toString());
        const uncommonElements = elements.filter(
            item => item.type !== ElementType.Footer && item.type !== ElementType.Header && !item.delete
        );
        if (isMobile && uncommonElements.length) {
            const deletedElementsIds = deletedElements?.flatMap(item => item.id) || [];
            const elementMobile = elements
                ?.filter(
                    item =>
                        item.type !== ElementType.Footer &&
                        item.type !== ElementType.Header &&
                        !deletedElementsIds.includes(item.id)
                )
                ?.reduce((max, obj) => (obj.mobileStyle?.top > max.mobileStyle?.top ? obj : max));

            const topFooterMobile = elementMobile.mobileStyle?.top + elementMobile.mobileStyle?.height;

            return topFooterMobile > DEFAULT_TOP_FOOTER_MOBILE ? topFooterMobile : DEFAULT_TOP_FOOTER_MOBILE;
        }

        if (elementTopDownById && elementDropZone) {
            const valueDropZoneY = elementDropZone.getBoundingClientRect();

            const valueDropTopDown = elementTopDownById.getBoundingClientRect();
            const topFooter =
                valueDropTopDown.y -
                valueDropZoneY.top +
                elementDropZone.scrollTop +
                elementTopDownById.scrollHeight +
                HEADER_HEIGHT;

            return topFooter > DEFAULT_TOP_FOOTER ? topFooter : DEFAULT_TOP_FOOTER;
        }
        return DEFAULT_TOP_FOOTER;
    }, [elements, isMobile, deletedElements]);

    const getContainerStyle = (): IGenericRecord => ({
        ...parentStyle,
        ...resetSize,
        maxHeight: isMobile ? mobileStyle?.height : '',
        minHeight: isMobile ? mobileStyle?.height : style?.minHeight,
        ...((type === ElementType.Carousel || type === ElementType.Catalog) && { width: 'max-content' }),

        top: type === ElementType.Header ? ZERO : type === ElementType.Footer ? getTopFooter() : parentStyle?.top,
    });

    const getLeft = (): string => {
        const { left, width } = style;
        if (left === ZERO) return left;
        const droppableWidth = document.querySelector(`#${DROP_ZONE}`)?.clientWidth ?? 0;
        const elementWidth = Math.round((width * HUNDRED) / droppableWidth);
        const leftInPx = !isNaN(left) ? left : Math.round(left?.slice(ZERO, left.length - 1));
        if (leftInPx <= 0) {
            return '0%';
        }
        return leftInPx > ZERO && elementWidth + leftInPx > HUNDRED ? `${HUNDRED - elementWidth}%` : left;
    };

    return !element?.is_delete ? (
        <div
            ref={containerRef}
            className={getDraggableClassName()}
            style={getContainerStyle()}
            onMouseUp={handleMouseUp}
            onMouseDown={handleSelectedElement}
            id={id}
        >
            <div className="w-full h-full" ref={setNodeRef} {...elementListeners} {...attributes} style={{ padding: 0 }}>
                <Element
                    styleKey={styleKey}
                    data={{ ...element, style: { ...element?.style, opacity: style?.opacity / 100 || 1 } }}
                    handleTextChange={handleTextChange}
                    isMobile={isMobile}
                />
            </div>
        </div>
    ) : null;
};
