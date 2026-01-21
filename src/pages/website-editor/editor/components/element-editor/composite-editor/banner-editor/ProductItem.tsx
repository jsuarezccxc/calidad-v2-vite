import React from 'react';
import { SingleCheckBox } from '@components/checkbox';
import { ChangeEvent, ImageInput, SelectSearchInput, TextInput } from '@components/input';
import { IMAGE_WEIGHT_ERROR } from '@constants/WebsiteNode';
import { DISCOUNT_IMAGE } from '@information-texts/WebsiteEditor';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IProductItemProps } from '.';

export const ProductItem: React.FC<IProductItemProps> = ({
    handleProductChange,
    options,
    product,
    selectProduct,
    index,
    validate,
    handleImageChange,
    sizeError,
    showCheckbox,
}) => {
    const { edited, checked, discount, id, name, src, number } = product;

    const fieldNumber = edited ? number : index + 1;

    const optionsRender = options.map(item => ({ ...item, name: item.value }));

    return (
        <div>
            <div className="flex gap-4.5">
                <div className="flex-1 flex gap-1.5">
                    {showCheckbox && (
                        <SingleCheckBox
                            checked={checked}
                            className="items-start h-4.5 relative top-7"
                            handleChange={(e: ChangeEvent): void => handleProductChange(e, id)}
                            name="checked"
                        />
                    )}
                    <div className="flex flex-col flex-1">
                        <SelectSearchInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `${ModuleApp.MODALS}-editor-composite-element-banner-product-discount`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.DRP,
                            })}
                            labelText={`*Producto/servicio ${fieldNumber}:`}
                            optionSelect={optionsRender}
                            onChangeSelect={(_, option): void => selectProduct(option, id)}
                            valueSelect={name}
                            required={validate && !name}
                        />
                        <p className="discount-modal__product-information">{DISCOUNT_IMAGE}</p>
                    </div>
                </div>
                <ImageInput
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `${ModuleApp.MODALS}-editor-composite-element-banner-product-discount-image`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    classesInput="box"
                    classesWrapper="discount-modal__image-input"
                    labelText={`*Imagen ${fieldNumber}:`}
                    required={validate && !src}
                    customHandleChangeImage={(e): void => handleImageChange(e, id)}
                    image={{ src }}
                    name="src"
                    disabled={!name || !!src}
                    showTrashIcon={false}
                    {...(sizeError && { requiredText: IMAGE_WEIGHT_ERROR })}
                />
            </div>
            <TextInput
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-editor-composite-element-banner-product-discount-value`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                classesWrapper={`${showCheckbox ? 'ml-6' : ''} w-73`}
                labelText="Descuento:"
                onChange={(e): void => handleProductChange(e, id)}
                maxLength={2}
                name="discount"
                onlyNumbers
                placeholder="Ej: 40"
                value={discount}
            />
        </div>
    );
};
