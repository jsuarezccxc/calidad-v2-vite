import React, { DragEvent, TouchEvent, useContext } from 'react';
import { ElementsContext } from '../../context';
import { ELEMENT, IDraggableTabProps, SCROLL_SETTING_VALUE, TOTAL_PERCENTAGE, WIDTH_SETTING_VALUE, ZERO } from '.';

export const DraggableTab: React.FC<IDraggableTabProps> = ({ children, element }) => {
    const { addElement } = useContext(ElementsContext);

    const dragElement = (e: DragEvent<HTMLParagraphElement>): void => {
        e.dataTransfer.setData(ELEMENT, JSON.stringify(element));
    };

    const dragTouchTab = (e: TouchEvent<HTMLDivElement>): void => {
        const elementDropZone = document.getElementById('drop-zone');
        const elementHeader = document.getElementById('header-component');

        const touchEnd = e.changedTouches[ZERO];
        if (elementDropZone && elementHeader) {
            const percentage =
                (TOTAL_PERCENTAGE / elementDropZone?.offsetWidth) * Math.round(touchEnd?.clientX - WIDTH_SETTING_VALUE);
            const valueDropZoneY = elementDropZone.getBoundingClientRect();

            const relativeTop = touchEnd.clientY - valueDropZoneY.top + elementDropZone.scrollTop;

            if (touchEnd?.clientX < elementDropZone.offsetWidth) {
                const topComponent =
                    relativeTop < elementHeader.offsetHeight ? elementHeader.offsetHeight : relativeTop || SCROLL_SETTING_VALUE;

                addElement({
                    ...element,
                    style: {
                        ...element.style,
                        top: topComponent,
                        left: `${percentage}%`,
                    },
                });
            }
        }
    };

    return (
        <div
            className="relative flex items-center justify-center w-full h-full"
            draggable
            onDragStart={dragElement}
            onTouchEnd={dragTouchTab}
        >
            {children}
        </div>
    );
};
