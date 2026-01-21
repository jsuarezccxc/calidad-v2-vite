import { IHeaderTable } from '@components/table';

export { default } from './ResumeTable';

/**
 * Current headers table
 */
export const headersTable: IHeaderTable[] = [
    { title: 'Tipo de documento electrónico', wrapperClassName: 'w-60', className: 'w-44 h-5.75 xs:h-8.6' },
    { title: 'Número de documento electrónico', wrapperClassName: 'w-60', className: 'w-44 h-5.75 xs:h-8.6' },
    { title: 'Fecha de emisión', className: 'w-32 h-5.75 xs:h-8.6' },
    { title: 'Código del error', wrapperClassName: 'w-60', className: 'w-32 h-5.75 xs:h-8.6' },
    { title: 'Descripción del error', className: 'w-44 h-5.75 xs:h-8.6' },
];
