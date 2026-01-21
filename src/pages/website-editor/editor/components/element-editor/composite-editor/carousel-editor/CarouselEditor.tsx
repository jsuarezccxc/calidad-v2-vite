import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { THREE } from '@constants/Numbers';
import { SimpleButton } from '@components/button';
import { ColorPicker } from '@components/color-picker';
import { Cropper as CropperModal } from '@components/cropper';
import { IOptionSelect } from '@components/input';
import useModal from '@hooks/useModal';
import useImage from '@hooks/useImage';
import useCropper from '@hooks/useCropper';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { ElementOption, ElementType } from '@models/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { generateId, ModuleApp, ActionElementType, ElementType as ElementTypeId } from '@utils/GenerateId';
import { ItemField, TextFields } from '../components';
import {
    IButton,
    ImageModal,
    IImage,
    DEFAULT_BUTTON,
    DEFAULT_IMAGE,
    IMAGES,
    CAROUSELS_WITH_BACKGROUND,
    ButtonModal,
    DEFAULT_CONTENT,
    MODALS,
    ActiveModal,
    getInputTexts,
    MaxMinSelect,
    FunctionImages,
    TypeInput,
} from '.';
import './CarouselEditor.scss';

export const CarouselEditor: React.FC = () => {
    const { categories } = useSelector((state: RootState) => state.productCatalog);

    const { handleStyleChange, handleSettingChange, selectedElement } = useContext(ElementsContext);
    const { styleKey } = useContext(ScreensContext);
    const { getImageUrlByFile } = useImage();
    const [button, setButton] = useState<IButton>(DEFAULT_BUTTON);
    const [image, setImage] = useState<IImage>(DEFAULT_IMAGE);
    const [currentTypeModal, setCurrentTypeModal] = useState<string | null>(null);
    const [content, setContent] = useState<IGenericRecord | null>(null);
    const { activeModal, toggleModal } = useModal(MODALS);
    const { getSizeCropperArea } = useCropper();
    const [carouselFiveImages, setCarouselFiveImages] = useState<IImage[]>([]);
    const [optionCategories, setOptionCategories] = useState<IOptionSelect[]>([]);
    const [checkedCategory, setCheckedCategory] = useState<string[]>([]);

    const { Image, Button, Cropper } = ActiveModal;

    const images: IImage[] = selectedElement?.setting?.[IMAGES] ?? [];
    const buttons: IImage[] = selectedElement?.setting?.buttons ?? [];

    const [option, style] = [selectedElement?.option ?? ElementOption.One, selectedElement?.[styleKey]];

    const addButton = (): void => {
        setButton({ ...button, id: v4(), number: buttons.length + 1, contents: [{ ...DEFAULT_CONTENT, id: v4() }] });
        toggleModal(Button);
    };

    const addImage = (): void => {
        setImage({ ...DEFAULT_IMAGE, number: images.length + 1, id: v4() });
        toggleModal(Image);
    };

    const deleteButton = (id: string): void => {
        handleSettingChange({ name: 'buttons', value: buttons.filter(button => button.id !== id) });
    };

    const deleteImage = (id: string): void => {
        if (option === ElementOption.Five) {
            handleSettingChange({ name: IMAGES, value: [] });
            setCarouselFiveImages([{ ...DEFAULT_IMAGE, id: v4(), optionCategories }]);
            return;
        }
        handleSettingChange({ name: IMAGES, value: images.filter(image => image.id !== id) });
    };

    const saveButton = (): void => {
        const newButtons = button.edited ? buttons.map(item => (item.id === button.id ? button : item)) : [...buttons, button];
        handleSettingChange({ name: 'buttons', value: newButtons });
        setButton(DEFAULT_BUTTON);
        closeModal();
    };

    const saveImage = (): void => {
        const newImages = image.edited ? images.map(item => (item.id === image.id ? image : item)) : [...images, image];
        if (option === ElementOption.Five) {
            handleSettingChange({ name: IMAGES, value: carouselFiveImages });
            closeModal();
            return;
        }
        handleSettingChange({ name: IMAGES, value: newImages });
        setImage(DEFAULT_IMAGE);
        closeModal();
    };

    const selectImageToEdit = (image: IImage): void => {
        setImage({ ...image, edited: true });
        toggleModal(Image);
    };

    const selectButtonToEdit = (button: IButton): void => {
        setButton({ ...button, edited: true });
        toggleModal(Button);
    };

    const closeModal = (): void => {
        toggleModal('');
        setButton(DEFAULT_BUTTON);
        setImage(DEFAULT_IMAGE);
    };

    useEffect(() => {
        if (categories.length) {
            const valueOption: IOptionSelect[] = [];
            categories.forEach((category: IGenericRecord, index: number) => {
                if (category.quantity) {
                    valueOption.push({
                        key: `${index}`,
                        value: category?.name ?? '',
                        id: category?.id ?? '',
                        multiSelectCheck: { value: false },
                        type: TypeInput.Category,
                    });
                }
            });
            setOptionCategories(valueOption);
        }
    }, [categories]);

    const updateButton = (currentButton: IButton, content?: IGenericRecord): void => {
        const currentContentButton = button?.contents?.find(current => current.id === content?.id);
        const updatedContentButton = currentButton?.contents?.find(updated => updated.id === content?.id);

        setCurrentTypeModal(Button);
        setButton(currentButton);
        setContent(content || null);

        if (
            updatedContentButton?.src !== currentContentButton?.src ||
            (updatedContentButton?.isProduct &&
                updatedContentButton?.src &&
                updatedContentButton?.src !== currentContentButton?.src)
        ) {
            toggleModal(Cropper);
        }
    };

    const updateImage = (newImage: IImage): void => {
        setCurrentTypeModal(Image);
        setImage(newImage);
        if ((image.src !== newImage.src && newImage.src) || (newImage.isProduct && newImage.src && image.src !== newImage.src)) {
            toggleModal(Cropper);
        }
    };

    const handleGetCroppedImage = async (imageCropped: File): Promise<void> => {
        if (currentTypeModal === Image) {
            setImage({
                ...image,
                src: (await getImageUrlByFile(imageCropped)) || image.src,
            });
            return;
        } else {
            const newContents =
                button?.contents?.map(async element =>
                    element.id === content?.id
                        ? { ...element, src: (await getImageUrlByFile(imageCropped)) || element?.src }
                        : { ...element }
                ) || [];

            const newButton = {
                ...button,
                contents: await Promise.all(newContents),
            };

            setButton(newButton);
            setContent(null);
            return;
        }
    };

    const handleSelectPage = (option: IOptionSelect, id: string): void => {
        if (option.type === TypeInput.Page) {
            setCarouselFiveImages(
                carouselFiveImages.map(item =>
                    item.id === id
                        ? {
                              ...item,
                              page: { value: option.value, id: option.id || '' },
                          }
                        : item
                )
            );
            return;
        }

        if (option.type === TypeInput.Category) {
            const valueSelectCategoryImages =
                carouselFiveImages.find(item => item.id === id)?.categories.filter(item => item !== option.id) || [];

            setCarouselFiveImages(
                carouselFiveImages.map(item => {
                    if (item.id === id) {
                        const selectCategory = item.optionCategories?.map(item =>
                            option.key === item.key
                                ? { ...item, multiSelectCheck: { value: !item.multiSelectCheck?.value } }
                                : item
                        );

                        const valueCategories = item.categories.includes(option.id || '')
                            ? valueSelectCategoryImages
                            : [...item.categories, option.id || ''];

                        const valueCategory: string[] = [];
                        item.optionCategories?.forEach(opt => {
                            if (valueCategories.includes(opt.id || '')) {
                                valueCategory.push(opt.value);
                            }
                        });

                        return {
                            ...item,
                            categories: valueCategories,
                            categoryCatalog: `${valueCategory.join(', ').slice(MaxMinSelect.MinSelect, MaxMinSelect.MaxSelect)}${
                                valueCategory.join(', ').length > MaxMinSelect.MaxSelect ? '...' : ''
                            }`,
                            optionCategories: selectCategory,
                        };
                    }
                    return item;
                })
            );
        }
    };

    useEffect(() => {
        option === ElementOption.Five && images.length && setCarouselFiveImages(images);
    }, [images, selectedElement]);

    useEffect(() => {
        option === ElementOption.Five && handleImageCategories(image, image?.id);
    }, [image]);

    useEffect(() => {
        option === ElementOption.Five && !carouselFiveImages.length && optionCategories.length && addNewImage();
    }, [optionCategories]);

    const handleImageCategories = (newImage: IGenericRecord, id: string): void => {
        setCarouselFiveImages(carouselFiveImages.map(item => (item.id === id ? { ...item, src: newImage.src } : item)));
    };

    const handleDeleteImage = (id: string): void => {
        const filterDelete = checkedCategory.filter(item => item !== id);
        setCheckedCategory(filterDelete.length < checkedCategory.length ? filterDelete : [...checkedCategory, id]);
    };

    const handleDeleteItem = (): void => {
        const deleteItem = carouselFiveImages.filter(item => !checkedCategory.includes(item.id));
        setCarouselFiveImages(!deleteItem.length ? [DEFAULT_IMAGE] : deleteItem);
    };

    const addNewImage = (): void => {
        setCarouselFiveImages([...carouselFiveImages, { ...DEFAULT_IMAGE, id: v4(), optionCategories }]);
    };

    const handleCarouselFive = (option: string, id = ''): void => {
        if (option === FunctionImages.AddImage) return addNewImage();
        if (option === FunctionImages.DeleteItem) return handleDeleteItem();
        if (option === FunctionImages.DeleteImage) return handleDeleteImage(id);
    };

    const hasBackground = CAROUSELS_WITH_BACKGROUND.includes(option);
    const isButtonCarousel = selectedElement?.option === ElementOption.Four;
    const currentCarrousel = selectedElement?.type === ElementType.Carousel ? selectedElement : null;
    const { description, title } = getInputTexts(option, hasBackground);
    const textButton = option === ElementOption.Five ? 'Fondo botón' : ' Fondo';
    const carouselFiveEdit = !!selectedElement?.setting?.images.length && option === ElementOption.Five;

    return (
        <div className="carousel-editor pt-4.5">
            <h2 className="composite-editor__title">{isButtonCarousel ? 'Botones' : 'Imágenes'}</h2>
            <div className="flex flex-col gap-2 mt-2">
                {option === ElementOption.Five && carouselFiveEdit ? (
                    <ItemField
                        deleteItem={(): void => deleteImage('')}
                        editItem={(): void => addImage()}
                        item={{}}
                        index={-1}
                        text="Carrusel 5"
                    />
                ) : (
                    <>
                        {images.map((image, index) => (
                            <ItemField
                                deleteItem={deleteImage}
                                editItem={selectImageToEdit}
                                index={index}
                                item={image}
                                key={index}
                                text="Imagen"
                            />
                        ))}
                        {buttons.map((item, index) => (
                            <ItemField
                                key={item.id}
                                deleteItem={deleteButton}
                                editItem={selectButtonToEdit}
                                item={item}
                                index={index}
                            />
                        ))}
                    </>
                )}
            </div>
            {((option !== ElementOption.Five && buttons.length < THREE) || !carouselFiveEdit) && (
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-composite-element-carousel-btn-image',
                        action: ActionElementType.ADD,
                        elementType: ElementTypeId.BTN,
                    })}
                    className={`composite-editor__link ${option === ElementOption.Five ? 'mt-2' : 'mt-4.5'}`}
                    onClick={isButtonCarousel ? addButton : addImage}
                >
                    + Agregar {isButtonCarousel ? 'botón' : 'imagen'}
                </SimpleButton>
            )}
            {option === ElementOption.Four && (
                <>
                    <TextFields item="buttons" labelText="Título botones" wrapperClassName="mt-4.5" />
                    <ColorPicker
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'editor-composite-element-carousel-btn-background',
                            action: ActionElementType.INPUT,
                            elementType: ElementTypeId.TXT,
                        })}
                        labelText="Fondo botones"
                        handleChange={(value): void => handleStyleChange({ item: 'buttons', name: 'background', value })}
                        value={style?.buttons?.background}
                        wrapperClassName="mt-4.5"
                    />
                </>
            )}
            {option !== ElementOption.Five && (
                <>
                    <h3 className="mt-4.5 mb-2 composite-editor__title">Contenido</h3>
                    <TextFields item="title" labelText={title} wrapperClassName="mb-2" />
                </>
            )}
            {hasBackground && option !== ElementOption.Five ? (
                <ColorPicker
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: 'editor-composite-element-carousel-background',
                        action: ActionElementType.INPUT,
                        elementType: ElementTypeId.TXT,
                    })}
                    labelText={textButton}
                    handleChange={(value): void => handleStyleChange({ item: 'card', name: 'background', value })}
                    value={style?.card?.background}
                    wrapperClassName="mt-4.5"
                />
            ) : (
                option !== ElementOption.Five && <TextFields item="description" labelText={description} />
            )}
            {activeModal === Image && (
                <ImageModal
                    elementOption={option}
                    image={image}
                    saveImage={saveImage}
                    toggleModal={closeModal}
                    updateImage={updateImage}
                    handleImageFifteen={handleSelectPage}
                    dataCarouselFifteen={{ fifteenCarouselImages: carouselFiveImages, checkedCategory }}
                    handleCarouselFifteen={handleCarouselFive}
                />
            )}
            {activeModal === Cropper && (
                <CropperModal
                    url={currentTypeModal === Image ? image?.src : content?.src}
                    openModal={activeModal === Cropper}
                    handleModal={(): void => toggleModal(currentTypeModal === Image ? Image : Button)}
                    getImageCropped={handleGetCroppedImage}
                    {...getSizeCropperArea(currentCarrousel?.option)}
                />
            )}
            {activeModal === Button && (
                <ButtonModal button={button} saveButton={saveButton} toggleModal={closeModal} updateButton={updateButton} />
            )}
        </div>
    );
};
