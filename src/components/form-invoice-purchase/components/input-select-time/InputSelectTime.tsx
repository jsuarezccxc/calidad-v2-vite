import React, { useEffect, useState } from 'react';
import { PM } from '@constants/Calendar';
import usePopper from '@hooks/usePopper';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { TimePicker } from '@components/input';
import { IClickTimePicker } from '@components/table-input';
import { IInputSelectTimeProps } from '@components/form-invoice-purchase';
import { getHourValue, getTimeDate } from '@utils/Date';
import { closeTimePicker, initTimeByTimePicker, ITime } from '@utils/TimePicker';

export const InputSelectTime: React.FC<IInputSelectTimeProps> = ({
    disabled = false,
    label = '',
    timeValue,
    setTimeValue,
    timePicker,
    setTimePicker,
    className = '',
    tooltipInfo = false,
    titleTooltip = '',
    descTooltip = '',
    eventClass = '',
}) => {
    const [time, setTime] = useState<ITime>(initTimeByTimePicker(true));
    const { anchorEl, mouseProps } = usePopper();

    const [clickTimePicker, setClickTimePicker] = useState<IClickTimePicker>({
        hour: false,
        minutes: false,
        seconds: false,
        schedule: false,
    });

    useEffect(() => {
        setTimeValue({
            ...timeValue,
            time_issue: `${getHourValue(
                time.schedule === PM ? Number(getTimeDate(`${time.hour}:00 ${time.schedule} `, undefined, 'HH')) : time.hour || 0
            )}:${getHourValue(time.minutes || 0)}:${getHourValue(time.seconds || 0)}`,
        });
    }, [time]);

    useEffect(() => {
        if (!disabled) {
            closeTimePicker(setTimePicker, eventClass);
            return (): void => {
                closeTimePicker(setTimePicker, eventClass);
            };
        }
    }, []);

    return (
        <div className={`relative flex flex-col w-full mb-5 ml-0 lg:ml-6 lg:w-38 ${className}`}>
            <div className="flex flex-row align-items-center">
                {(tooltipInfo || descTooltip) && (
                    <>
                        <span {...mouseProps}>
                            <Icon
                                alt="Información"
                                name="infoGreen"
                                className={`l-1.5 mb-1 cursor-pointer w-5`}
                                hoverIcon="infoBlue"
                            />
                        </span>
                        <Tooltip
                            placement="bottom-start"
                            anchorEl={anchorEl}
                            iconName="infoBlue"
                            description={descTooltip}
                            title={titleTooltip}
                            wrapperClassName="rounded"
                        />
                    </>
                )}
                <label className="ml-1.5 mb-1 font-allerbold text-blue text-tiny">{label || '*Hora de emisión:'}</label>
            </div>
            <div
                className={`${eventClass} relative flex justify-center h-full p-1 border rounded-md  border-gray timepicker-handler input--container ${
                    disabled ? 'input--disabled' : 'cursor-pointer bg-white'
                }`}
                onClick={(): void => {
                    if (!disabled) setTimePicker(!timePicker);
                }}
            >
                <span className={`${eventClass} relative mr-2 text-sm text-gray-dark timepicker-handler right-1`}>
                    {getHourValue(time.hour || 0)}:{getHourValue(time.minutes || 0)}:{getHourValue(time.seconds || 0)} &nbsp;
                    {time.schedule}
                </span>
                <Icon
                    name="arrowDownGray"
                    className={`${eventClass} transition w-5.5 h-5.5 duration-200 transform cursor-pointer timepicker-handler absolute right-0 ${
                        timePicker || !disabled ? 'rotate-180' : 'rotate-0'
                    }`}
                />
            </div>
            <TimePicker
                showSeconds
                time={time}
                clickTimePicker={clickTimePicker}
                setTime={setTime}
                setTimePicker={setTimePicker}
                setClickTimePicker={setClickTimePicker}
                className={`z-1 transition duration-200 absolute mt-16 -right-14 xs:-right-0 ${
                    !timePicker || disabled ? 'hidden' : 'block'
                }`}
                eventClass={eventClass}
            />
        </div>
    );
};
