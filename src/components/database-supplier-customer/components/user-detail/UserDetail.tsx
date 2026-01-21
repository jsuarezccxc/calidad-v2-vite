import React, { Fragment, useMemo } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { RootState } from '@redux/rootReducer';
import { Button } from '@components/button';
import { Icon } from '@components/icon';
import { SUPPLIER, CUSTOMER } from '@components/database-supplier-customer';
import { Routes } from '@constants/Paths';
import { NA } from '@constants/ElectronicInvoice';
import { IGenericRecord } from '@models/GenericRecord';
import { getRoute } from '@utils/Paths';
import { lengthGreaterThanZero } from '@utils/Length';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { setSelectedSupplier } from '@redux/suppliers/actions';
import usePermissions from '@hooks/usePermissions';
import { ISupplerDetailProps, routesSupplierDetail } from '.';

export const UserDetail: React.FC<ISupplerDetailProps> = ({
    data,
    onClickEdit = (): void => {},
    title,
    pageRoute,
    activeElectronicDocuments,
}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { disabledInputs } = usePermissions();
    const { utils } = useSelector(({ utils }: RootState) => ({
        ...utils,
    }));

    const documentName = useMemo(
        (): string => utils?.document_types?.find((item: IGenericRecord) => item.id === data.document_type)?.name || '',
        [utils?.document_types]
    );

    const handleElectronicDocuments = (route: string): void => {
        history.push(route);
        if (title.singular === SUPPLIER)
            dispatch(setSelectedSupplier({ id: data?.id, name: data?.name, personId: data?.person_id }));
    };

    const descriptionByModule = (singular: string): string => {
        const textCustomer = 'puede generar una factura electrónica de venta';
        const textSupplier = 'genere un documento soporte o factura de compra';
        let textDescription = '';

        if (singular === CUSTOMER) textDescription = textCustomer;
        if (singular === SUPPLIER) textDescription = textSupplier;

        return `A continuación detalle y edite la información del ${singular}; desde esta pantalla ${textDescription} del módulo de documentos electrónicos.`;
    };

    const handleTitle = (title: string): string => {
        if (title === CUSTOMER) return `Nombre del cliente o empresa`;
        return `Nombre del ${title}`;
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="supplier-database">
                <PageTitle title="Ficha técnica" classTitle="text-left text-base" classContainer="w-full" />
                <BreadCrumb routes={routesSupplierDetail(title.singular, title.plural, pageRoute)} />
                <h2 className="text-center text-26lg text-blue font-allerbold xs:text-xl">Detalle del {title.singular}</h2>
                <p className="text-gray-dark mt-4.5 xs:text-center">{descriptionByModule(title.singular)}</p>
                <div className="flex mt-2 gap-x-4.5 flex-wrap xs:gap-y-4.5">
                    {activeElectronicDocuments && (
                        <>
                            {title.singular === CUSTOMER && (
                                <div
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                        submodule: 'generate-electronic-invoice',
                                        action: ActionElementType.REDIRECT,
                                        elementType: ElementType.BTN,
                                    })}
                                    className="flex items-center rounded-md shadow-card w-48 h-13 p-2 gap-0.5 bg-white cursor-pointer xs:w-full"
                                    onClick={(): void => {
                                        handleElectronicDocuments(getRoute(Routes.GENERATE_SALES_INVOICE));
                                    }}
                                >
                                    <Icon name="shoppingPaper" className="w-7.5 h-7.5 inline" />
                                    <p className="text-sm text-center text-blue font-allerbold">Generar factura electrónica</p>
                                </div>
                            )}
                            {title.singular === SUPPLIER && (
                                <>
                                    <div
                                        id={generateId({
                                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                                            submodule: 'generate-support-document',
                                            action: ActionElementType.REDIRECT,
                                            elementType: ElementType.BTN,
                                        })}
                                        className="flex items-center rounded-md shadow-card w-48 h-13 p-2 gap-0.5 bg-white cursor-pointer xs:w-full"
                                        onClick={(): void => {
                                            handleElectronicDocuments(getRoute(Routes.GENERATE_SUPPORT_DOCUMENT));
                                        }}
                                    >
                                        <Icon name="shoppingPaper" className="w-7.5 h-7.5 inline" />
                                        <p className="text-sm text-center text-blue font-allerbold">Generar documento soporte</p>
                                    </div>
                                    <div
                                        className="flex items-center rounded-md shadow-card w-48 h-13 p-2 gap-0.5 bg-white cursor-pointer xs:w-full"
                                        onClick={(): void => {
                                            handleElectronicDocuments(getRoute(Routes.GENERATE_PURCHASE_INVOICE));
                                        }}
                                    >
                                        <Icon name="shoppingPaper" className="w-7.5 h-7.5 inline mb-1" />
                                        <p className="text-sm text-center text-blue font-allerbold">Generar factura de compra</p>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    <div
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                            submodule: 'edit',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.BTN,
                        })}
                        className="flex items-center rounded-md shadow-card w-48 h-13 p-2 gap-0.5 bg-white cursor-pointer xs:w-full"
                        {...(!disabledInputs && { onClick: onClickEdit })}
                    >
                        <Icon name="pencilColor" className="w-7.5 h-7.5 inline mb-1" />
                        <p className="pr-4 text-sm text-center text-blue font-allerbold">
                            Editar información del {title.singular}
                        </p>
                    </div>
                </div>
                <div className="card-add-supplier">
                    <div className=" card-add-supplier__content-information">
                        <h3 className="text-base text-green mb-4.5 font-allerbold">Información básica</h3>
                        <article className="flex flex-col flex-wrap gap-12">
                            <div className="flex flex-wrap gap-12">
                                <p className="card-add-supplier__name-field">
                                    {handleTitle(title.singular)} <br /> &nbsp;
                                    <span className="text-tiny text-gray mt-1.5">{data.name}</span>
                                </p>
                                <p className="card-add-supplier__basic-field">
                                    Tipo de documento <br /> &nbsp;
                                    <span className="text-tiny text-gray mt-1.5">{documentName}</span>
                                </p>
                                <p className="card-add-supplier__basic-field">
                                    Número de documento <br />
                                    <span className="text-tiny text-gray mt-1.5">{data.document_number}</span>
                                </p>
                            </div>
                            {title.singular === CUSTOMER && (
                                <section className="flex flex-wrap gap-12 -mt-5">
                                    <p className="card-add-supplier__name-field">
                                        Nombre del representante legal
                                        <br />
                                        <span className="text-tiny text-gray mt-1.5">{data.name_legal_representative || NA}</span>
                                    </p>
                                </section>
                            )}
                        </article>
                    </div>
                    <div className="card-add-supplier__content-information">
                        <h3 className="text-base text-gray-dark my-4.5 font-allerbold">Información de contacto</h3>
                        <div className="flex flex-col flex-wrap gap-5">
                            <div className="flex flex-wrap gap-12">
                                <p className="card-add-supplier__basic-field">
                                    Dirección <br />
                                    <span className="text-tiny text-gray mt-1.5">{data?.address || NA}</span>
                                </p>
                                <p className="card-add-supplier__basic-field">
                                    Pais <br />
                                    <span className="text-tiny text-gray mt-1.5">{data?.country_name || NA}</span>
                                </p>
                                <p className="card-add-supplier__basic-field">
                                    Departamento <br />
                                    <span className="text-tiny text-gray mt-1.5">{data?.department_name || NA}</span>
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-12">
                                <p className=" card-add-supplier__basic-field">
                                    Ciudad <br />
                                    <span className="text-tiny text-gray mt-1.5">{data?.city_name || NA}</span>
                                </p>
                                <p className=" card-add-supplier__basic-field">
                                    Código postal <br />
                                    <span className="text-tiny text-gray mt-1.5">{data?.postal_code || NA}</span>
                                </p>
                                <p className=" card-add-supplier__basic-field">
                                    Teléfono <br /> <span className="text-tiny text-gray mt-1.5">{data.phone || NA}</span>
                                </p>
                                <p className=" card-add-supplier__basic-field">
                                    Correo electrónico <br />
                                    <span className="text-tiny text-gray mt-1.5">{data.email || NA}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-base text-gray-dark my-4.5 font-allerbold">Detalles tributarios</h3>
                        <div className="flex flex-wrap gap-12">
                            <p className="card-add-supplier__basic-field">
                                Tipo de contribuyente <br />
                                <span className="text-tiny text-gray mt-1.5">{data?.type_taxpayer_name || NA}</span>
                            </p>
                            <p className="card-add-supplier__basic-field">
                                Detalle de impuesto <br />
                                <span className="text-tiny text-gray mt-1.5">
                                    {`${data.tax_details_code} - ${data.tax_details_name}` || NA}
                                </span>
                            </p>
                            {title.singular === SUPPLIER &&
                                data?.fiscal_responsibilities?.map((item: IGenericRecord, index: number) => (
                                    <p className="card-add-supplier__basic-field" key={index}>
                                        Responsabilidad fiscal <br />
                                        <span className="text-tiny text-gray mt-1.5">{item?.name || NA}</span>
                                    </p>
                                ))}
                        </div>
                        {title.singular === CUSTOMER && (
                            <>
                                <p className="mt-5 text-blue font-allerbold">Responsabilidad fiscal</p>
                                {lengthGreaterThanZero(data.fiscal_responsibilities) ? (
                                    data.fiscal_responsibilities.map((item: IGenericRecord, index: number) => (
                                        <Fragment key={index}>
                                            <span className="card-add-supplier__field-responsibilities">{item?.name || NA}</span>
                                            <br />
                                        </Fragment>
                                    ))
                                ) : (
                                    <p className="card-add-supplier__field-responsibilities">...</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Button
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_CUSTOMER_SUPPLIER,
                    submodule: 'user-detail',
                    action: ActionElementType.BACK,
                    elementType: ElementType.BTN,
                })}
                background="white"
                text="Atrás"
                onClick={(): void => history.goBack()}
                classes="ml-auto mb-2 mt-6 xs:w-22.3 shadow-templateDesign"
            />
        </div>
    );
};
