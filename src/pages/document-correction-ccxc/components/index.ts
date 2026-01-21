export { TableByCCXC } from './table-ccxc/TableByCCXC';

export const headersTable = [
    {
        title: 'Número documento electrónico',
        wrapperClassName: 'header-document-correction header-document-correction__document-number'
    },
    {
        title: 'Fecha error',
        wrapperClassName: 'header-document-correction header-document-correction__error-date'
    },
    {
        title: 'Descripción del error',
        wrapperClassName: 'header-document-correction header-document-correction__error-description',
        showInformation: true,
        sectionTooltip: 'es la especificación del error que origina el rechazo de un documento electrónico por parte de la DIAN'
    },
    {
        title: 'Tiempo estimado de respuesta',
        wrapperClassName: 'header-document-correction header-document-correction__time'
    }
];
