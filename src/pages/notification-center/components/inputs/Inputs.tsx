import React from 'react';
import { DatePickerDayInput, SearchInput } from '@components/input';
import { Form } from '@components/form';
import { IInputsProps } from '..';

export const Inputs: React.FC<IInputsProps> = ({ data = [], translate }) => {
    const [date, search] = data;

    return (
        <Form className="mb-4">
            <div className="flex flex-wrap items-center gap-6 xs:gap-4">
                <DatePickerDayInput {...date} labelText={`${translate('fields.date')}:`} />
                <SearchInput {...search} labelText={`${translate('fields.search')}:`} />
            </div>
        </Form>
    );
};
