import React from 'react';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
const steps = ['Seleccione fecha y hora', 'Información de contacto'];

interface IScheduleStepsProps {
    currentStep: number;
}

export const ScheduleSteps: React.FC<IScheduleStepsProps> = ({ currentStep }) => {
    return (
        <div className="custom-schedule-steps">
            <h2
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'schedule-title',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="custom-schedule-steps__title"
            >
                Agendar demostración
            </h2>
            <p
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'schedule-subtitle',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="custom-schedule-steps__subtitle"
            >
                Agende <span className="font-poppinssemibold">una reunión virtual de 1 hora con un experto.</span>
            </p>
            <div className="custom-stepper">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div
                            id={generateId({
                                module: ModuleApp.LANDING,
                                submodule: `schedule-step-${step}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            className={`step ${currentStep === index ? 'active' : ''} ${currentStep > index ? 'completed' : ''}`}
                        >
                            <div className="step-circle">{index + 1}</div>
                            <div className="step-label">{step}</div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`step-connector ${currentStep > index ? 'completed' : ''}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
