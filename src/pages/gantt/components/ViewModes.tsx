import React from 'react';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { VIEW_MODES, IViewModesProps } from '.';

export const ViewModes: React.FC<IViewModesProps> = ({ viewMode, setViewMode }) => (
    <div className="hidden h-10 text-white cursor-pointer xl:flex">
        {VIEW_MODES.map(({ key, value }) => (
            <p
                id={generateId({
                    module: ModuleApp.GANTT,
                    submodule: `task-view-mode-${key}`,
                    action: ActionElementType.ADD,
                    elementType: ElementType.BTN,
                })}
                key={key}
                className={`gantt__view-mode ${key === viewMode ? 'gantt__active-view' : ''}`}
                onClick={(): void => setViewMode(key)}
            >
                {value}
            </p>
        ))}
    </div>
);
