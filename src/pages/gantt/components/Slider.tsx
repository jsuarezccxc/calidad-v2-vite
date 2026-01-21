import React from 'react';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { SliderWrapper, ISliderProps } from '.';

export const Slider: React.FC<ISliderProps> = ({ task, setTask, disabled = false }) => {
    return (
        <div
            id={generateId({
                module: ModuleApp.GANTT,
                submodule: `task-form-progress`,
                action: ActionElementType.INPUT,
                elementType: ElementType.TXT,
            })}
        >
            <label className="ml-1.5 mb-1 font-allerbold text-blue text-tiny">Progreso:</label>
            <div className="gantt__slider-container">
                <label className="text-sm font-allerbold text-blue">0%</label>
                <SliderWrapper className="relative flex-1" progress={task.progress}>
                    <input
                        disabled={disabled}
                        type="range"
                        max="100"
                        className="gantt__input-range"
                        name="progress"
                        value={task.progress}
                        onChange={({ target }): void => setTask({ ...task, [target.name]: target.value })}
                        style={{ backgroundSize: `${task.progress}%` }}
                    />
                    <div className="gantt__slider-marker">
                        <span className="gantt__slider-value">{task.progress}</span>
                    </div>
                </SliderWrapper>
                <label className="text-sm font-allerbold text-blue">100%</label>
            </div>
        </div>
    );
};
