import React from 'react';
import { SingleCheckBox } from '@components/checkbox';
import { ChangeEvent, ImageInput, SelectInput, TextArea, TextInput } from '@components/input';
import { Switch } from '@components/switch';
import { IMAGE_WEIGHT_ERROR } from '@constants/WebsiteNode';
import useImage from '@hooks/useImage';
import { getProductData } from '@utils/WebsiteNode';
import { formatMoney } from '@utils/Decimals';
import { generateId, ModuleApp, ActionElementType, ElementType as ElementTypeId } from '@utils/GenerateId';
import { DEFAULT_CONTENT, IContentItemProps } from '.';

export const ContentItem: React.FC<IContentItemProps> = ({ content, productOptions, updateContent, validate, index }) => {
    const {
        description,
        checked,
        edited,
        id,
        isProduct,
        number,
        showProductData,
        productName,
        productValue,
        title,
        src,
    } = content;

    const contentNumber = index + 1;

    const { getImageUrl, sizeError } = useImage();

    return (
        <div className="mb-2">
            <SingleCheckBox
                checked={checked}
                className="mb-2"
                handleChange={({ target: { checked } }: ChangeEvent): void => updateContent({ ...content, checked })}
                labelText={`Contenido ${contentNumber}`}
            />
            <div className="pl-6">
                <Switch
                    checked={isProduct}
                    handleChange={({ target }): void =>
                        updateContent({ ...DEFAULT_CONTENT, isProduct: target.checked, number, id, edited })
                    }
                    labelText="¿La imagen es un producto de su catálogo?"
                />
                <div className="flex flex-col gap-2 mt-2">
                    {isProduct ? (
                        <>
                            <SelectInput
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal-name-product-service`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementTypeId.DRP,
                                })}
                                labelText="*Producto/servicio"
                                options={productOptions}
                                optionSelected={(option): void =>
                                    updateContent({ ...content, ...getProductData(option, productOptions) })
                                }
                                required={validate && !productName}
                                value={productName}
                                classesWrapper="button-modal__product-input"
                            />
                            <Switch
                                checked={showProductData}
                                handleChange={({ target }): void =>
                                    updateContent({ ...content, showProductData: target.checked })
                                }
                                labelText="¿Visualizar el nombre y valor unitario del producto/servicio?"
                            />
                        </>
                    ) : (
                        <ImageInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal-image-product-service`,
                                action: ActionElementType.INPUT,
                                elementType: ElementTypeId.UPL,
                            })}
                            customHandleChangeImage={async (e): Promise<void> => {
                                updateContent({ ...content, src: (await getImageUrl(e)) || content.src });
                            }}
                            image={{ src }}
                            cleanImage={(): void => updateContent({ ...content, src: '' })}
                            labelText={`*Imagen ${contentNumber}`}
                            name="src"
                            required={sizeError || (validate && !src)}
                            showImageName={false}
                            showTrashIcon={false}
                            isRequiredWithImage={sizeError}
                            {...(sizeError && { requiredText: IMAGE_WEIGHT_ERROR })}
                        />
                    )}
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal-name-product-service`,
                            action: ActionElementType.INPUT,
                            elementType: ElementTypeId.TXT,
                        })}
                        classesWrapperInput={showProductData ? 'button-modal__input--disabled' : ''}
                        classesWrapper="button-modal__product-input"
                        labelText={showProductData ? 'Nombre producto/servicio:' : 'Título:'}
                        onChange={({ target }): void => updateContent({ ...content, title: target.value })}
                        name="title"
                        placeholder="..."
                        value={showProductData ? productName : title}
                        disabled={showProductData}
                    />
                    <TextArea
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal-description-value-product-service`,
                            action: ActionElementType.INPUT,
                            elementType: ElementTypeId.TXT,
                        })}
                        classesInput={showProductData ? 'button-modal__input--disabled' : ''}
                        onChange={({ target }): void => updateContent({ ...content, description: target.value })}
                        labelText={showProductData ? 'Valor unitario producto/servicio:' : `Descripción ${contentNumber}:`}
                        name="description"
                        placeholder="..."
                        value={showProductData ? formatMoney(productValue) : description}
                        rows={4}
                        disabled={showProductData}
                    />
                </div>
            </div>
        </div>
    );
};
