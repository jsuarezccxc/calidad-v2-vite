import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonType } from '@components/button';
import { Switch } from '@components/switch';
import {
    IOptionSelect,
    ImageInput,
    MultiSelectInput,
    SelectInput,
    SelectSearchInput,
    TextArea,
    TextInput,
} from '@components/input';
import { Form } from '@components/form';
import { Modal } from '@components/modal';
import { Icon } from '@components/icon';
import { SingleCheckBox } from '@components/checkbox';
import { IMAGE_WEIGHT_ERROR } from '@constants/WebsiteNode';
import { ZERO } from '@constants/UtilsConstants';
import { Routes } from '@constants/Paths';
import { ONE } from '@constants/Numbers';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption, ElementType } from '@models/WebsiteNode';
import { RootState } from '@redux/rootReducer';
import { getCatalogWebsite, getUniqueProduct, getUniqueProductDetail } from '@redux/product-catalog/actions';
import { createProductOptions } from '@utils/WebsiteNode';
import { buildOptions } from '@utils/Company';
import { getProductData } from '@utils/WebsiteNode';
import { getRoute } from '@utils/Paths';
import { formatMoney } from '@utils/Decimals';
import { generateId, ModuleApp, ActionElementType, ElementType as ElementTypeId } from '@utils/GenerateId';
import useImage from '@hooks/useImage';
import { INFORMATION } from '@information-texts/WebsiteEditor';
import { IImageModalProps, DEFAULT_IMAGE, IImage, MAX_IMAGE_CAROUSEL } from '.';

