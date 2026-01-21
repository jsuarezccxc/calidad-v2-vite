import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { getFile } from '@redux/user/actions';
import { deleteCategoryOrVariant, getReport, setErrorDelete, setProductEdit } from '@redux/product-catalog/actions';
import { PRODUCT_CATALOG } from '@information-texts/ProductDatabase';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { MultiSelectInput, SearchInput } from '@components/input';
import { Information } from '@components/information';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { SimpleButton } from '@components/button';
import { Form } from '@components/form';
import { ModalCustom } from '@components/modal-custom';
import { DownloadIcons, Icon } from '@components/icon';
import { TitleButtons } from '@constants/Buttons';
import { Routes } from '@constants/Paths';
import { SubstringText } from '@utils/SubstringText';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { remToPx } from '@utils/Size';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import { urls } from '@api/urls';
import usePermissions from '@hooks/usePermissions';
import { THREE } from '@pages/virtual-store-sales-receipts';
import { ProductDatabaseContext } from '../context';
import { DeletionErrorModal, Detail, TableCatalog } from './components';
import { ITaxOption } from '..';
import { IProductCatalogProps, LIMIT_COLUMNS, columnsOptions, routes, transformObject } from '.';
import './ProductCatalog.scss';

const ProductCatalog: React.FC<IProductCatalogProps> = ({ toggleShowCatalog, setShowCatalog }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        report: { data: report, ...metaTable },
        uniqueProduct,
        errorDelete,
        loader: loaderState,
    } = useSelector(({ productCatalog, loader }: RootState) => ({ ...productCatalog, ...loader }));

    const [searchValue, setSearchValue] = useState('');
    const [selectedColumns, setSelectedColumns] = useState(columnsOptions);
    const [columnSelect, setColumnSelected] = useState('');
    const [showProductDetail, setShowProductDetail] = useState(false);
    const [deleteList, setDeleteList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [dataTable, setDataTable] = useState<IGenericRecord[]>([]);
    const [showModalError, setShowModalError] = useState(false);
    const [allDataReport, setAllDataReport] = useState<IGenericRecord>({});
    const { disabledInputs } = usePermissions();

    const toggleModal = (): void => setShowModal(!showModal);

    const singleProductSelected = useMemo(() => deleteList.length === 1, [deleteList]);

    const { resetData } = useContext(ProductDatabaseContext);

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([dispatch(getReport()), dispatch(setProductEdit({}))]);
        })();

        resetData();
    }, []);

    useEffect(() => {
        if (searchValue.length >= THREE || !searchValue) dispatch(getReport(searchValue));
    }, [searchValue]);

    useEffect(() => {
        setDataTable(allDataReport?.data);
    }, [allDataReport?.data]);

    useEffect(() => {
        setDataTable(report);
        setAllDataReport({ data: report, ...metaTable });
    }, [report]);

    useEffect(() => {
        if (errorDelete?.length) {
            setShowModalError(true);
        }
    }, [errorDelete]);

    const handleDelete = (id: never): void => {
        setDeleteList(deleteList.includes(id) ? deleteList.filter(itemId => itemId !== id) : [...deleteList, id]);
    };

    useEffect(() => {
        if (uniqueProduct?.editCarrousel) toggleShowDescription();
    }, [uniqueProduct]);

    const listColumns = useMemo(() => {
        return selectedColumns
            .filter(item => item.multiSelectCheck.value)
            .reduce((acc, option) => {
                acc[option.key] = true;
                return acc;
            }, {} as Record<string, boolean>);
    }, [selectedColumns]);

    const widthTable = useMemo(() => {
        const baseWidth = remToPx(20.625);
        return selectedColumns
            .filter(item => item.multiSelectCheck.value)
            .reduce((acc, column) => acc + (column.width || 0), baseWidth);
    }, [selectedColumns]);

    const handleChangeTaxes = (e: ITaxOption): void => {
        const updatedTaxes = selectedColumns.map(column =>
            column.key === e.key ? { ...column, multiSelectCheck: { value: !column.multiSelectCheck.value } } : column
        );

        setSelectedColumns(updatedTaxes);

        const selectValue = updatedTaxes
            .filter(tax => tax.multiSelectCheck.value)
            .map(tax => tax.value)
            .join(', ');

        setColumnSelected(selectValue);
    };

    const toggleShowDescription = (): void => setShowProductDetail(!showProductDetail);

    const removeFile = (): void => {
        dispatch(
            deleteCategoryOrVariant(
                deleteList.map((item: string) => ({ id: item })),
                true
            )
        );
        toggleModal();
        setDeleteList([]);
    };

    const closeModal = (): void => {
        setShowModalError(false);
        dispatch(setErrorDelete([]));
    };

    const downloadData = useMemo(
        () => ({
            module: 'product-data-base',
            data: dataTable,
            search: searchValue,
            titles: transformObject(listColumns),
            index: Object.keys(transformObject(listColumns)),
        }),
        [searchValue, dataTable]
    );

    const downloadFile = {
        pdf: (): void => {
            dispatch(
                getFile(
                    {
                        ...downloadData,
                        type: 'pdf',
                    },
                    'Ficha técnica de productos/servicios',
                    urls.getFile
                )
            );
        },
        excel: (): void => {
            dispatch(
                getFile(
                    {
                        ...downloadData,
                        type: 'xlsx',
                    },
                    'Ficha técnica de productos/servicios',
                    urls.getFile
                )
            );
        },
    };

    return (
        <div>
            {showProductDetail ? (
                <Detail
                    toggleShowDescription={toggleShowDescription}
                    product={uniqueProduct}
                    toggleShowCatalog={toggleShowCatalog}
                    setShowCatalog={setShowCatalog}
                />
            ) : (
                <div className="flex flex-col pb-2">
                    <PageTitle title={getRouteName(Routes.DATABASE_MENU)} classTitle="text-base" />
                    <BreadCrumb routes={routes()} />
                    <Information
                        classNameTitle="product-management__title"
                        title={PRODUCT_CATALOG.TITLE}
                        color="blue"
                        description={PRODUCT_CATALOG.DESCRIPTION}
                    />
                    <div className="flex justify-between mt-4.5 xs:flex-col-reverse xs:gap-4.5">
                        <Form className="flex xs:flex-col gap-4.5 justify-center items-end">
                            <SearchInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                    submodule: 'search',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                name="search"
                                labelText="Buscador:"
                                placeholder="..."
                                classesWrapperInput="xs:w-full"
                                classesWrapper="w-full lg:w-45"
                                value={searchValue}
                                iconClassName="w-2.5 h-2.5"
                                onChange={(e): void => setSearchValue(e.target.value)}
                            />
                            <MultiSelectInput
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                    submodule: 'filter-columns',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                classesWrapper="product-catalog__select-tax"
                                labelText="Seleccione las columnas que desea ver en la tabla: "
                                classListSelect
                                options={selectedColumns}
                                isNewSelect
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                optionSelected={(option: any): void => handleChangeTaxes(option)}
                                value={SubstringText(columnSelect, 28)}
                            />
                        </Form>
                        <div className="flex items-start justify-start gap-7 mt-4.5">
                            <SimpleButton
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                    submodule: 'new-product-service',
                                    action: ActionElementType.ADD,
                                    elementType: ElementType.BTN,
                                })}
                                className="product-catalog__button-add"
                                onClick={toggleShowCatalog}
                            >
                                <Icon name="addWhite" className="w-5 h-5" />
                                Agregar producto/servicio
                            </SimpleButton>
                            <DownloadIcons
                                moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                                className="mt-2 download-icons"
                                download={downloadFile}
                                withoutText
                            />
                        </div>
                    </div>
                    <div
                        className={`${
                            Object.keys(listColumns).length < LIMIT_COLUMNS ? 'product-catalog__wrapper' : 'flex flex-col'
                        }`}
                    >
                        <Icon
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                submodule: 'products-services',
                                action: ActionElementType.TRASH,
                                elementType: ElementType.ICO,
                            })}
                            name="trashBlue"
                            className=" w-5.5 self-end mr-1 mt-4.5 mb-3 cursor-pointer"
                            onClick={(): void => {
                                deleteList.length && !disabledInputs && toggleModal();
                            }}
                        />
                        <TableCatalog
                            isLoadingTable={loaderState}
                            listColumns={listColumns}
                            widthTable={widthTable}
                            data={dataTable}
                            setData={setAllDataReport}
                            toggleShowDescription={toggleShowDescription}
                            handleDelete={handleDelete}
                            deleteList={deleteList}
                            paginatorDataBack={allDataReport}
                        />
                    </div>

                    <div className="product-catalog__total">
                        <div className="product-catalog__total-text">Total productos/servicios</div>
                        <div className="product-catalog__total-number">{String(allDataReport?.meta?.total)}</div>
                    </div>
                    <PageButtonsFooter
                        {...buttonsFooterProps(
                            ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            history,
                            getRoute(Routes.WAREHOUSES),
                            { name: '', moduleName: '' },
                            TitleButtons.NEXT
                        )}
                    />
                </div>
            )}
            <ModalCustom
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                    submodule: `${ModuleApp.MODALS}-product-services`,
                    action: ActionElementType.DELETE,
                    elementType: ElementType.MDL,
                })}
                show={showModal}
                showModal={toggleModal}
                classesModal="product-catalog__modal-delete"
                removeMinWidth
                classIconClose="-right-6"
            >
                <Icon name="trashMulticolor" classIcon="w-22.2" />
                {PRODUCT_CATALOG.modalDelete(singleProductSelected)}
                <div className="flex gap-7 mt-7">
                    <SimpleButton
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `${ModuleApp.MODALS}-product-services`,
                            action: ActionElementType.CANCEL,
                            elementType: ElementType.BTN,
                        })}
                        onClick={toggleModal}
                        className="product-catalog__modal-button"
                    >
                        {TitleButtons.CANCEL}
                    </SimpleButton>
                    <SimpleButton
                        id={generateId({
                            module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                            submodule: `${ModuleApp.MODALS}-product-services`,
                            action: ActionElementType.DELETE,
                            elementType: ElementType.BTN,
                        })}
                        onClick={removeFile}
                        className="product-catalog__modal-button"
                    >
                        {TitleButtons.DELETE}
                    </SimpleButton>
                </div>
            </ModalCustom>
            <DeletionErrorModal showModalError={showModalError} closeModal={closeModal} data={errorDelete} />
        </div>
    );
};

export default ProductCatalog;
