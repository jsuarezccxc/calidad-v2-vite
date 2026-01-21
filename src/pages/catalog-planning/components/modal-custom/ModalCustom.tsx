import React, { useEffect, useState } from 'react';
import { Button } from '@components/button';
import { getTimeIssue } from '@components/electronic-note';
import { ModalCustom } from '@components/modal-custom';
import { IGenericRecord } from '@models/GenericRecord';
import { compareHours } from '@pages/calendar';
import { postCompanyWorkHourAction } from '@redux/calendar/actions';
import { INITIAL_HOUR, ITime, convertTime } from '@utils/TimePicker';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { TimeFields } from '../time-fields/timeFields';

export const ModalCustomHour: React.FC<IGenericRecord> = ({ showModal, toggleModal, dispatch, editHourState }) => {
    const [storeTime, setStoreTime] = useState<ITime>(INITIAL_HOUR);
    const [storeTimeSecond, setStoreTimeSecond] = useState<ITime>(INITIAL_HOUR);
    const [validate, setValidate] = useState<boolean>(false);
    const timeInput = getTimeIssue(storeTime, 'HH:mm');
    const timeSecond = getTimeIssue(storeTimeSecond, 'HH:mm');

    useEffect(() => {
        if (editHourState) {
            const startTime = convertTime(editHourState?.start_time);
            setStoreTime({
                hour: startTime?.hours12,
                minutes: startTime?.minutes,
                schedule: startTime?.amPm,
            });
            const endTime = convertTime(editHourState?.end_time);
            setStoreTimeSecond({
                hour: endTime?.hours12,
                minutes: endTime?.minutes,
                schedule: endTime?.amPm,
            });
        }
    }, [editHourState]);

    const onSubmitAWorkHours = async (): Promise<void> => {
        if (!compareHours(storeTime, storeTimeSecond)) return setValidate(true);
        const data: IGenericRecord[] = [];
        if (editHourState?.id) {
            data.push({
                id: editHourState?.id,
                start_time: timeInput,
                end_time: timeSecond,
            });
        } else {
            data.push({
                start_time: timeInput,
                end_time: timeSecond,
            });
        }
        await dispatch(postCompanyWorkHourAction(data));
        setValidate(false);
        toggleModal(false);
    };

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.CALENDAR_PLANNING,
                submodule: `${ModuleApp.MODALS}-hour-edit-add`,
                action: ActionElementType.INPUT,
                elementType: ElementType.MDL,
            })}
            show={showModal}
            showModal={toggleModal}
            classesWrapper="modal--full"
            classesModal="modal--full"
            classAdditional="z-50"
        >
            <div className="calendar__modal-content">
                <h3 className="m-auto text-xl text-center w-45 text-blue font-allerbold">
                    {editHourState?.id ? 'Editar' : 'Agregar'} Hora
                </h3>
                <TimeFields
                    storeTime={storeTime}
                    setStoreTime={setStoreTime}
                    storeTimeSecond={storeTimeSecond}
                    setStoreTimeSecond={setStoreTimeSecond}
                    validate={validate && !compareHours(storeTime, storeTimeSecond)}
                />
                {validate && !compareHours(storeTime, storeTimeSecond) && (
                    <label className="text-tiny text-purple mr-1.5 text-right leading-xtiny mt-1 mb-1">
                        *La hora de fin debe ser como minimo 1 hora mayor a la inicial.
                    </label>
                )}
                <div className="flex justify-center gap-7">
                    <Button
                        id={generateId({
                            module: ModuleApp.CALENDAR_PLANNING,
                            submodule: `${ModuleApp.MODALS}-hour-edit-add`,
                            action: ActionElementType.BACK,
                            elementType: ElementType.BTN,
                        })}
                        text="Atrás"
                        onClick={(): void => toggleModal(false)}
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.CALENDAR_PLANNING,
                            submodule: `${ModuleApp.MODALS}-hour-edit-add`,
                            action: ActionElementType.SAVE,
                            elementType: ElementType.BTN,
                        })}
                        text="Guardar"
                        onClick={(): Promise<void> => onSubmitAWorkHours()}
                    />
                </div>
            </div>
        </ModalCustom>
    );
};
