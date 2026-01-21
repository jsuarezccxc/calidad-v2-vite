import React, { useContext, useEffect, useState } from 'react';
import { lengthGreaterThanZero } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Icon } from '../element-editor/basic-editor';
import { ElementsContext } from '../../context';

export const ActionButtons: React.FC = () => {
    const { updateElements, copyElements, selectElement } = useContext(ElementsContext);
    const [copyElementPosition, setCopyElementPosition] = useState<number>(0);

    useEffect(() => {
        setCopyElementPosition(lengthGreaterThanZero(copyElements) ? copyElements?.length : 0);
    }, [copyElements]);

    const undoChanges = (): void => {
        const realPosition = copyElementPosition - 1;
        if (realPosition > 0) {
            selectElement(null);
            updateElements(copyElements[realPosition - 1], true);
            setCopyElementPosition(realPosition);
        }
    };

    const redoChanges = (): void => {
        const realPosition = copyElementPosition + 1;
        if (realPosition <= copyElements.length) {
            updateElements(copyElements[realPosition - 1], true);
            setCopyElementPosition(realPosition);
        }
    };

    return (
        <div className="work-space__arrows">
            <button
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-workspace-undo`,
                    action: ActionElementType.CHANGE,
                    elementType: ElementType.BTN,
                })}
                className="work-space__arrow-button"
                onClick={undoChanges}
            >
                <Icon
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-action-workspace-undo`,
                        action: ActionElementType.CHANGE,
                        elementType: ElementType.ICO,
                    })}
                    name="arrowLeftCurvedBlue"
                    className="w-4.5 h-2 cursor-pointer"
                />
            </button>
            <button
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-workspace-redo`,
                    action: ActionElementType.CHANGE,
                    elementType: ElementType.BTN,
                })}
                className="work-space__arrow-button"
                onClick={redoChanges}
            >
                <Icon
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-action-workspace-redo`,
                        action: ActionElementType.CHANGE,
                        elementType: ElementType.ICO,
                    })}
                    name="arrowRightCurvedBlue"
                    className="w-4.5 h-2 cursor-pointer"
                />
            </button>
        </div>
    );
};
