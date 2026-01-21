import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { ProductDatabaseContext } from '@pages/product-database/context';
import { ADD_IMAGES } from '@information-texts/ProductDatabase';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { IGenericRecord } from '@models/GenericRecord';
import { ModalCustom } from '@components/modal-custom';
import { ChangeEvent } from '@components/radiobutton';
import { Information } from '@components/information';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { ImageInput } from '@components/input';
import { Cropper } from '@components/cropper';
import { Button } from '@components/button';
import { getRouteName } from '@utils/Paths';
import { createImage } from '@utils/File';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { ZERO } from '@constants/UtilsConstants';
import { VariantsTable } from './components';
import { SelectedImage } from './components/SelectedImage';
import { routes } from '.';
import './AddImages.scss';

export const AddImages: React.FC<IGenericRecord> = ({ setData, showCatalog }) => {
    const { data, toggleSection, images, setImages, selectedImages, setSelectedImages, deleteImage } = useContext(
        ProductDatabaseContext
    );

    const [cropperModal, setCropperModal] = useState<boolean>(false);
    const [editCurrentImg, setEditCurrentImg] = useState<IGenericRecord | null>(null);
    const [showModalPreview, setShowModalPreview] = useState({
        show: false,
        url: '',
    });

    useEffect(() => {
        includesImages();
    }, [selectedImages]);

    const includesImages = (): void => {
        const newData = data.unique_products.map((product: IGenericRecord) =>
            selectedImages[product.id] ? { ...product, images: selectedImages[product.id] } : product
        );

        setData({ ...data, unique_products: newData });
    };

    const handleChangeImage = ({ target }: ChangeEvent): void => {
        if (target.files) {
            const newImage = target.files[0];
            const currentImage = { file: newImage, name: newImage.name, url: createImage(newImage), id: uuid() };
            setImages([...images, { ...currentImage }]);
        }
    };

    const selectMainImageTable = (referenceId: string, imageId: string): void => {
        const newData = data.unique_products.map((product: IGenericRecord) => ({
            ...product,
            bucket_details_main_id:
                product.id === referenceId ? (product.main_image === imageId ? '' : imageId) : product.bucket_details_main_id,
        }));

        setData({ ...data, unique_products: newData });
    };

    const handleShowCropper = (image?: IGenericRecord): void => {
        setCropperModal(!cropperModal);
        if (image) {
            setEditCurrentImg(image);
        }
    };

    const selectDefaultImageproduct = (): void => {
        const productsWithDefaultImage = data.unique_products.map((product: IGenericRecord) => ({
            ...product,
            bucket_details_main_id: !product.bucket_details_main_id ? images[ZERO]?.id : product.bucket_details_main_id,
        }));

        setData({ ...data, unique_products: productsWithDefaultImage });
    };

    const handleGetCroppedImage = (imageCropped: File): void => {
        if (!imageCropped && !editCurrentImg) return;
        const existImage = images?.find(element => element.id === editCurrentImg?.id) || null;

        existImage?.edit
            ? setImages(
                  images.map(image =>
                      image.id === existImage.id
                          ? { file: image, name: image.name, url: createImage(imageCropped) }
                          : { ...image }
                  )
              )
            : setImages([...images, { file: imageCropped, name: imageCropped.name, url: createImage(imageCropped), id: uuid() }]);
        setEditCurrentImg(null);
        return;
    };

    const editImage = (file: IGenericRecord): void => {
        const currentImage = {
            ...file,
            edit: true,
        };
        handleShowCropper(currentImage);
    };

    return (
        <>
            <div className="add-image">
                <Cropper
                    url={editCurrentImg?.url}
                    name={editCurrentImg?.name}
                    getImageCropped={handleGetCroppedImage}
                    openModal={cropperModal}
                    handleModal={(): void => handleShowCropper()}
                />
                <ModalCustom
                    id={generateId({
                        module: ModuleApp.MODALS,
                        submodule: 'product-service-database-images',
                        action: ActionElementType.ADD,
                        elementType: ElementType.MDL,
                    })}
                    show={showModalPreview.show}
                    showModal={(): void => setShowModalPreview({ show: false, url: '' })}
                >
                    <h4 className="text-xl text-center font-allerbold text-blue mb-2.5 leading-snug">Previsualización</h4>
                    <div
                        className="relative items-center inline-block w-10 h-10 gap-1 product-management__render-preview"
                        style={{ backgroundImage: `url(${showModalPreview.url})` }}
                    ></div>
                    <Button
                        id={generateId({
                            module: ModuleApp.MODALS,
                            submodule: 'product-service-database-images',
                            action: ActionElementType.CLOSE,
                            elementType: ElementType.BTN,
                        })}
                        text="Cerrar"
                        onClick={(): void => setShowModalPreview({ show: false, url: '' })}
                        classes="mt-7 m-auto"
                    />
                </ModalCustom>
                <PageTitle title={getRouteName(Routes.DATABASE_MENU)} classTitle="text-base" />
                <BreadCrumb routes={routes(showCatalog, (): void => toggleSection('images'))} />
                <Information title={ADD_IMAGES.TITLE} color="blue" classNameTitle="product-management__title" />
                <div className="product-management__add-images">
                    <Information
                        title={'Agregue las imágenes a su producto/servicio'}
                        color="blue"
                        classNameTitle="product-management__sub-title"
                        customText={ADD_IMAGES.DESCRIPTION}
                        isList
                    />
                    <div className="flex flex-wrap w-full gap-7 mr-7">
                        {images?.map((image: IGenericRecord, index: number) => (
                            <SelectedImage
                                id={generateId({
                                    module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                    submodule: 'database-images-selected',
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.DRP,
                                })}
                                key={`image${index}`}
                                imageNumber={index + 1}
                                productImage={image}
                                deleteImage={(): void => deleteImage(image.id)}
                                editImage={(): void => editImage(image)}
                                previewImage={(): void => setShowModalPreview({ show: true, url: image.url })}
                            />
                        ))}
                        <ImageInput
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES,
                                submodule: 'database-images',
                                action: ActionElementType.UPLOAD,
                                elementType: ElementType.TXT,
                            })}
                            placeholder="+ Agregar imagen"
                            classIcon="hidden"
                            placeholderClass="text-green underline"
                            classesInput={`catalogue__render-image cursor-pointer ${images.length ? 'mt-4.4' : 'mt-6.25'}`}
                            customHandleChangeImage={(e): void => {
                                handleChangeImage(e);
                            }}
                            classesWrapper="product-management__input-images"
                            classesLabel="hidden"
                        />
                    </div>
                </div>

                <div className="product-management__add-images">
                    <Information
                        title="Asignación de imagenes"
                        color="blue"
                        classNameTitle="product-management__sub-title"
                        customText={ADD_IMAGES.DESCRIPTION_VARIANTS}
                        isList
                        classNameContainer="mb-4.5"
                    />
                    <VariantsTable
                        variants={data.unique_products}
                        images={images}
                        setSelectedImages={setSelectedImages}
                        selectedImages={selectedImages}
                        selectMainImageTable={selectMainImageTable}
                    />
                </div>
            </div>
            <PageButtonsFooter
                moduleId={ModuleApp.TECHNICAL_SHEET_PRODUCTS_SERVICES}
                titleButtonLeft="Atras"
                onClickButtonLeft={(): void => {
                    toggleSection('images');
                    selectDefaultImageproduct();
                }}
            />
        </>
    );
};
