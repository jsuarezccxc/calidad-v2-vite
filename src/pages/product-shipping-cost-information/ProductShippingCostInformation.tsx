import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { ModalCustom } from '@components/modal-custom';
import { Button } from '@components/button';
import { Icon } from '@components/icon/Icon';
import useModalProps from '@hooks/useModalProps';
import useModal from '@hooks/useModal';
import usePermissions from '@hooks/usePermissions';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import * as companyActions from '@redux/company/actions';
import * as inventoryActions from '@redux/inventory/actions';
import { COLOMBIA_ID } from '@constants/Location';
import { Source } from '@constants/Onboarding';
import { Routes } from '@constants/Paths';
import { ZERO } from '@constants/UtilsConstants';
import { TitleButtons } from '@constants/Buttons';
import { getRoute, getRouteName } from '@utils/Paths';
import { buttonsFooterProps } from '@utils/Button';
import { lengthGreaterThanOne } from '@utils/Length';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { saveModalProps } from '@utils/Modal';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import NextModalCustom from './components/next-modal/NextModal';
import { IShippingTableProps, ProductTable, ShippingTable, FreeShipping } from './components';
import { props, routes, modalInitialState, utils, MODALS, TABLES, FIRST_DESTINATION, TEXT_ELEMENTS, TEXT_ONE_ELEMENT } from '.';
import './ProductShippingCost.scss';

