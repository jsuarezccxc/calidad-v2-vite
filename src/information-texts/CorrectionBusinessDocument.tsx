import React from 'react';
import { Link, LinkColor } from '@components/button';
import { IGenericRecord } from '@models/GenericRecord';

export const CORRECTION_BUSINESS_DOCUMENT = (href = '#', informationModal: IGenericRecord = {}): IGenericRecord => ({
    TITLE: 'Corrección de documentos electrónicos de la DIAN por parte del empresario',
    TITLE_RESUME_TABLE: 'Tabla resumen corrección de documentos de la DIAN por parte del empresario',
    TITLE_MODAL_SAVE: 'Información guardada',
    TITLE_MODAL_NEXT: 'Información',
    TITLE_VIEW_CORRECTIONS: 'Visualización corrección documento electrónico',
    TITLE_DELETE_PRODUCT: 'Eliminar',
    DESCRIPTION: (
        <React.Fragment>
            <p>
                La corrección de los documentos electrónicos se genera por el rechazo de la DIAN. La DIAN puede rechazar los
                documentos electrónicos por razones como: errores de operaciones matemáticas, errores en datos del documento,
                errores correspondientes a la resolución de la factura electrónica y por la fecha de emisión de la factura.
            </p>
            <p className="my-4.5">
                En el listado de documentos electrónicos que requieren acción, encuentra todos los documentos electrónicos que
                requieren la acción de corregir, para ver este reporte{' '}
                <Link text="haga click aquí" href={href} linkColor={LinkColor.PURPLE} classes="text-base" /> .
            </p>
            <p>
                Para visualizar y corregir los errores por los cuales la DIAN rechazó el documento, seleccione el documento
                electrónico y haga click en Corregir. Para descargar la tabla de las razones de rechazo por parte de la DIAN y la
                tabla resumen de correcciones de documentos de la DIAN realizadas, haga click en los íconos descargables.
            </p>
        </React.Fragment>
    ),
    DESCRIPTION_DELETE_PRODUCT: (
        <p>
            ¿Está seguro de eliminar los elementos seleccionados?
            <br /> <br />
            Los elementos eliminados son llevados a la papelera.
        </p>
    ),
    DESCRIPTION_RESUME_TABLE: (
        <React.Fragment>
            <p>
                En la siguiente tabla puede visualizar los documentos electrónicos de la DIAN que han sido corregidos con su
                respectiva fecha de emisión, código del error y descripción de este.
            </p>
            <ul className="ml-10 list-disc">
                <li>
                    Para visualizar el documento electrónico rechazado por la DIAN, haga click sobre el número del documento
                    electrónico.
                </li>
                <li>
                    Para visualizar el documento electrónico corregido junto con los motivos por los cuales se realizaron las
                    correcciones, haga click sobre la descripción del error del documento correspondiente.
                </li>
            </ul>
        </React.Fragment>
    ),
    DESCRIPTION_MODAL_SAVE: (
        <React.Fragment>
            <p className="mb-5">¡Su información ha sido guardada con éxito!</p>
            <p className="mb-5">
                Su factura de venta ha sido corregida y enviada con el prefijo {informationModal.prefix} Y el número &nbsp;
                {informationModal.number}.
            </p>
            <p className="mb-5">Hora de emisión: {informationModal.hour} hrs.</p>
            <p className="mb-7">
                Si desea corregir otra factura, haga click en el botón Agregar. Si no tiene más facturas corregir, haga click en
                Siguiente.
            </p>
        </React.Fragment>
    ),
    DESCRIPTION_MODAL_NEXT: (
        <p className="mb-5 lg:w-96">
            Guarde la información antes de continuar. Si da click en siguiente los cambios se perderán.
        </p>
    ),
    DESCRIPTION_VIEW_CORRECTIONS: (
        <p>En esta pantalla puede visualizar los cambios realizados para corregir los errores del documento electrónico.</p>
    ),
    DESCRIPTION_INVOICE_CORRECTION: (
        <p>
            En esta pantalla puede corregir los errores encontrados por la DIAN en su documento electrónico. En el campo Acción
            esperada por parte del empresario visualiza los errores a corregir en la factura. Tenga en cuenta que debe corregir
            todos los errores antes de hacer click en el botón de Guardar en la parte inferior de la pantalla. diggi pymes envía
            el documento corregido a la DIAN.
        </p>
    ),
});
