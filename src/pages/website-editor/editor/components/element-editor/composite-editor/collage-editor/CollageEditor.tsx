import React, { Fragment, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';
import { uploadImage } from '@redux/website-node/actions';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { ChangeEvent, ImageInput } from '@components/input';
import { IMAGE_WEIGHT_ERROR, MAXIMUM_IMAGE_SIZE } from '@constants/WebsiteNode';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { IMAGES } from '.';
import './CollageEditor.scss';

export const CollageEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { selectedElement, handleSettingChange } = useContext(ElementsContext);
    const images = selectedElement?.setting?.images || new Array(IMAGES[selectedElement?.option || 0]).fill('');
    const [isSizeExceeded, setIsSizeExceeded] = useState<boolean>(false);
    const [indexIsSizeExceeded, setIndexIsSizeExceeded] = useState<number>();

    const handleImageChange = async ({ target }: ChangeEvent, index: number): Promise<void> => {
        if (target.files) {
            if (target.files[0].size > MAXIMUM_IMAGE_SIZE) {
                await setIsSizeExceeded(true);
                await setIndexIsSizeExceeded(index);
                return;
            }
            setIsSizeExceeded(false);
            const src = String(await dispatch(uploadImage(target.files[0])));
            if (src) {
                const newImages = [...images];
                newImages[index] = src;
                handleSettingChange({ name: 'images', value: newImages });
            }
        }
    };

    const deleteImage = (index: number): void => {
        const newImages = [...images];
        newImages[index] = '';

        handleSettingChange({ name: 'images', value: newImages });
    };

    return (
        <div className="editor-collage">
            {images.map((image: string, index: number) => (
                <Fragment key={uuid()}>
                    <p className="text-tiny text-blue font-allerbold pl-1.5">Imagen {index + 1}:</p>
                    <ImageInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-composite-element-collage-image`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.UPL,
                        })}
                        customHandleChangeImage={(e): void => {
                            handleImageChange(e, index);
                        }}
                        placeholder="Subir archivo jpg, jpeg, png"
                        classesInput="editor-collage__image"
                        classesWrapper={image ? 'editor-collage__wrapper' : ''}
                        name="src"
                        image={{ src: image }}
                        cleanImage={(): void => {
                            deleteImage(index);
                        }}
                        sizeImage={MAXIMUM_IMAGE_SIZE}
                    />
                    {isSizeExceeded && indexIsSizeExceeded === index && (
                        <div className="flex justify-end mb-4.5">
                            <p className="leading-4 text-right text-purple text-tiny w-41">{IMAGE_WEIGHT_ERROR}</p>
                        </div>
                    )}
                </Fragment>
            ))}
        </div>
    );
};
