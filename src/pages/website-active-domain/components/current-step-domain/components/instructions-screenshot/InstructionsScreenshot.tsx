import React from 'react';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { IInstructionScreenshotProps } from '.';
import './InstructionsScreenshot.scss';

export const InstructionsScreenshot: React.FC<IInstructionScreenshotProps> = ({ descriptionStep, screenshots }) => {
    return (
        <div className="instructions-screenshot">
            <label className="instruction--text">{descriptionStep}</label>
            <div className="container__screenshots">
                {screenshots?.map((screenshot, index) => (
                    <div
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `screenshot-${index}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.CRD,
                        })}
                        key={`screenshot-${index}`}
                        className="screenshot"
                        style={{ backgroundImage: `url(${screenshot.image})`, height: `${screenshot.height}px` }}
                    />
                ))}
            </div>
        </div>
    );
};
