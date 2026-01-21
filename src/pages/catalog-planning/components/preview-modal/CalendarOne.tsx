import React, { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Icon, IconsNames } from '@components/icon';
import { DatePickerDayInput, SelectInput, TextArea, TextInput } from '@components/input';
import { Checkbox } from '@components/checkbox';
import { Button, Link, LinkColor } from '@components/button';
import usePermissions from '@hooks/usePermissions';
import { ICalendarOneProps } from '.';

export const CalendarOne: React.FC<ICalendarOneProps> = ({ params = {}, styles = {} }) => {
    const { disabledInputs } = usePermissions();
    const [isActive, setActive] = useState<boolean>(false);
    const { title = '', description = '' } = params;

    const iconList = (): string => (isActive ? 'arrowUpWhite' : 'arrowDownWhite');

    const parseObservations = (): string => {
        let counter = 0;
        return description
            .split('')
            .map((item: string) => {
                if (!counter && item === '>') {
                    counter = 1;
                    return `> *`;
                }
                return item;
            })
            .join('');
    };

    return (
        <div className="relative w-full py-10 mb-4.5 mt-4.5 bg-white rounded-lg shadow-templateDesign">
            <div className="flex flex-col items-center justify-center">
                <div
                    onClick={(): void => setActive(!isActive)}
                    style={{
                        background: styles.secondaryColor,
                    }}
                    className={`w-full  items-center justify-center flex  cursor-pointer show-submenu ${
                        isActive ? 'h-13.75' : 'h-28.3'
                    }`}
                >
                    <h2 className="px-4 text-xl leading-6 text-center text-white border-b font-aller">{title}</h2>
                    <Icon
                        name={iconList() as IconsNames}
                        className={`transition duration-200 transform cursor-pointer timepicker-handler`}
                    />
                </div>
                <div
                    className={`w-full ${
                        isActive ? 'show-submenu' : 'hide-submenu'
                    } px-7 items-center justify-center flex flex-col`}
                >
                    <div className="flex flex-col xs:w-full mt-8.4">
                        <div className="flex flex-row xs:flex-col">
                            <TextInput
                                labelText="*Nombre:"
                                classesWrapper="mr-4.5 xs:mr-0 w-35 xs:w-full"
                                onChange={(): void => {}}
                                value={''}
                                placeholder=""
                                disabled={disabledInputs}
                            />
                            <TextInput
                                labelText="*Apellido:"
                                classesWrapper="mr-4.5 xs:mr-0 w-35 xs:w-full"
                                onChange={(): void => {}}
                                value={''}
                                placeholder=""
                                disabled={disabledInputs}
                            />
                            <TextInput
                                labelText="*Correo electrónico:"
                                classesWrapper="mr-4.5 xs:mr-0 w-35 xs:w-full  "
                                onChange={(): void => {}}
                                value={''}
                                placeholder=""
                                disabled={disabledInputs}
                                limitCharacters={false}
                            />
                            <TextInput
                                labelText="Teléfono de contacto:"
                                classesWrapper="w-35 xs:w-full"
                                onChange={(): void => {}}
                                value={''}
                                placeholder=""
                                disabled={disabledInputs}
                            />
                        </div>
                    </div>
                    <div className="flex xs:w-full flex-row xs:flex-col mt-4.5">
                        <SelectInput
                            name="product"
                            labelText="Tipo de cita:"
                            options={[]}
                            classesWrapper="mr-4.5 xs:mr-0 w-35 xs:w-full"
                            disabled={disabledInputs}
                        />
                        <SelectInput
                            name="product"
                            labelText="Nombre de la cita:"
                            options={[]}
                            classesWrapper="mr-4.5 xs:mr-0 w-35 xs:w-full"
                            disabled={disabledInputs}
                        />
                        <SelectInput
                            name="product"
                            labelText="Sede:"
                            options={[]}
                            classesWrapper="mr-4.5 xs:mr-0 w-35 xs:w-full"
                            disabled={disabledInputs}
                        />
                        <SelectInput name="product" labelText="Duración:" options={[]} disabled classesWrapper="w-35 xs:w-full" />
                    </div>
                    <div className="flex flex-col items-center justify-center flex-start w-153.5 xs:w-full">
                        <h1 className="text-lg w-full text-left mt-8.4">Horarios</h1>
                        <div className="flex flex-row xs:flex-col ">
                            <DatePickerDayInput
                                name="date"
                                maxDate={new Date()}
                                selected={null}
                                labelText="*Fecha:"
                                classesWrapper="mr-4.5 xs:mr-0 w-35 xs:w-full"
                                onChangeDate={(): void => {}}
                                disabled={disabledInputs}
                            />
                            <SelectInput
                                name="product"
                                labelText="*Hora:"
                                options={[]}
                                disabled
                                classesWrapper="mr-4.5 xs:mr-0 w-35 xs:w-full"
                            />
                            <div className="w-35 mr-4.5 xs:hidden"></div>
                            <div className="w-35 xs:hidden"></div>
                        </div>
                        {description && (
                            <RichText
                                className="w-full mt-2 text-left break-words section-description xs:text-center"
                                text={parseObservations()}
                            />
                        )}
                        <h1 className="text-lg w-full text-left mt-4.5">Nota:</h1>
                    </div>
                    <TextArea
                        disabled={disabledInputs}
                        placeholder="Agregue una nota"
                        classesWrapper="w-153.5 xs:w-full"
                        classesInput="h-12"
                    />
                    <div className="justify-center m-auto align-middle">
                        <div className="items-center mt-4.5 flex">
                            <Checkbox
                                classLabel="text-gray-dark"
                                label=""
                                checked={false}
                                classContainer="w-2"
                                classBox="ml-7"
                                onChange={(): void => {}}
                                disabled={disabledInputs}
                            />
                            <p className="text-xntiny">
                                He leído y acepto el tratamiento de mis datos personales de acuerdo a la
                                <Link
                                    text="Política de Privacidad y Tratamiento de Datos."
                                    linkColor={LinkColor.PURPLE}
                                    href={'/electronic-invoice-instructions'}
                                    classes="ml-1 text-xntiny"
                                />
                            </p>
                        </div>
                        <div className="flex items-center mt-2">
                            <Checkbox
                                classLabel="text-gray-dark"
                                label=""
                                checked={false}
                                classContainer="w-2"
                                classBox="ml-7"
                                onChange={(): void => {}}
                                disabled={disabledInputs}
                            />
                            <p className="text-xntiny">
                                He leído y acepto los
                                <Link
                                    text="Términos y condiciones"
                                    linkColor={LinkColor.PURPLE}
                                    href={'/electronic-invoice-instructions'}
                                    classes="ml-1 text-xntiny"
                                />{' '}
                                de la plataforma
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button disabled={disabledInputs} text="Reservar" classes={'m-auto mt-8.4'} onClick={(): void => {}} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const RichText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
    return text ? <section className={className}>{ReactHtmlParser(text)}</section> : null;
};
