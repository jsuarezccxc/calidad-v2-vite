import { LinkColor } from '@components/button';
import { IBodyTable } from '@components/table';
import { ITableFieldType } from '@constants/TableFieldType';

export * from './visualization-electronic-document/VisualizationElectronicDocument';
export * from './visualization-correction-document/VisualizationCorrectionDocument';

/**
 * Titles from total table
 */
export const headerViewTableCorrection = [
    {
        title: 'Motivos de corrección',
        className: 'header-reason-reject',
        field: 'correction',
    },
];

//Table headers view sales record
export const tableBodyViewCorrection = (accept: boolean): IBodyTable[] => {
    const type = accept ? ITableFieldType.LINK : ITableFieldType.TEXT;
    return [
        {
            type: type,
            wrapperClassName: 'field-reason-reject',
            color: LinkColor.PURPLE,
            field: 'correction',
            editableField: accept,
        },
    ];
};

//temporary data for the sales display table
export const dataViewCorrection =  [
    {
        correction: 'Error en datos personales',
    },
];

//Route of send email, internal component of the page
export const routesEmail = [
    {
        name: 'No aceptar rechazo',
        route: '#',
    },
];

//Route of accept rejection, internal component of the page
export const routesAcceptRejection = [
    {
        name: 'Aceptar rechazo',
        route: '#',
    },
];

//Route of Visualization Electronic Document, internal component of the page
export const routesVisualizationElectronicDocument = [
    {
        name: 'Visualización del documento electrónico',
        route: '#',
    },
];

//Route of Visualization Correction Document, internal component of the page
export const routesVisualizationCorrectionDocument = [
    {
        name: 'Visualización corrección documento electrónico',
        route: '#',
    },
];
