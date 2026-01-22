import React, { useContext, useEffect, useState } from 'react';
import usePermissions from '@hooks/usePermissions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '@redux/rootReducer';
import { getCompanyTaxes } from '@redux/company/actions';
import { postMassiveProducts, setDataMassiveUpload } from '@redux/assemble-product/action';
import { getCategoryCatalog } from '@redux/product/actions';
import { postProduct } from '@redux/products/actions';
import { setUniqueProduct } from '@redux/product-catalog/actions';
import { getUtils } from '@redux/utils/actions';
import { BreadCrumb } from '@components/bread-crumb';
import { Icon } from '@components/icon';
import { Information, InformationBulb } from '@components/information';
import { ModalType } from '@components/modal';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { RadioButton } from '@components/radiobutton';
import { SimpleButton } from '@components/button';
import { SOURCE, Source } from '@constants/Onboarding';
import { DOCUMENT_TYPES, TAXS, UNIT_MEASUREMENTS as UNITS, ZERO } from '@constants/UtilsConstants';
import { MASSIVE_UPLOAD } from '@constants/Product';
import { ONE_BY_ONE, PRODUCT } from '@constants/AssembleProduct';
import { EDIT, METHOD_ADD, PRODUCT_DATABASE } from '@information-texts/ProductDatabase';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { currentDateInUnix } from '@utils/Date';
import { lengthEqualToZero } from '@utils/Length';
import { getRoute, getRouteName } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IGenericRecord } from '@models/GenericRecord';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import { DELETE_IMAGE, ProductDatabaseContext, UNIQUE_PRODUCT_INDEX } from '../context';
import {
    AddInventory,
    AddPriceAndCode,
    AddTaxes,
    BasicInformation,
    MassiveUpload,
    MIN_QUANTITY,
    SaleProduct,
} from './components';
import { AddImages } from './components/add-images';
import {
    IProductManagementProps,
    MAIN_UNITS,
    SERVICE,
    UNTAXED_TAX,
    addTypeOptions,
    classificationOptions,
    cleanData,
    hasEmptyProduct,
    routes,
} from '.';
import './ProductManagement.scss';

