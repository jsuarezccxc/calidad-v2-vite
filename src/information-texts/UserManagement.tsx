import React from 'react';
import { Icon } from '@components/icon';
import { Button } from '@components/button';
import { PRODUCT_NAME } from '@constants/ProductName';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

export const USER_MANAGEMENT_INFORMATION = {
    MODAL_WARNING_MODULES: (text: string): React.ReactElement => (
        <div className="md:w-90">
            <p className="m-0 leading-base text-gray-dark">{text}.</p>
        </div>
    ),
    MODAL_WARNING_PERMISSION: (text: string): React.ReactElement => (
        <div className="md:w-90">
            <p className="m-0 leading-base text-gray-dark">{text}.</p>
        </div>
    ),
    DESCRIPTION_TEXT: (text: string): React.ReactElement => (
        <p>
            {text} <span className="font-allerbold">{PRODUCT_NAME}</span>.
        </p>
    ),
    INSTRUCTION_TEXT: (text: string): React.ReactElement => (
        <div>
            <p>
                {text} <span className="font-allerbold">{PRODUCT_NAME}.</span>
            </p>
            <div className="flex flex-row mt-5">
                <div className="relative flex w-full md:w-90">
                    <span>• &nbsp;&nbsp; Para editar la contraseña haga click en el ícono </span>
                    <Icon className="ml-2 position-edit-icon" name="editBlue" />.
                </div>
            </div>
            <div className="relative flex w-full">
                <span>• &nbsp;&nbsp; Haga click en el botón Guardar una vez finalice los cambios.</span>
            </div>
        </div>
    ),
    USER_CATALOG_DESCRIPTION: (isSuperAdmin: boolean): React.ReactElement =>
        isSuperAdmin ? (
            <span>
                Agregue o edite los usuarios que tienen acceso a esta cuenta de &nbsp;
                <span className="font-allerbold">{PRODUCT_NAME}.</span> Más adelante puede &nbsp;
                <span className="font-allerbold">editar o actualizar</span> la información que ha subido con anterioridad dando
                click en el icono del lápiz. Si desea <span className="font-allerbold">eliminar</span> la información selecciónela
                y haga click en el icono de caneca.
            </span>
        ) : (
            <span>
                <span>
                    Agregue o edite los usuarios que tienen acceso a esta cuenta de &nbsp;
                    <span className="font-allerbold">{PRODUCT_NAME}.</span> Más adelante puede &nbsp;
                    <span className="font-allerbold">editar o actualizar</span> la información que ha subido con anterioridad
                    dando click en el icono del lápiz.
                </span>
            </span>
        ),
    HISTORY_MODIFICATIONS_DESCRIPTION: (translate: (key: string) => string): React.ReactElement => (
        <>
            {translate('company-profile.history-modifications.description')}
            <span className="font-allerbold"> {PRODUCT_NAME} </span>
            {translate('company-profile.history-modifications.by-registered-users')}.
        </>
    ),
};

export const EXPIRED_SESSION = {
    TITLE: 'Sesión caducada',
    DESCRIPTION: 'El limite de tiempo de sesión ha finalizado. Su sesión ha sido cerrada por seguridad.',
    BUTTON: 'Aceptar',
};

export const MAINTENANCE_NOTIFICATION = {
    DIGGI_PYMES_MAINTENANCE: (
        date?: string,
        initialHour?: string,
        endHour?: string,
        handleClosed = (): void => {}
    ): React.ReactElement => (
        <div className="items-center -mt-6 text-center">
            <Icon name="alertMulticolor" className="w-22.2 h-22.2 m-auto" />
            <h1 className="mt-4.5 m-auto text-blue text-center text-xl w-full mb-2">{PRODUCT_NAME} estará en mantenimiento</h1>
            <p className="mb-4 text-base text-gray-dark">
                El dia <span className="font-bold">{date}</span> a partir de las <span className="font-bold">{initialHour}</span>{' '}
                y hasta las <span className="font-bold">{endHour}</span> diggi pymes estará en mantenimiento por lo cual en este
                rango de tiempo no tendrá acceso a la plataforma.
            </p>
            <div className="items-center text-center">
                <p className="text-base text-gray-dark mb-7">
                    Cualquier duda o solicitud comunicarse al correo <span className="font-bold text-purple">ventas@ccxc.co</span>
                </p>
            </div>
            <div className="flex justify-center w-full xs:flex-col gap-y-2 gap-x-7">
                <Button
                    id={generateId({
                        module: ModuleApp.MODALS,
                        submodule: `maintenance-notification`,
                        action: ActionElementType.ACCEPT,
                        elementType: ElementType.BTN,
                    })}
                    onClick={handleClosed}
                    text={'Aceptar'}
                    classes="m-auto w-38 h-8.5"
                />
            </div>
        </div>
    ),
    BUTTON: 'Aceptar',
};