const ProductShippingCost: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { shipping_cost: costs, unique_products: products } = useSelector((state: RootState) => state.inventory);
    const [{ toggleModal, modals }, { information }] = [useModal(modalInitialState), props];
    const [reduxActions, { NATIONAL, FOREIGN, PRODUCTS }] = [{ ...companyActions, ...inventoryActions }, TABLES];

    const [nationalTable, setNationalTable] = useState<IGenericRecord[]>([]);
    const [foreignTable, setForeignTable] = useState<IGenericRecord[]>([]);
    const [productTable, setProductTable] = useState<IGenericRecord[]>([]);
    const [currentTable, setCurrentTable] = useState<string>(NATIONAL);
    const [freeShipping, setFreeShipping] = useState<number>(ZERO);
    const [validate, setValidate] = useState<boolean>(false);
    const [showNextModal, setShowNextModal] = useState<boolean>(false);
    const [isSave, setIsSave] = useState<boolean>(false);

    const { getDepartments, getCountries, getCities, getProductShippingCost, ...restActions } = bindActionCreators(
        reduxActions,
        dispatch
    );
    const { deleteProductShipping, getUniqueProducts, postProductShipping, deleteAdditionalProducts } = restActions;
    const { deletePlacesInLocal, getCheckedFields, getIdsToDelete, hasIdsToDelete, getShippingRequest, ...utilActions } = utils;
    const { hasCheckedPlaces, getProductsError, getLocationsError } = utilActions;

    const { disabledInputs } = usePermissions();
    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    const tableProps: IGenericRecord = {
        [NATIONAL]: { data: nationalTable, setData: setNationalTable },
        [FOREIGN]: { data: foreignTable, setData: setForeignTable },
        [PRODUCTS]: { data: productTable, setData: setProductTable },
    };

    const { deleteModal } = useModalProps(
        {
            showModal: modals.delete,
            toggleModal: () => toggleModal(MODALS.DELETE),
            moduleId: `${ModuleApp.WEBSITE}-product-shipping-const`,
        },
        getCheckedFields(tableProps[currentTable].data)
    );

    useEffect(() => {
        getData();
    }, []);

    useMemo(() => {
        setIsSave(false);
    }, [freeShipping]);

    useEffect(() => formatData(), [costs]);

    const getData = async (): Promise<void> => {
        await Promise.all([getCountries(false), getCities(), getProductShippingCost(), getDepartments(), getUniqueProducts()]);
    };

    const formatData = (): void => {
        if (!costs?.shipping?.length) return;
        const [nationalTable, foreignTable]: [nationalTable: IGenericRecord[], foreignTable: IGenericRecord[]] = [[], []];
        costs.shipping.forEach(item => {
            if (item.country_id === COLOMBIA_ID) {
                nationalTable.push(...item.destinations.map((destination: IGenericRecord) => ({ ...destination, id: uuid() })));
            } else foreignTable.push({ ...item, cities: item.destinations[FIRST_DESTINATION]?.cities || [] });
        });
        setNationalTable(nationalTable);
        setForeignTable(foreignTable);
        const uniqueProduct = costs?.unique_products.map((uniqueProduct: IGenericRecord) => {
            return {
                ...uniqueProduct,
                unique_product_id: uniqueProduct?.id,
            };
        });
        setProductTable(uniqueProduct || []);
        setFreeShipping(Number(costs?.free_shipping) || ZERO);
    };

    const onClickTrash = (table: string): void => {
        if (hasCheckedFields(table)) {
            toggleModal(MODALS.DELETE);
            setCurrentTable(table);
        }
    };

    const hasCheckedFields = (table: string): boolean => {
        return table === PRODUCTS ? !!checkedProducts?.length : hasCheckedPlaces(tableProps[table].data);
    };

    const validateDelete = (): boolean => {
        const { data } = tableProps[currentTable];
        const productsToDelete = checkedProducts.filter(({ added = false }) => !added).map(({ id }) => id);
        if (currentTable === PRODUCTS) return lengthGreaterThanOne(productsToDelete);
        return Object?.keys(data)?.some(field => lengthGreaterThanOne(data[field]));
    };

    const checkedProducts = useMemo(() => productTable?.filter(item => item.checked), [productTable]);

    const deletePlaces = async (): Promise<void> => {
        const { data, setData } = tableProps[currentTable];
        const ids: IGenericRecord = getIdsToDelete(data, currentTable);
        deletePlacesInLocal(data, setData);
        if (hasIdsToDelete(ids)) return await deleteProductShipping(ids);
    };

    const deleteProducts = async (): Promise<void | boolean> => {
        setProductTable(productTable.filter(product => !product.checked));
        const productIds = checkedProducts.filter(({ added = false }) => !added).map(({ id }) => id);
        return productIds?.length ? await deleteAdditionalProducts(productIds) : false;
    };

    const deleteFields = async (): Promise<void> => {
        const action = currentTable === PRODUCTS ? deleteProducts : deletePlaces;
        const isCorrectResponse = Boolean(await action());
        toggleModal(isCorrectResponse ? MODALS.SUCCESS : MODALS.DELETE);
    };

    const getShippingTableProps = (table = FOREIGN): IShippingTableProps => ({
        ...tableProps[table],
        onClickTrash,
        isNationalTable: table === NATIONAL,
        checkedFields: getCheckedFields(tableProps[table].data),
        validate,
    });

    const hasFieldsWithError = (): boolean => {
        return !!(getProductsError(productTable) || getLocationsError(foreignTable, false) || getLocationsError(nationalTable));
    };

    const saveChanges = async (): Promise<void> => {
        if (hasFieldsWithError()) return setValidate(true);
        const isCorrectResponse = await postProductShipping(
            getShippingRequest({ productTable, nationalTable, foreignTable, freeShipping, products })
        );
        setIsSave(isCorrectResponse);
        if (isCorrectResponse) toggleModal(MODALS.SUCCESS);
        setValidate(false);
    };

    return (
        <div className="shipping-cost">
            <PageTitle title={getRouteName(Routes.WEBSITE_MENU)} />
            <BreadCrumb routes={routes()} />
            <Information color="blue" {...information.main} />
            <Information {...information.national} />
            <ShippingTable {...getShippingTableProps(NATIONAL)} />
            <Information {...information.foreign} />
            <ShippingTable {...getShippingTableProps()} setIsSave={setIsSave} />
            <Information {...information.products} />
            <ProductTable
                products={products}
                onClickTrash={onClickTrash}
                validate={validate}
                checkedProducts={checkedProducts}
                data={productTable}
                setData={setProductTable}
                setIsSave={setIsSave}
            />
            <Information {...information.shipment} />
            <FreeShipping freeShipping={freeShipping} setFreeShipping={setFreeShipping} />
            <Information {...information.end} />

            <PageButtonsFooter
                threeButtons
                titleButtonCenter={TitleButtons.SAVE}
                onClickButtonCenter={(): void => {
                    saveChanges();
                }}
                {...buttonsFooterProps(
                    ModuleApp.WEBSITE,
                    history,
                    !isSave
                        ? (): void => {
                              setShowNextModal(!showNextModal);
                          }
                        : getRoute(Routes.INFORMATION_PROVISION_OF_SERVICES),

                    {
                        name: getRouteName(Routes.INFORMATION_PROVISION_OF_SERVICES),
                        moduleName: getRouteName(Routes.HOME),
                    },
                    ''
                )}
                disabledCenter={disabledInputs}
            />
            <ModalCustom closeIcon={false} {...deleteModal} classesModal="shipping-cost__container-modal">
                <div className="flex flex-col items-center success-modal">
                    <Icon name="recycleBin" className="mb-2" />
                    <p className="shipping-cost__title">Eliminar</p>
                    <p className="text-base text-center text-gray-dark">
                        {`${validateDelete() ? TEXT_ELEMENTS : TEXT_ONE_ELEMENT}`}
                    </p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-product-shipping-cost`,
                                action: ActionElementType.BACK,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => toggleModal(MODALS.DELETE)}
                            text="Atras"
                            classes="mr-6"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-product-shipping-cost`,
                                action: ActionElementType.DELETE,
                                elementType: ElementType.BTN,
                            })}
                            text="Eliminar"
                            onClick={deleteFields}
                        />
                    </div>
                </div>
            </ModalCustom>

            <ModalCustom
                closeIcon={false}
                {...saveModalProps(
                    modals.success,
                    (): void => toggleModal(MODALS.SUCCESS),
                    `${ModuleApp.WEBSITE}-product-shipping-cost`
                )}
                classesModal="shipping-cost__container-modal"
            >
                <div className="flex flex-col items-center success-modal">
                    <Icon name="check" className="mb-2 w-22.2 h-22.2" />
                    <p className="mb-2 text-xl font-bold text-center leading-xl text-blue font-allerbold w-65">
                        Información Guardada
                    </p>
                    <p className="text-base text-center text-gray-dark">¡Su información ha sido guardada con éxito</p>
                    <div className="flex justify-center w-full mt-7">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-product-shipping-cost-success`,
                                action: ActionElementType.ACCEPT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => handlePostConfirmation(() => toggleModal(MODALS.SUCCESS))}
                            text="Aceptar"
                            classes="shadow-templateDesign"
                        />
                    </div>
                </div>
            </ModalCustom>
            <ModalCustom
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-product-shipping-cost`,
                    action: ActionElementType.NEXT,
                    elementType: ElementType.MDL,
                })}
                closeIcon={false}
                show={showNextModal}
                showModal={(): void => setShowNextModal(!showNextModal)}
                classesWrapper="xs:h-full xs:w-full"
                classesModal="xs:h-full xs:w-full w-120.9 bg-white-important p-10 justify-center"
            >
                <div className="success-modal">
                    <NextModalCustom saveChanges={saveChanges} showModal={showNextModal} setShowModal={setShowNextModal} />
                </div>
            </ModalCustom>
        </div>
    );
};

export default ProductShippingCost;
