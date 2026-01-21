import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { FileInput, IFile } from '@components/file-input';
import { ChangeEvent } from '@components/input';
import { ElementType } from '@models/WebsiteNode';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { uploadImage } from '@redux/website-node/actions';
import { createDraggableElement, getCenterCoordinates } from '@utils/WebsiteNode';
import { DEFAULT_IMAGE } from '.';
import './ImageField.scss';

export const ImageField: React.FC = () => {
    const dispatch = useDispatch();
    const { activePage } = useSelector((state: RootState) => state.websiteNode);
    const { addElement, deleteElement, saveElement, selectedElement } = useContext(ElementsContext);
    const [image, setImage] = useState<IFile>(DEFAULT_IMAGE);

    useEffect(() => setImageData(), [selectedElement]);

    const addImageToWorkSpace = (src: string, name: string): void => {
        const centerCoordinates = getCenterCoordinates({ height: 100, width: 100 });
        const element = createDraggableElement({
            style: { zIndex: 2, height: 100, width: 100, ...centerCoordinates },
            type: ElementType.Image,
            value: src,
            setting: { name },
            activePageId: activePage?.id,
        });
        addElement(element);
    };

    const deleteImage = (): void => {
        if (selectedElement) {
            deleteElement(selectedElement.id);
            setImage(DEFAULT_IMAGE);
        }
    };

    const handleImageChange = async ({ target: { files } }: ChangeEvent): Promise<void> => {
        if (!files) return;
        const file = files[0];
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (allowedMimeTypes.includes(file.type)) {
            const src = String(await dispatch(uploadImage(file)));
            saveOrUpdateImage(src, file.name);
            return;
        }
    };

    const saveOrUpdateImage = (src: string, fileName: string): void => {
        if (src) {
            if (selectedElement) saveElement({ ...selectedElement, value: src, setting: { name: fileName } });
            else addImageToWorkSpace(src, fileName);
        }
    };

    const setImageData = (): void => {
        if (selectedElement?.type === ElementType.Image) {
            return setImage({ name: selectedElement.setting?.name, src: selectedElement.value, error: '' });
        }
        setImage(DEFAULT_IMAGE);
    };

    return (
        <FileInput
            typeFile="image/png, image/jpg, image/jpeg"
            deleteFile={deleteImage}
            file={image}
            handleChange={handleImageChange}
            textPlaceholder="Subir archivo formato jpg, jpeg, png"
            wrapperClassName="mx-auto my-2 w-57 h-28.3"
        />
    );
};
