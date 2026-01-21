import React from 'react';
import { TitleButtons } from '@constants/Buttons';
import { REQUIRED_FIELD, VALIDATE_EMAIL_FORMAT } from '@constants/FieldsValidation';
import { MaxLengthFields, TEN } from '@constants/ElectronicInvoice';
import { IRequiredProps } from '@models/EditUser';
import { IConsultClientResponse } from '@models/ImportClient';
import { validateEmail } from '@utils/Validation';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Form } from '@components/form';
import { Button } from '@components/button';
import { SelectInput, TextInput } from '@components/input';
import { Icon } from '@components/icon';
import { IConsultClientProps, IErrorProps, IImportClientProps, IWarningProps } from '.';
import './ContentModal.scss';

export const ConsultClient: React.FC<IConsultClientProps> = ({
    fieldValue,
    handleText,
    handleSelect,
    options,
    isSubmit,
    onClickLeft,
    onClickRight,
}) => {
    return (
        <article className="content-modal__content">
            <section className="content-modal__content-information">
                <h3>Consultar cliente DIAN</h3>
                <p>
                    Ingrese la información del cliente
                    <span className="font-allerbold">(Tipo de documento y Número de documento)</span> para realizar la consulta
                    ante la DIAN.
                </p>
            </section>
            <Form className="content-modal__form">
                <SelectInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-consult-client-document-type`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    required={isSubmit && !fieldValue.document_type}
                    classesWrapper="content-modal__form__input"
                    value={fieldValue.document_type_name}
                    labelText="*Tipo de documento:"
                    selectIconType="arrowDownGreen"
                    optionSelected={handleSelect}
                    name="document_type"
                    options={options}
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-consult-client-document-number`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    required={isSubmit && !fieldValue.document_number}
                    classesWrapper="content-modal__form__input"
                    value={fieldValue.document_number}
                    labelText="*Número de documento:"
                    name="document_number"
                    onChange={handleText}
                    placeholder="..."
                    maxLength={TEN}
                    onlyNumbers
                />
            </Form>
            <section className="content-modal__content-button">
                <Button
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-consult-client`,
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.BTN,
                    })}
                    text={TitleButtons.CLOSE}
                    onClick={onClickLeft}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-consult-client`,
                        action: ActionElementType.SEARCH,
                        elementType: ElementType.BTN,
                    })}
                    text={TitleButtons.SEARCH}
                    onClick={onClickRight}
                />
            </section>
        </article>
    );
};

export const Error: React.FC<IErrorProps> = ({ onClick }) => {
    return (
        <article className="content-modal__content">
            <section className="content-modal__content-information">
                <Icon name="warning" className="content-modal__content-information__icon" />
                <h3>Información cliente</h3>
                <p>
                    En este momento no es posible acceder a la base de datos de los adquirentes/compradores, para seguir agregando
                    el cliente haga clic en el botón de <span className="font-allerbold">Aceptar.</span>
                </p>
            </section>
            <section className="content-modal__content-button">
                <Button
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-error`,
                        action: ActionElementType.ACCEPT,
                        elementType: ElementType.BTN,
                    })}
                    text={TitleButtons.ACCEPT}
                    onClick={onClick}
                />
            </section>
        </article>
    );
};

export const Warning: React.FC<IWarningProps> = ({ onClickLeft, onClickRight }) => {
    return (
        <article className="content-modal__content">
            <section className="content-modal__content-information">
                <Icon name="warning" className="content-modal__content-information__icon" />
                <h3>Información cliente</h3>
                <p>
                    El cliente ya existe en su base de datos, si desea editar la información haga clic en el botón &nbsp;
                    <span className="font-allerbold">Editar</span> de lo contrario haga clic en el botón &nbsp;
                    <span className="font-allerbold">Aceptar.</span>
                </p>
            </section>
            <section className="content-modal__content-button">
                <Button
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-warning`,
                        action: ActionElementType.EDIT,
                        elementType: ElementType.BTN,
                    })}
                    text="Editar"
                    onClick={onClickLeft}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-warning`,
                        action: ActionElementType.ACCEPT,
                        elementType: ElementType.BTN,
                    })}
                    text={TitleButtons.ACCEPT}
                    onClick={onClickRight}
                />
            </section>
        </article>
    );
};

export const ImportClient: React.FC<IImportClientProps> = ({ fieldValue, handleText, onClickLeft, onClickRight, isSubmit }) => {
    const validationEmail = ({ email }: IConsultClientResponse): IRequiredProps => {
        const isValidEmail = isSubmit && !!email && !validateEmail(email);
        return {
            required: (isSubmit && !email) || isValidEmail,
            requiredText: isValidEmail ? VALIDATE_EMAIL_FORMAT : REQUIRED_FIELD,
        };
    };

    return (
        <article className="content-modal__content">
            <section className="content-modal__content-information">
                <h3>Importar cliente</h3>
                <p>
                    Edite la información en caso de requerirlo. Haga clic en el botón &nbsp;
                    <span className="font-allerbold">Importar</span> si desea agregar la información del cliente a la base de
                    datos, de lo contrario haga clic en el botón <span className="font-allerbold">Cerrar.</span>
                </p>
            </section>
            <Form className="content-modal__form">
                <TextInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-import-client-name`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    classesWrapper="content-modal__form__input"
                    required={isSubmit && !fieldValue.name}
                    maxLength={MaxLengthFields.Name}
                    labelText="*Nombre del cliente:"
                    value={fieldValue.name}
                    onChange={handleText}
                    placeholder="..."
                    name="name"
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-import-client-email`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    classesWrapper="content-modal__form__input"
                    {...validationEmail(fieldValue)}
                    labelText="*Correo electronico:"
                    value={fieldValue.email}
                    onChange={handleText}
                    placeholder="..."
                    name="email"
                    type="email"
                />
            </Form>
            <section className="content-modal__content-button">
                <Button
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-import-client`,
                        action: ActionElementType.CLOSE,
                        elementType: ElementType.BTN,
                    })}
                    text={TitleButtons.CLOSE}
                    onClick={onClickLeft}
                />
                <Button
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `${ModuleApp.ELECTRONIC_INVOICE}-${ModuleApp.MODALS}-import-client`,
                        action: ActionElementType.ACTION,
                        elementType: ElementType.BTN,
                    })}
                    text="Importar"
                    onClick={onClickRight}
                />
            </section>
        </article>
    );
};
