import React from 'react';
import { FieldName } from '@models/DataCompany';

export const TOOLTIP_DATA: { [key: string]: { titleTooltip: string; descTooltip: string | JSX.Element } } = {
    [FieldName.CompanyName]: {
        titleTooltip: 'Nombre de la empresa: ',
        descTooltip: 'Es el nombre de su empresa o razón social que se encuentra en su RUT.',
    },
    [FieldName.Dv]: {
        titleTooltip: 'DV: ',
        descTooltip:
            'El dígito de verificación es el sello de autenticidad que se agrega al NIT para confirmar que son correctos y válidos. El DV lo encuentra en la casilla 6 de la hoja principal del RUT de su empresa.',
    },
    [FieldName.Address]: {
        titleTooltip: 'Dirección: ',
        descTooltip: 'Donde está ubicada la empresa',
    },
    [FieldName.RepresentativeName]: {
        titleTooltip: 'Nombre del representante: ',
        descTooltip: 'Es el nombre de la persona que actúa en nombre de la empresa.',
    },
    [FieldName.Country]: {
        titleTooltip: 'Ciudad: ',
        descTooltip: 'Es la ciudad donde se registró la empresa en la cámara de comercio.',
    },
    [FieldName.Department]: {
        titleTooltip: 'Departamento/Estado: ',
        descTooltip: 'Es el departamento o estado en la que se registró la empresa en la cámara de comercio.',
    },
    [FieldName.City]: {
        titleTooltip: 'Ciudad: ',
        descTooltip: 'Es la ciudad donde se registró la empresa en la cámara de comercio.',
    },
    [FieldName.PostalCode]: {
        titleTooltip: 'Código postal: ',
        descTooltip: 'Es la combinación de números que representa la zona en la que está ubicada la empresa.',
    },
    [FieldName.Phone]: {
        titleTooltip: 'Teléfono: ',
        descTooltip: 'Contacto principal de la empresa.',
    },
    [FieldName.TaxDetail]: {
        titleTooltip: 'Impuestos: ',
        descTooltip: (
            <>
                <p>Obligaciones tributarias que la persona o empresa deben pagar al estado</p>
                <br />
                <p>
                    Para saber mas sobre impuestos haga click aca:
                    <a target="_blank" rel="noreferrer" className="ml-1 underline text-purple" href="">
                        Ver más...
                    </a>
                </p>
            </>
        ),
    },
    [FieldName.FiscalResponsibility]: {
        titleTooltip: 'Responsabilidad fiscal: ',
        descTooltip:
            'Es la clasificación que la DIAN le da a los contribuyentes, para saber a qué impuestos están obligados. Se encuentra en la casilla X del RUT.',
    },
    [FieldName.EconomicActivity]: {
        titleTooltip: 'CIIU o Actividad económica: ',
        descTooltip:
            'Este dato se encuentra en el RUT de la empresa, en la sección "Clasificación", bajo el título "Actividad económica". Se encuentra en la casilla X del RUT.',
    },
    [FieldName.TypeOfTaxpayer]: {
        titleTooltip: 'Tipo de contribuyente: ',
        descTooltip: (
            <ul className="ml-6 list-disc">
                <li className="text-sm leading-16.95px text-blue mb-4.5">
                    <span className="font-allerbold">Persona natural:</span> cuando el cliente actúa a título personal.
                </li>
                <li className="text-sm leading-16.95px text-blue">
                    <span className="font-allerbold">Persona jurídica:</span> cuando el cliente actúa en representación de una
                    sociedad conformada por una o mas personas.
                </li>
            </ul>
        ),
    },
};
