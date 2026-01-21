import React, { ReactElement } from 'react';
import { Icon } from '@components/icon';

export const TABLE_TOOLTIPS = {
    STATE: {
        title: 'Estado',
        description: 'visualice el estado en el que se encuentra su empleado.',
    },
};

export const BODY_TOOLTIP = ({ title, description }: { title: string; description: string }): JSX.Element => (
    <div className="flex justify-start items-start gap-x-2.5">
        <Icon name="infoBlue" />
        <p className="text-sm text-blue leading-16.95px" style={{ width: '16.3125rem' }}>
            <span className="font-allerbold">{title}:</span> {description}
        </p>
    </div>
);

export const INFORMATION_DETAIL = {
    BASIC_INFORMATION: {
        TITLE: 'Información básica',
        NAME: 'Nombre del empleado',
        TYPE_DOCUMENT: 'Tipo de documento',
        NUMBER_DOCUMENT: 'Número de documento',
        AREA: 'Área',
        ROL: 'Cargo',
        BIRTHDAY: 'Fecha de nacimiento',
        CODE: 'Código empleado',
    },
    CONTACT_INFORMATION: {
        TITLE: 'Información de contacto',
        PHONE: 'Teléfono',
        ADDRESS: 'Dirección',
        COUNTRY: 'País',
        DEPARTMENT: 'Departamento',
        CITY: 'Ciudad',
        ZIP_CODE: 'Código postal',
        EMAIL: 'Correo electrónico',
    },
    AFFILIATIONS: {
        TITLE: 'Afiliaciones',
        TYPE_CONTRIBUTOR: 'Tipo de cotizante',
        SUBTYPE_CONTRIBUTOR: 'Subtipo de cotizante',
        EPS: 'EPS',
        SEVERANCE_FUND: 'Fondo de cesantias',
        PENSION_FUND: 'Fondo de pensiones',
        COMPENSATION_FUND: 'Caja de compensación',
        RISK_CLASS: 'Clase de riesgo',
    },
    CONTRACT: {
        TITLE: 'Contrato',
        TYPE_CONTRACT: 'Tipo de contrato',
        START_DATE: 'Fecha inicio de contrato',
        END_DATE: 'Fecha fin de contrato',
        PAYMENT_FREQUENCY: 'Frecuencia de pago',
        SALARY: 'Salario',
        TRANSPORTATION_ASSISTANCE: 'Auxilio de transporte',
        INTEGRAL_SALARY: 'Salario integral',
        VARIABLE_SALARY: 'Salario variable',
        PAYMENT_METHOD: 'Método de pago',
    },
};

export const DATABASE_EMPLOYEE = {
    TITLE: 'Ficha técnica',
    ADD: <div className="w-full text-gray-dark mb-4.5">Agregue los datos de su empleado.</div>,
    DESCRIPTION: (
        <div className="w-full text-gray-dark">
            A continuación encuentra el listado de todos los empleados que ha agregado, para ver el detalle de cada uno y
            editarlo, haga click en el nombre del empleado.
        </div>
    ),
};

export const DATABASE_EMPLOYEE_FORM = {
    ADD_TITLE: 'Agregar empleado',
    MODAL_TITLE: 'Información ',
    MODAL_DESCRIPTION: (
        <>
            Recuerde que este empleado tiene derecho a dotación, ya que su salario es menor o igual a 2 SMMLV. Le recomendamos
            consultar el articulo <span className="font-allerbold">230 C.S.T s.s.</span> para conocer los lineamientos de esta
            prestación.
        </>
    ),
    REQUIRED: <label className="self-start text-tiny text-purple mr-1.5 text-right leading-xtiny mt-1">*Campo obligatorio</label>,
    VALUE: (
        <label className="self-start text-tiny text-purple mr-1.5 text-right leading-xtiny mt-1">
            *El valor agregado en la casilla es menor a 13 SMMLV
        </label>
    ),
};

export const DETAIL_CONTENT = {
    TITLE: 'Detalle del empleado',
    DESCRIPTION: (
        <div className="w-full text-gray-dark mb-4.5">
            A continuación detalle y edite la información del empleado; agregue una novedad y visualice los movimiento del empleado realizados en el módulo de Nómina.
        </div>
    ),
    BUTTON_NOVELTY: 'Agregar novedad',
    BUTTON_EDIT: 'Editar empleado',
};

export const TITLE_TABLE_DETAIL = 'Histórico del empleado';

export const EDIT_CONTENT: { TITLE: string; DESCRIPTION: (onClick: () => void) => ReactElement } = {
    TITLE: 'Editar empleado',
    DESCRIPTION: (onClick: () => void): ReactElement => {
        return (
            <div className="text-base text-gray-dark mb-4.5">
                A continuación, actualice o modifique la información del empleado. Para guardar los cambios realizados, haga clic
                en el botón <span className="font-allerbold">Guardar.</span>
                <ul className="ml-5 list-disc">
                    <li>
                        Para editar el campo Cargo y la sección de contrato &nbsp;
                        <span className="text-base cursor-pointer text-purple" onClick={onClick}>
                            haga click aquí.
                        </span>
                    </li>
                </ul>
            </div>
        );
    },
};

export const ORGANIZATION_CHART_CONTENT = {
    TITLE: 'Organigrama',
    SUBTITLE: 'Organigrama de la empresa',
    DESCRIPTION: (
        <div className="text-sm text-gray-dark mt-2.5">
            Desde esta pantalla agregue el organigrama de su empresa, incluyendo las áreas y cargos con los que cuenta.
            <br />
            <div className="mt-4.5">
                ¿Cómo editar la tabla del organigrama de la empresa?
                <ul className="list-disc ml-4.5">
                    <li>
                        Para empezar agregue por lo menos un área, haga click en &nbsp;
                        <span className="underline text-green">+Agregar área</span>.
                    </li>
                    <li>
                        Agregue los cargos con los que cuenta dentro de su empresa haciendo click en &nbsp;
                        <span className="underline text-green">+Agregar cargo</span>, vinculando con un área en especifico.
                    </li>
                    <li>
                        <div className="flex flex-wrap">
                            Para eliminar, seleccione los recuadros de cada fila y haga click en el ícono.{' '}
                            <Icon name="trashBlue" classIcon="w-5 h-5" />
                        </div>
                    </li>
                    <li>
                        Para <span className="font-allerbold">editar o actualizar</span> la información de una bodega, haga click
                        sobre el campo que desea cambiar y modifique la información que necesita.
                    </li>
                </ul>
            </div>
        </div>
    ),
    AREA: 'Área',
    TOOLTIP_TITLE: 'Organigrama de la empresa:',
    TOOLTIP_DESCRIPTION: 'es la estructura de la empresa con áreas y cargos.',
    ERROR: '*Hasta el momento no ha agregado ningún área, haga click sobre la opción +Agregar área para agregar una.',
    ERROR_POSITION: '*Hasta el momento no ha agregado ningún cargo, haga click sobre la opción +Agregar cargo para agregar uno.',
    ERROR_EXIST: '*El área agregada ya existe',
    ERROR_EXIST_POSITION: '*El cargo agregado ya existe',
    MODAL_TITLE_AREA: 'Eliminar Área',
    MODAL_DESCRIPTION_AREA: <>¿Está seguro que desea eliminar los datos del Área?</>,
    MODAL_TITLE_POSITION: 'Eliminar Cargo',
    MODAL_DESCRIPTION_POSITION: <>¿Está seguro que desea eliminar los datos del cargo?</>,
};