export const ImageModal: React.FC<IImageModalProps> = ({
    elementOption,
    image,
    saveImage,
    toggleModal,
    updateImage,
    handleImageFifteen,
    dataCarouselFifteen,
    handleCarouselFifteen,
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        catalogWebsite: { data: catalog },
    } = useSelector((state: RootState) => state.productCatalog);
    const { selectedWebsite } = useSelector((state: RootState) => state.websiteNode);
    const { fifteenCarouselImages, checkedCategory } = dataCarouselFifteen;

    const { sizeError, getImageUrl } = useImage();
    const [validate, setValidate] = useState<boolean>(false);
    const [isRedirectImage, setIsRedirectImage] = useState(false);
    const [productIdEmptyImage, setProductIdEmptyImage] = useState('');
    const [imagesProduct, setImagesProduct] = useState<IOptionSelect[]>([]);
    const [currentProductSelect, setCurrentProductSelect] = useState({});
    const [valueProductName, setValueProductName] = useState({ product: '', image: '' });

    const { isProduct, number, title, description, showProductData = false, productName, productValue, src } = image;
    const productOptions = useMemo(() => createProductOptions(catalog), [catalog]);

    const pageOptions = useMemo(
        () => buildOptions(selectedWebsite?.pages.map(page => ({ ...page, name: page?.tab_name, type: 'page' }))),
        [selectedWebsite]
    );

    const resetData = (): void => {
        setValidate(false);
        updateImage(DEFAULT_IMAGE);
        toggleModal();
    };

    const sendForm = (e: FormEvent): void => {
        e.preventDefault();
        if (elementOption !== ElementOption.Five && !(isProduct ? productName : src)) return setValidate(true);

        saveImage();
        resetData();
    };

    const selectProduct = async (option: IGenericRecord, initial = false): Promise<void> => {
        setValidate(false);
        const response: IGenericRecord = await dispatch(getUniqueProduct(option?.productId));
        if (response?.variants) {
            setValueProductName({ ...valueProductName, product: response?.name, image: initial ? image.nameImage || '' : '' });
            const imagesArr = response?.variants.find((variant: IGenericRecord) => variant?.variants === response?.name)
                ?.unique_product_images;

            if (imagesArr?.length > ZERO) {
                setImagesProduct(
                    imagesArr.map((image: IGenericRecord, idx: number) => ({
                        ...image,
                        key: image?.id,
                        value: `Imagen ${idx + ONE}`,
                        valueText: image.src,
                    }))
                );
                setCurrentProductSelect({
                    ...image,
                    ...getProductData(option as IOptionSelect, productOptions),
                    productId: option?.productId,
                });
                setIsRedirectImage(false);
            } else {
                setProductIdEmptyImage(option?.productId);
                setIsRedirectImage(true);
                return;
            }
        }
    };

    const selectImage = (optionImage: IGenericRecord): void => {
        updateImage({ ...currentProductSelect, src: optionImage?.url, nameImage: optionImage?.value } as IImage);
        setValueProductName({ ...valueProductName, image: optionImage?.value });
        setValidate(false);
    };

    useEffect(() => {
        dispatch(getCatalogWebsite(true));
    }, []);

    const redirectEditProduct = async (): Promise<void> => {
        await dispatch(getUniqueProductDetail(productIdEmptyImage, true));
        history.push(getRoute(Routes.PRODUCT_DATABASE));
    };

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const validateSelect = (e: MouseEvent): void => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setValidate(true);
            }
        };
        document.addEventListener('mousedown', validateSelect);
    }, []);

    useEffect(() => {
        if (isProduct && image?.productId) {
            setValueProductName({ ...valueProductName, product: productName || '', image: image?.nameImage || '' });
            const optionProductSelect = productOptions.find(item => item?.id === image?.productId);
            selectProduct(optionProductSelect || {}, true);
        }
    }, [isProduct]);

    const getPageIsCatalog = (idPage: string): boolean => {
        return (
            selectedWebsite.pages.find(item => item.id === idPage)?.elements?.some(item => item.type === ElementType.Catalog) ||
            false
        );
    };

    const getClassInput = (src = ''): IGenericRecord => {
        return {
            classContainerImage: src ? 'image-modal__content-file-has-image' : 'image-modal__content-file',
            classInputImage: src ? 'justify-center' : 'image-modal__input',
        };
    };

    const titleModal = elementOption === ElementOption.Five ? 'Carrusel 5' : `Imagen ${number}`;
    const descriptionModal =
        elementOption === ElementOption.Five
            ? INFORMATION.MODAL_FIVE_CAROUSEL
            : ' Agrega la información correspondiente para la imagen del carrusel.';

    const classTextAlign = elementOption === ElementOption.Five ? 'text-left' : 'text-center';
    const nameButtonSave = elementOption === ElementOption.Five ? 'Siguiente' : 'Guardar';

    const productOptionsRender = productOptions.map(item => ({ ...item, name: item.value }));

    return (
        <>
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-image`,
                    action: ActionElementType.INFO,
                    elementType: ElementTypeId.MDL,
                })}
                modalClassName="image-modal"
                open
                handleClose={toggleModal}
            >
                <Form className={`image-modal__content image-modal__content-${elementOption}`} sendWithEnter>
                    <h2 className="mb-2 text-xl text-center font-allerbold text-blue">{titleModal}</h2>
                    <p className={`mb-2 text-gray-dark ${classTextAlign}`}>{descriptionModal}</p>
                    {elementOption !== ElementOption.Five && (
                        <Switch
                            checked={isProduct}
                            handleChange={({ target }): void =>
                                updateImage({
                                    ...DEFAULT_IMAGE,
                                    isProduct: target.checked,
                                    number,
                                    id: image.id,
                                    edited: image.edited,
                                })
                            }
                            labelText="¿La imagen es un producto de su catálogo?"
                        />
                    )}

                    <div className="flex flex-col gap-2 mt-2">
                        {elementOption !== ElementOption.Five && (
                            <>
                                {isProduct ? (
                                    <>
                                        <div ref={ref}>
                                            <SelectSearchInput
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementTypeId.DRP,
                                                })}
                                                labelText="*Producto/servicio:"
                                                optionSelect={productOptionsRender}
                                                onChangeSelect={(_, option): void => {
                                                    selectProduct(option);
                                                }}
                                                classesWrapper="w-full"
                                                required={validate && !valueProductName.product}
                                                valueSelect={valueProductName.product}
                                            />
                                        </div>

                                        {isRedirectImage && (
                                            <>
                                                <span className="font-aller text-xtiny text-gray-dark">
                                                    *Este producto no cuenta con imágenes, agregue una imagen a su producto para
                                                    que se visualice en el carrusel.
                                                </span>
                                                <p
                                                    onClick={redirectEditProduct}
                                                    className="underline cursor-pointer text-green font-aller text-tiny"
                                                >
                                                    + Agregar imagen
                                                </p>
                                            </>
                                        )}
                                        {(imagesProduct.length > ZERO || !!valueProductName.image) && (
                                            <SelectInput
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service-image`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementTypeId.DRP,
                                                })}
                                                labelText="*Seleccione la imagen:"
                                                options={imagesProduct}
                                                optionSelected={(optionImage): void => {
                                                    selectImage(optionImage);
                                                }}
                                                required={validate && !valueProductName.image}
                                                value={valueProductName.image}
                                            />
                                        )}
                                        <Switch
                                            checked={showProductData}
                                            handleChange={({ target }): void =>
                                                updateImage({ ...image, showProductData: target.checked })
                                            }
                                            labelText="¿Visualizar el nombre y valor unitario del producto/servicio?"
                                        />
                                    </>
                                ) : (
                                    <ImageInput
                                        id={generateId({
                                            module: ModuleApp.WEBSITE,
                                            submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service-image`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementTypeId.UPL,
                                        })}
                                        customHandleChangeImage={async (e): Promise<void> =>
                                            updateImage({ ...image, src: (await getImageUrl(e)) || src })
                                        }
                                        image={image}
                                        cleanImage={(): void => updateImage({ ...image, src: '' })}
                                        labelText={`*Imagen ${number}:`}
                                        name="src"
                                        required={sizeError || (validate && !src)}
                                        isRequiredWithImage={sizeError}
                                        {...(sizeError && { requiredText: IMAGE_WEIGHT_ERROR })}
                                        classesWrapper={getClassInput(src).classContainerImage}
                                        classesInput={getClassInput(src).classInputImage}
                                        classNameFiles="image-modal__file"
                                        classesLabel="text-start block"
                                    />
                                )}
                            </>
                        )}

                        {elementOption === ElementOption.Five && (
                            <div className="overflow-y-auto max-h-96 bg-green-scrollbar">
                                <Icon
                                    id={generateId({
                                        module: ModuleApp.WEBSITE,
                                        submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service-image`,
                                        action: ActionElementType.DELETE,
                                        elementType: ElementTypeId.ICO,
                                    })}
                                    name="trashBlue"
                                    hoverIcon="trashGreen"
                                    onClick={(): void => handleCarouselFifteen('deleteItem')}
                                    className="ml-auto"
                                />
                                {fifteenCarouselImages.map((item, index) => (
                                    <div key={item.id} className="flex flex-col mb-4">
                                        <SingleCheckBox
                                            checked={checkedCategory.includes(item.id)}
                                            className="mb-0.5"
                                            handleChange={(): void => handleCarouselFifteen('deleteImage', item.id)}
                                            labelText={`*Imagen ${index + 1}:`}
                                        />
                                        <ImageInput
                                            id={generateId({
                                                module: ModuleApp.WEBSITE,
                                                submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service-image`,
                                                action: ActionElementType.INPUT,
                                                elementType: ElementTypeId.UPL,
                                            })}
                                            customHandleChangeImage={async (e): Promise<void> =>
                                                updateImage({ ...image, src: (await getImageUrl(e)) || src, id: item.id })
                                            }
                                            image={item}
                                            name="src"
                                            required={sizeError || (validate && !src)}
                                            isRequiredWithImage={sizeError}
                                            {...(sizeError && { requiredText: IMAGE_WEIGHT_ERROR })}
                                            classesWrapper={getClassInput(item.src).classContainerImage}
                                            classesInput={getClassInput(item.src).classInputImage}
                                            classNameFiles="image-modal__file ml-4"
                                            classesLabel="text-start block"
                                        />
                                        <div className="flex gap-4.5 mt-4 ml-4">
                                            <SelectInput
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-url-redirect`,
                                                    action: ActionElementType.INPUT,
                                                    elementType: ElementTypeId.DRP,
                                                })}
                                                labelText="Página a la que dirige:"
                                                options={pageOptions}
                                                optionSelected={(option): void => handleImageFifteen(option, item.id)}
                                                value={item?.page?.value}
                                                classesWrapper="w-1/2"
                                            />
                                            {getPageIsCatalog(item?.page?.id || '') && (
                                                <MultiSelectInput
                                                    id={generateId({
                                                        module: ModuleApp.WEBSITE,
                                                        submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-category-filter`,
                                                        action: ActionElementType.INPUT,
                                                        elementType: ElementTypeId.DRP,
                                                    })}
                                                    classesWrapper="w-1/2"
                                                    name="category"
                                                    labelText="Filtro de categorias:"
                                                    placeholder="Seleccionar"
                                                    classListSelect
                                                    options={item.optionCategories}
                                                    isNewSelect
                                                    optionSelected={(option): void => handleImageFifteen(option, item.id)}
                                                    valueSelect={item.categories}
                                                    value={item?.categoryCatalog}
                                                    selectIconType="arrowDownGreen"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {fifteenCarouselImages.length < MAX_IMAGE_CAROUSEL && (
                                    <p
                                        onClick={(): void => handleCarouselFifteen('addImage')}
                                        className="mt-4 underline cursor-pointer text-green font-aller text-tiny"
                                    >
                                        + Agregar imagen
                                    </p>
                                )}
                            </div>
                        )}
                        {elementOption !== ElementOption.Five && (
                            <>
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.WEBSITE,
                                        submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service-name`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementTypeId.TXT,
                                    })}
                                    classesWrapperInput={showProductData ? 'image-modal__input--disabled' : ''}
                                    classesWrapper="w-full"
                                    labelText={showProductData ? 'Nombre producto/servicio:' : 'Título de la imagen:'}
                                    onChange={({ target }): void => updateImage({ ...image, title: target.value })}
                                    name="title"
                                    placeholder="..."
                                    value={showProductData ? productName : title}
                                    disabled={showProductData}
                                />
                                <TextArea
                                    id={generateId({
                                        module: ModuleApp.WEBSITE,
                                        submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service-value`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementTypeId.TXT,
                                    })}
                                    classesInput={showProductData ? 'image-modal__input--disabled' : ''}
                                    onChange={({ target }): void => updateImage({ ...image, description: target.value })}
                                    labelText={
                                        showProductData ? 'Valor unitario productos/servicios:' : 'Descripción de la imagen:'
                                    }
                                    name="description"
                                    placeholder="..."
                                    value={showProductData ? formatMoney(productValue ?? '') : description}
                                    rows={showProductData ? 1 : 4}
                                    disabled={showProductData}
                                />
                            </>
                        )}
                    </div>
                    <div className="flex justify-end mt-4.5 gap-5.5">
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service-image`,
                                action: ActionElementType.BACK,
                                elementType: ElementTypeId.BTN,
                            })}
                            onClick={toggleModal}
                            text="Atrás"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-product-service-image`,
                                action: ActionElementType.SAVE,
                                elementType: ElementTypeId.BTN,
                            })}
                            onClick={sendForm}
                            text={nameButtonSave}
                            type={ButtonType.Submit}
                        />
                    </div>
                </Form>
            </Modal>
        </>
    );
};
