import { useState } from 'react';
import { getUnix, currentDateInUnix } from '@utils/Date';
import { IDates } from '@models/Date';

/**
 * This interface describes that properties the useDate hook return
 *
 * @typeParam date: number - Initial date
 * @typeParam changeSingleDate: (value: Date) => void - Function that change the current date
 * @typeParam changeDate: (value: Date, name: string) => void - Function that change the current dates
 * @typeParam dates: IDates - Initial dates
 * @typeParam resetDates: () => void - Function that reset the dates to their initial state
 */
interface IUseDate {
    date: number;
    changeSingleDate: (value: Date) => void;
    changeDate: (value: Date, name: string) => void;
    dates: IDates;
    resetDates: () => void;
}

export const currentDate = currentDateInUnix();

export const dates = {
    start_date: 1,
    finish_date: currentDate,
};

/**
 * Custom hook that save and change dates
 *
 * @returns IUseDate
 */
const useDate = (): IUseDate => {
    const [dates, setDates] = useState<IDates>({
        start_date: currentDate,
        finish_date: currentDate,
    });
    const [date, setDate] = useState<number>(currentDate);

    const changeDate = (value: Date, name: string): void => {
        if (name === 'finish_date' && getUnix(value) < dates.start_date) {
            setDates({
                ...dates,
                ['start_date']: getUnix(value),
                ['finish_date']: getUnix(value),
            });
        } else {
            setDates({
                ...dates,
                [name]: getUnix(value),
            });
        }
    };

    const changeSingleDate = (value: Date): void => setDate(getUnix(value));

    const resetDates = (): void => {
        setDates({ start_date: date, finish_date: date });
    };

    return {
        date,
        dates,
        resetDates,
        changeDate,
        changeSingleDate,
    };
};

export default useDate;
