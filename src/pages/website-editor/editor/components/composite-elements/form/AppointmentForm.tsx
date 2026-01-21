import React from 'react';
import { Input } from '../components';
import { DatePickerDayInput, SelectInput } from '@components/input';
import { DATE_FIELDS, FIELDS } from '.';

export const AppointmentForm: React.FC<{ buttonText: string; isMobile: boolean }> = ({ buttonText = 'Reservar', isMobile }) => {
    return (
        <>
            <div className={`grid grid-cols-${isMobile ? '1' : '4'} gap-7`}>
                {FIELDS.map((field, index) =>
                    field.select ? (
                        <SelectInput
                            key={index}
                            classesLabel="input__label"
                            classesWrapper="form__date-picker"
                            disabled
                            {...field}
                        />
                    ) : (
                        <Input key={index} disabled {...field} />
                    )
                )}
            </div>
            <h2 className="form--five__title">Horarios</h2>
            <div className={`flex gap-4.5 ${isMobile ? 'flex-col' : ''}`}>
                {DATE_FIELDS.map(date =>
                    date?.date ? (
                        <DatePickerDayInput
                            showPlaceHolderDate
                            {...date}
                            key={date.labelText}
                            classesLabel="input__label"
                            classesWrapper="form__date-picker"
                            disabled
                        />
                    ) : (
                        <SelectInput
                            {...date}
                            key={date.labelText}
                            classesWrapper="form__date-picker"
                            classesLabel="input__label"
                            disabled
                        />
                    )
                )}
            </div>
            <small className="form--five__information">* Si desea reagendar su cita por favor comuníquese al 32451516516.</small>
            <Input
                disabled
                wrapperClassName={`note-input ${isMobile ? 'note-input__mobile' : ''}`}
                inputClassName="rounded-none"
                labelText="Nota"
                placeholder="Agregue una nota"
            />
            <div className="mt-4.5 form--five__terms">
                <span className="form__checkbox" />
                <p className="text-left text-tiny">
                    He leído y acepto el tratamiento de mis datos personales de acuerdo a la &nbsp;
                    <span className="underline text-purple">Política de Privacidad y Tratamiento de Datos</span>
                </p>
            </div>
            <div className="mt-2 form--five__terms mb-7">
                <span className="form__checkbox" />
                <p className="text-left text-tiny">
                    He leído y acepto los &nbsp;
                    <span className="underline text-purple">Términos y condiciones </span>de la plataforma
                </p>
            </div>
            <button className="form__button">{buttonText}</button>
        </>
    );
};
