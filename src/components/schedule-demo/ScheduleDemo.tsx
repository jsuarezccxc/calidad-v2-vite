import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import dayjs from '@utils/Dayjs';
import { IData } from '@models/ScheduleDemo';
import { setDailySchedules } from '@redux/calendar/actions';
import { getPrefixNumber } from '@redux/notifications/actions';
import { ContactForm, DATE_FORMAT_SCHEDULING, ScheduleSteps, Scheduling } from './components';
import { DEFAULT_DATA, STEPS } from '.';
import './ScheduleDemo.scss';

export const ScheduleDemo: React.FC<{ toggleScheduling: (status: boolean) => void }> = ({ toggleScheduling }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const updatedDataEdit = {
        ...DEFAULT_DATA,
        date: dayjs().format(DATE_FORMAT_SCHEDULING),
    };

    const [data, setData] = useState<IData>(updatedDataEdit);

    const [currentStep, setCurrentStep] = useState<number>(STEPS.DATE_HOUR);

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([dispatch(getPrefixNumber()), dispatch(setDailySchedules([]))]);
        })();
    }, []);

    const toggleCalendar = (): void => {
        setCurrentStep(prevStep => (prevStep === STEPS.DATE_HOUR ? STEPS.FORM_CONTACT : STEPS.DATE_HOUR));
        if (currentStep === STEPS.FORM_CONTACT) {
            const updatedDataEdit = {
                ...DEFAULT_DATA,
                date: dayjs().format(DATE_FORMAT_SCHEDULING),
            };
            updateData(updatedDataEdit);
        }
    };

    const updateData = (data: IData): void => setData(data);

    const goBack = (): void => {
        history.push('/');
        toggleScheduling(false);
    };

    return (
        <div className="schedule-demo">
            <ScheduleSteps currentStep={currentStep} />
            {currentStep === 0 ? (
                <Scheduling data={data} toggleCalendar={toggleCalendar} updateData={updateData} goBack={goBack} />
            ) : (
                <ContactForm
                    data={data}
                    toggleScheduling={toggleScheduling}
                    updateData={updateData}
                    toggleCalendar={toggleCalendar}
                />
            )}
        </div>
    );
};