const ProductManagement: React.FC<IProductManagementProps> = ({ toggleShowCatalog, addTaxes }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { uniqueProduct } = useSelector((store: RootState) => store.productCatalog);

    const {
        data,
        setData,
        isUniqueProduct,
        toggleSection,
        sections,
        images,
        setValidate,
        closeSections,
        edit,
        productEdit,
        markedForDeletion,
        resetData,
    } = useContext(ProductDatabaseContext);

    const { massiveUpload: massiveData } = useSelector(({ assembleProduct }: RootState) => ({
        ...assembleProduct,
    }));

    useEffect(() => {
        if (addTaxes) {
            toggleSection('taxes');
        }
    }, [addTaxes]);

    useEffect(() => {
        if (uniqueProduct.editCarrousel) toggleSection('images');
    }, []);

    const [massiveUpload, setMassiveUpload] = useState(ONE_BY_ONE);
    const [classification, setClassification] = useState(PRODUCT);
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const [disabledInitialInventory, setDisabledInitialInventory] = useState(true);
    const [disabledTaxes, setDisabledTaxes] = useState(true);

    const { disabledInputs } = usePermissions();
    const { handlePostConfirmation: onboardingAction } = useOnboardingNavigation(localStorage[SOURCE] ?? Source.Website);

    useEffect(() => {
        setData({ ...data, is_product: classification === PRODUCT });
    }, [classification]);

    useEffect(() => {
        if (edit) {
            !productEdit.is_product && setClassification(SERVICE);
        }
    }, [edit]);

    useEffect(() => {
        (async (): Promise<void> => {
            await Promise.all([
                dispatch(getUtils([TAXS, MAIN_UNITS, UNITS, DOCUMENT_TYPES])),
                dispatch(getCategoryCatalog()),
                dispatch(getCompanyTaxes()),
            ]);
        })();
    }, []);

    useEffect(() => {
        const hasUnitValue = data.unique_products.filter((product: { unit_value: string }) => product.unit_value);
        setDisabledInitialInventory(data.name === '' || data.unit_measurement_id === null);
        setDisabledTaxes(lengthEqualToZero(hasUnitValue));
    }, [data]);

    const hasEmptyField = async (): Promise<void> => {
        const newImages = images.filter(image => image.file);
        let imagesDeleted = [];
        if (markedForDeletion.length) {
            imagesDeleted = productEdit.images[UNIQUE_PRODUCT_INDEX].bucket_details
                ?.filter((image: IGenericRecord) => markedForDeletion.includes(image.id))
                ?.map((obj: IGenericRecord) => ({ name: obj.file_original_name, file: {}, id: obj.id, action: DELETE_IMAGE }));
        }

        if (!isUniqueProduct) {
            const isEmptyField = hasEmptyProduct({ ...data }, 'withVariants');
            setValidate(isEmptyField);
            if (isEmptyField) return;

            !isEmptyField &&
                (await dispatch(
                    postProduct(
                        cleanData({
                            ...data,
                            images: [...data.images, ...imagesDeleted],
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            unique_products: data.unique_products.map(({ id, ...product }: IGenericRecord) => ({
                                ...(edit && { id }),
                                ...product,
                                sale_channel: data.sale_channel,
                            })),
                            date: currentDateInUnix(),
                        }),
                        newImages
                    )
                ));
            setShowModalSuccess(true);
            if (uniqueProduct.editCarrousel) {
                history.push(getRoute(Routes.WEBSITE_EDITOR));
                dispatch(setUniqueProduct([{ editCarrousel: false }]));
            }

            return;
        }

        if (uniqueProduct.editCarrousel) {
            history.push(getRoute(Routes.WEBSITE_EDITOR));
        }

        const isEmptyField = hasEmptyProduct(data, 'noVariants');

        setValidate(hasEmptyProduct(data, 'noVariants'));
        if (isEmptyField) return;
        !isEmptyField &&
            (await dispatch(
                postProduct(
                    cleanData({
                        ...data,
                        images: [...data.images, ...imagesDeleted],
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        unique_products: data.unique_products.map(({ id, ...product }: IGenericRecord) => ({
                            ...(edit && { id }),
                            ...product,
                            sale_channel: data.sale_channel,
                            reference: product.name,
                            batches: product.batches
                                ?.map((batch: IGenericRecord) => ({
                                    ...batch,
                                    warehouses: batch.warehouses?.filter(
                                        (warehouse: IGenericRecord) => warehouse.id && warehouse.quantity > MIN_QUANTITY
                                    ),
                                }))
                                ?.filter((batch: IGenericRecord) => batch.warehouses.length > MIN_QUANTITY),
                        })),
                        date: currentDateInUnix(),
                        tax_iva_id: data.tax_iva_id ? data.tax_iva_id : UNTAXED_TAX,
                    }),
                    newImages
                )
            ));
        setShowModalSuccess(true);
    };

    const sendMassiveData = async (): Promise<void> => {
        if (massiveData.errors.length) return;
        if (!massiveData.products?.length) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const success: any = await dispatch(
            postMassiveProducts(
                massiveData.products.map((product: IGenericRecord) => ({ ...product, date: currentDateInUnix() }))
            )
        );
        if (success) {
            setShowModalSuccess(!showModalSuccess);
            dispatch(setDataMassiveUpload([]));
        }
    };

    const showCatalog = (): void => {
        toggleShowCatalog();
        closeSections();
    };

    const toggleSuccessModal = (): void => setShowModalSuccess(!showModalSuccess);

    const handleSuccessConfirm = (): void => {
        setShowModalSuccess(!showModalSuccess);
        toggleShowCatalog();
    };

    const resetProductData = (): void => {
        resetData();
        setShowModalSuccess(false);
    };

    useEffect(() => {
        const body = document.querySelector('#bodyApp');
        const shouldScroll = sections.images || sections.inventory || sections.taxes;

        if (body && shouldScroll) body.scrollTo({ top: ZERO, behavior: 'smooth' });
    }, [sections.images, sections.inventory, sections.taxes]);

    const handlePostConfirmation = (): void => {
        if (localStorage[SOURCE]) return onboardingAction(handleSuccessConfirm);
        handleSuccessConfirm();
    };

    return (
        <div className="product-management">
            {sections.images ? (
                <AddImages isUniqueProduct={isUniqueProduct} setData={setData} showCatalog={showCatalog} />
            ) : sections.inventory ? (
                <AddInventory showCatalog={showCatalog} />
            ) : sections.taxes ? (
                <AddTaxes showCatalog={showCatalog} />
            ) : (
                <div>
                    <PageTitle title={getRouteName(Routes.DATABASE_MENU)} classTitle="text-base" />
                    <BreadCrumb routes={routes(toggleShowCatalog, edit)} />
                    <Information
                        title={edit ? EDIT.TITLE : PRODUCT_DATABASE.TITLE}
                        color="blue"
                        classNameTitle="product-management__title"
                        description={
                            edit ? PRODUCT_DATABASE.DESCRIPTION.replace('agregar', 'modificar') : PRODUCT_DATABASE.DESCRIPTION
                        }
                    />
                    <InformationBulb
                        tooltipClass="tooltip-product"
                        text={PRODUCT_DATABASE.QUESTION}
                        textDescription={PRODUCT_DATABASE.DESCRIPTION_POP_UP}
                    />
                    <div className="product-management__method-add">
                        <Information
                            title={METHOD_ADD.TITLE}
                            color="blue"
                            classNameTitle="mb-2"
                            description={METHOD_ADD.DESCRIPTION}
                        />
                        <RadioButton
                            moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                            classesLabel="product-management__input-add"
                            entities={addTypeOptions}
                            selected={massiveUpload}
                            classesContainer="mt-4.5"
                            setSelected={setMassiveUpload}
                            disabled={disabledInputs}
                            bgCircle="white"
                            classesRadioInput="border border-gray"
                        />
                    </div>
                    {massiveUpload === MASSIVE_UPLOAD ? (
                        <MassiveUpload />
                    ) : (
                        <>
                            <div className="product-management__method-add">
                                <Information title={METHOD_ADD.CLASSIFICATION} color="blue" classNameTitle="mb-2" />
                                <RadioButton
                                    moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                                    classesLabel="product-management__input-classification"
                                    entities={classificationOptions}
                                    selected={classification}
                                    classesContainer="mt-4.5"
                                    setSelected={setClassification}
                                    includeTooltip
                                    disabled={disabledInputs}
                                    bgCircle="white"
                                    classesRadioInput="border border-gray"
                                />
                            </div>
                            <BasicInformation unitMeasurement={data.unit_measurement_id} />
                            <AddPriceAndCode />
                            <div className="product-management__images-add">
                                <Information
                                    title="Imágenes"
                                    description="Agregue las imágenes del producto/servicio para que estas se visualicen en su catálogo de 
                                productos/servicios del módulo Sitio web y tienda diggital."
                                />
                                <SimpleButton
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                        submodule: 'images',
                                        action: ActionElementType.ADD,
                                        elementType: ElementType.BTN,
                                    })}
                                    className="product-management__images-button"
                                    onClick={(): void => {
                                        toggleSection('images');
                                    }}
                                    disabled={disabledInputs}
                                >
                                    <Icon name="addWhite" className="w-5 h-5" />
                                    Agregar Imagenes
                                </SimpleButton>
                            </div>
                            <div className={`${classification === SERVICE && 'hidden'} product-management__inventory-add`}>
                                <Information
                                    title="Inventario inicial"
                                    description="Agregue el valor del inventario inicial, esta información se requiere para poder empezar la contabilidad de sus movimientos de inventario."
                                />
                                <SimpleButton
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                        submodule: 'initial-inventory',
                                        action: ActionElementType.ADD,
                                        elementType: ElementType.BTN,
                                    })}
                                    className={`${
                                        disabledInitialInventory
                                            ? 'product-management__inventory-button-disabled'
                                            : 'product-management__inventory-button'
                                    }`}
                                    onClick={(): void => {
                                        toggleSection('inventory');
                                    }}
                                    disabled={disabledInitialInventory}
                                >
                                    <Icon name="addWhite" className="w-5 h-5" />
                                    Agregar inventario inicial
                                </SimpleButton>
                                {disabledInitialInventory && (
                                    <p className="mt-2 text-purple">*Agregue la información básica de su producto</p>
                                )}
                            </div>
                            <div className="product-management__add-taxes">
                                <Information
                                    title="Información para generar y transmitir documentos electrónicos"
                                    description={`${
                                        edit ? 'Edite ' : 'Agregue'
                                    } los impuestos que aplican a su producto/servicio para la generación y transmisión de documentos electrónicos`}
                                />
                                <SimpleButton
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                        submodule: 'edit-or-add-taxes',
                                        action: edit ? ActionElementType.EDIT : ActionElementType.ADD,
                                        elementType: ElementType.BTN,
                                    })}
                                    className={`${
                                        disabledTaxes
                                            ? 'product-management__inventory-button-disabled'
                                            : 'product-management__inventory-button'
                                    }`}
                                    onClick={(): void => {
                                        toggleSection('taxes');
                                    }}
                                    disabled={disabledTaxes}
                                >
                                    <Icon name="addWhite" className="w-5 h-5" />
                                    {edit ? 'Edite los  impuestos' : 'Agregar impuestos'}
                                </SimpleButton>
                                {disabledTaxes && <p className="mt-2 text-purple">*Agregue el valor unitario de venta</p>}
                            </div>
                            <SaleProduct data={data} setData={setData} />
                        </>
                    )}
                    <PageButtonsFooter
                        moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                        disabledRight={disabledInputs}
                        titleButtonLeft={TitleButtons.BACK}
                        onClickButtonLeft={(): void => {
                            dispatch(setUniqueProduct([{ editCarrousel: false }]));
                            toggleShowCatalog();
                        }}
                        titleButtonRight={TitleButtons.SAVE}
                        onClickButtonRight={(): Promise<void> =>
                            massiveUpload === MASSIVE_UPLOAD ? sendMassiveData() : hasEmptyField()
                        }
                    />
                </div>
            )}
            {showModalSuccess && (
                <ModalType
                    moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                    iconName="checkMulticolor"
                    open
                    handleClosed={toggleSuccessModal}
                    finalAction={handlePostConfirmation}
                    otherButton={{ textButton: 'Agregar otro producto/servicio', onClick: resetProductData }}
                />
            )}
        </div>
    );
};

export default ProductManagement;
