import React from 'react';
import { useSelector } from 'react-redux';
import { ChangeEvent } from '@components/input';
import { RootState } from '@redux/rootReducer';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { IHoursProps } from '.';

export const Hours: React.FC<IHoursProps> = ({ data, scheduleDemo, updateData, validate, goBack }) => {
    const { dailySchedules = [] } = useSelector(({ calendar }: RootState) => calendar);

    const handlingTimeChange = ({ target: { value } }: ChangeEvent): void => updateData({ ...data, hour: value });

    return (
        <form className="hours">
            <div className="hours__items">
                {dailySchedules.map((hour: string) => {
                    const id = generateId({
                        module: ModuleApp.LANDING,
                        submodule: `schedule-calendar-hour-${hour}-select-hour`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    });

                    return (
                        <fieldset className="hours__item" key={hour}>
                            <input
                                id={id}
                                type="radio"
                                name="hour"
                                value={hour}
                                className="hours__option"
                                onChange={handlingTimeChange}
                            />
                            <label htmlFor={id} className="hours__value">
                                {hour}
                            </label>
                        </fieldset>
                    );
                })}
            </div>
            {!dailySchedules?.length && (
                <>
                    <p
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `schedule-calendar-hour-title-no-available-select-hour`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        className="block mb-1 text-gray-dark hours__size4K"
                    >
                        No hay reuniones disponibles.
                    </p>
                    <p
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `schedule-calendar-hour-subtitle-no-available-select-hour`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TXT,
                        })}
                        className="text-gray-dark hours__size4K"
                    >
                        Selecciona otra fecha.
                    </p>
                </>
            )}
            {validate && (
                <span
                    id={generateId({
                        module: ModuleApp.LANDING,
                        submodule: `schedule-calendar-hour-title-available`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TXT,
                    })}
                    className="hours__error"
                >
                    *Seleccione una hora para agendar
                </span>
            )}
            {!!dailySchedules?.length && (
                <div className="hours__container-buttons">
                    <button
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `schedule-calendar-back-hours`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        className="hours__button-back"
                        type="button"
                        onClick={goBack}
                    >
                        Atrás
                    </button>
                    <button
                        id={generateId({
                            module: ModuleApp.LANDING,
                            submodule: `schedule-calendar-submit-hours`,
                            action: ActionElementType.SUBMIT,
                            elementType: ElementType.BTN,
                        })}
                        className="hours__button"
                        onClick={scheduleDemo}
                    >
                        Agendar
                    </button>
                </div>
            )}
        </form>
    );
};
