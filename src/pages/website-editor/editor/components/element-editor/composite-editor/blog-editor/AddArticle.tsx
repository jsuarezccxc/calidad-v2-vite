import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import SunEditor from 'suneditor-react';
import { uploadImage } from '@redux/website-node/actions';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { SimpleButton } from '@components/button';
import { ChangeEvent } from '@components/radiobutton';
import { ImageInput, TextInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { IMAGE_WEIGHT_ERROR, MAXIMUM_IMAGE_SIZE } from '@constants/WebsiteNode';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { ARTICLE_FIELDS, NUMBER_OF_ARTICLES, reference } from '.';
import './BlogEditor.scss';

export const AddArticle: React.FC<{ toggleModal: () => void }> = ({ toggleModal }) => {
    const dispatch = useDispatch();
    const { selectedElement, handleSettingChange } = useContext(ElementsContext);
    const [isSizeExceeded, setIsSizeExceeded] = useState<boolean>(false);
    const [data, setData] = useState<IGenericRecord>(
        selectedElement?.setting?.numberOfArticles[selectedElement?.setting?.articleToEdit]
    );
    const handleChangeText = ({ target }: ChangeEvent): void => setData({ ...data, [target.name]: target.value });
    const handleChangeContent = (content: string): void => {
        setData(data => ({ ...data, content: JSON.stringify({ value: content }), parsedContent: content }));
    };

    const handleImageChange = async ({ target }: ChangeEvent): Promise<void> => {
        if (target.files) {
            if (target.files[0].size > MAXIMUM_IMAGE_SIZE) {
                setIsSizeExceeded(true);
                return;
            }
            setIsSizeExceeded(false);
            const src = String(await dispatch(uploadImage(target.files[0])));
            if (src) {
                const modifiedArticles = selectedElement?.setting?.numberOfArticles?.map(
                    (article: IGenericRecord, index: number) => {
                        if (index === selectedElement?.setting?.articleToEdit) return { ...data, image: src };
                        return article;
                    }
                );

                handleSettingChange({
                    name: NUMBER_OF_ARTICLES,
                    value: modifiedArticles,
                });
            }
        }
    };

    const editArticle = (): void => {
        const modifiedArticles = selectedElement?.setting?.numberOfArticles?.map((article: IGenericRecord, index: number) => {
            if (index === selectedElement?.setting?.articleToEdit) return { ...data, image: article.image, edit: true };
            return article;
        });

        handleSettingChange({
            name: NUMBER_OF_ARTICLES,
            value: modifiedArticles,
        });

        toggleModal();
    };

    const deleteImage = (): void => {
        const modifiedArticles = selectedElement?.setting?.numberOfArticles?.map((article: IGenericRecord, index: number) => {
            if (index === selectedElement?.setting?.articleToEdit) return { ...data, image: '' };
            return article;
        });

        handleSettingChange({
            name: NUMBER_OF_ARTICLES,
            value: modifiedArticles,
        });
    };

    return (
        <div className="blog-editor__article">
            <div className="blog-editor__article-content bg-green-scrollbar">
                <h3 className="blog-editor__article-title">{data.edit ? 'Editar artículo' : 'Agregar artículo'}</h3>
                <p className="blog-editor__article-description">
                    {data.edit
                        ? 'Modifique la información que desee de su artículo'
                        : 'Agregue el nombre, autor, síntesis y contenido del artículo. Además agregue la imagen que acompañará este artículo, se recomienda que la imagen sea horizontal, si agrega una imagen vertical se adaptará al tamaño de acuerdo a la plantilla'}
                </p>
                {ARTICLE_FIELDS.map(field => (
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-blog-add-article-name`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        onChange={handleChangeText}
                        value={data[field.name]}
                        key={field.name}
                        {...field}
                    />
                ))}
                <ImageInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-editor-composite-element-blog-add-article-image`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.UPL,
                    })}
                    labelText="Imagen para el artículo: "
                    classesWrapper="mt-4 flex flex-col"
                    classesInput="upload-image-input"
                    classNameFiles="w-full h-28.3"
                    customHandleChangeImage={handleImageChange}
                    name="src"
                    image={{ src: selectedElement?.setting?.numberOfArticles[selectedElement?.setting?.articleToEdit].image }}
                    cleanImage={deleteImage}
                    sizeImage={MAXIMUM_IMAGE_SIZE}
                    placeholder="Subir archivo en formato jpg, jpeg, png"
                />
                {isSizeExceeded && <p className="text-purple text-tiny">{IMAGE_WEIGHT_ERROR}</p>}
                <label className="text-xs text-blue font-allerbold pl-1.5 inline-block mt-4">Contenido:</label>
                <SunEditor
                    name="content"
                    defaultValue={data.parsedContent || ''}
                    onChange={handleChangeContent}
                    setContents={data.parsedContent}
                    setDefaultStyle="font-size: 1rem"
                />
                <TextInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-editor-composite-element-blog-add-article-reference`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    {...reference}
                    onChange={handleChangeText}
                    value={data.reference}
                />
            </div>
            <div className="blog-editor__article-buttons">
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-editor-composite-element-blog-add-article`,
                        action: ActionElementType.CANCEL,
                        elementType: ElementType.BTN,
                    })}
                    onClick={toggleModal}
                    className="blog-editor__article-button shadow-templateDesign mr-5.5"
                >
                    Cancelar
                </SimpleButton>
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-editor-composite-element-blog-add-article`,
                        action: ActionElementType.SAVE,
                        elementType: ElementType.BTN,
                    })}
                    className="blog-editor__article-button shadow-templateDesign"
                    onClick={editArticle}
                >
                    Guardar
                </SimpleButton>
            </div>
        </div>
    );
};
