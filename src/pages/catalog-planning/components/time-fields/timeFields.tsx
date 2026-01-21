import React, { useState } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { TimePicker } from '@components/input';
import { Icon } from '@components/icon';
import { getHourValue } from '@utils/Date';
import { getTime } from '@utils/TimePicker';
import { ONE } from '@constants/Numbers';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

export const TimeFields: React.FC<IGenericRecord> = ({
    storeTime,
    setStoreTime,
    storeTimeSecond,
    setStoreTimeSecond,
    validate,
    disabled = false,
}) => {
    const [clickTimePicker, setClickTimePicker] = useState({ hour: false, minutes: false, schedule: false });
    const times = getTime(storeTime, setStoreTime);
    const [timePicker, setTimePicker] = useState<boolean>(false);

    const [timePicker2, setTimePicker2] = useState<boolean>(false);
    const times2 = getTime(storeTimeSecond, setStoreTimeSecond);
    const [clickTimePicker2, setClickTimePicker2] = useState({ hour: false, minutes: false, schedule: false });

    const onlyOpenCurrentTimeInput = (type?: number): void => {
        if (!disabled) {
            setTimePicker(type === ONE ? !timePicker : false);
            setTimePicker2(type === ONE ? false : !timePicker2);
        }
    };

    return (
        <div className="flex justify-center xs:flex-col">
            <div className="relative flex flex-col input-style xs:w-full w-45 my-4.5">
                <label className="ml-1.5 mb-1 font-allerbold text-tiny text-blue">*Hora inicial:</label>
                <div
                    className={`relative flex justify-start h-full p-1 border cursor-pointer rounded-md  ${
                        validate ? 'border-purple' : 'border'
                    }`}
                    onClick={(): void => onlyOpenCurrentTimeInput(ONE)}
                >
                    <span className="relative mr-2 text-sm border-purple text-gray-dark timepicker-handler">
                        {getHourValue(times.time.hour)}:{getHourValue(times.time.minutes)} {times?.time?.schedule}
                    </span>
                    <Icon
                        name="arrowDownGray"
                        className={`transition duration-200 transform cursor-pointer timepicker-handler absolute right-0 ${
                            timePicker ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                </div>
                <TimePicker
                    id={generateId({
                        module: ModuleApp.PLANNING_AND_ORGANIZATION,
                        submodule: `${ModuleApp.MODALS}-event-initial-time`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    className={`transition absolute duration-200 mt-14 w-40 ${!timePicker ? 'hidden' : 'block'} z-50`}
                    time={times.time}
                    setTime={times?.setTime || ((): void => {})}
                    setClickTimePicker={setClickTimePicker}
                    setTimePicker={setTimePicker}
                    clickTimePicker={clickTimePicker}
                />
            </div>
            <div className="relative flex flex-col input-style w-45 xs:w-full xs:ml-0 my-4.5 ml-10">
                <label className="ml-1.5 mb-1 font-allerbold text-tiny text-blue">Hora final:</label>
                <div
                    className={`relative flex justify-start  p-1 border cursor-pointer rounded-md timepicker-handler2 ${
                        validate ? 'border-purple' : 'border'
                    }`}
                    onClick={(): void => onlyOpenCurrentTimeInput()}
                >
                    <span className="relative mr-2 text-sm text-gray-dark timepicker-handler2">
                        {getHourValue(times2.time.hour)}:{getHourValue(times2.time.minutes)} {times2?.time?.schedule}
                    </span>
                    <Icon
                        name="arrowDownGray"
                        className={`transition duration-200 transform cursor-pointer timepicker-handler2 absolute right-0 ${
                            timePicker2 ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                </div>
                <TimePicker
                    id={generateId({
                        module: ModuleApp.PLANNING_AND_ORGANIZATION,
                        submodule: `${ModuleApp.MODALS}-event-finish-time`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    className={`transition duration-200 absolute mt-14 w-40  ${!timePicker2 ? 'hidden' : 'block'} z-50`}
                    time={times2.time}
                    setTime={times2?.setTime || ((): void => {})}
                    setClickTimePicker={setClickTimePicker2}
                    setTimePicker={setTimePicker2}
                    clickTimePicker={clickTimePicker2}
                />
            </div>
        </div>
    );
};
