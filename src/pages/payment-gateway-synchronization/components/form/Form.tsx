import React from 'react';
import { TitleButtons } from '@constants/Buttons';
import { Form } from '@components/form';
import { Button } from '@components/button';
import { TextInput } from '@components/input';
import { IFormWompiProps, MAX_LENGTH_FIELD } from '.';
import './Form.scss';

export const FormWompi: React.FC<IFormWompiProps> = ({
    fieldValues: { event, integrity, priv_key, pub_key },
    isSubmit,
    handleText,
    ...props
}) => {
    return (
        <Form className="form-wompi">
            <fieldset className="form-wompi__group-input">
                <section className="form-wompi__group-input--border-green">
                    <TextInput
                        name="pub_key"
                        value={pub_key}
                        placeholder="..."
                        onChange={handleText}
                        labelText="*Llave pública"
                        required={isSubmit && !pub_key}
                        classesWrapper="form-wompi__style_input"
                        maxLength={MAX_LENGTH_FIELD}
                    />
                </section>
                <section className="form-wompi__group-input--border-green">
                    <TextInput
                        name="priv_key"
                        value={priv_key}
                        placeholder="..."
                        onChange={handleText}
                        labelText="*Llave privada"
                        required={isSubmit && !priv_key}
                        classesWrapper="form-wompi__style_input"
                        maxLength={MAX_LENGTH_FIELD}
                    />
                </section>
            </fieldset>
            <fieldset className="form-wompi__group-input">
                <section className="form-wompi__group-input--border-green">
                    <TextInput
                        name="event"
                        value={event}
                        placeholder="..."
                        labelText="*Eventos"
                        onChange={handleText}
                        required={isSubmit && !event}
                        classesWrapper="form-wompi__style_input"
                        maxLength={MAX_LENGTH_FIELD}
                    />
                </section>
                <section className="form-wompi__group-input--border-green">
                    <TextInput
                        name="integrity"
                        placeholder="..."
                        value={integrity}
                        onChange={handleText}
                        labelText="*Integridad"
                        required={isSubmit && !integrity}
                        classesWrapper="form-wompi__style_input"
                        maxLength={MAX_LENGTH_FIELD}
                    />
                </section>
            </fieldset>
            {props.isInstructionView && (
                <section className="form-wompi__group-input--border-green">
                    <Button text={TitleButtons.SAVE} onClick={props.handleSave} classes="form-wompi__button-save" />
                </section>
            )}
        </Form>
    );
};
