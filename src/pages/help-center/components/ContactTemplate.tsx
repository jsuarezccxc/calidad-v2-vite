//--- Libraries ---//
import React, { FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
//--- Components ---//
import { Button } from '@components/button';
//--- Root ---//
import { CONTACT_DATA } from '.';

export const ContactTemplate: React.FC<{ children: React.ReactNode; sendForm: (e: FormEvent) => void }> = ({
    children,
    sendForm,
}) => {
    const history = useHistory();
    return (
        <>
            <div className="contact">
                <div className="contact__data">
                    <div className="flex flex-col">
                        <h3 className="contact__title">Información de contacto</h3>
                        {CONTACT_DATA.map(({ image, value }) => (
                            <div key={value} className="flex items-center gap-2.5 mb-7">
                                <img src={image} alt="Phone" className="w-12.5 h-12.5" />
                                <p className="text-gray-dark">{value}</p>
                            </div>
                        ))}
                    </div>
                    <hr className="contact__line" />
                </div>
                <form onSubmit={sendForm} className="contact__form">
                    {children}
                    <Button classes="w-30 m-auto block" text="Enviar" onClick={sendForm} />
                </form>
            </div>
            <div className="flex items-end justify-end w-full mt-7">
                <Button
                    classes="text-blue shadow-templateDesign"
                    background="white"
                    text="Atrás"
                    onClick={(): void => history.goBack()}
                />
            </div>
        </>
    );
};
