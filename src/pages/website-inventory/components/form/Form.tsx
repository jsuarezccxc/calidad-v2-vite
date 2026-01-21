import React, { useContext, useState } from 'react';
import { SelectSearchInput } from '@components/input';
import { RadioButton } from '@components/radiobutton';
import { Form as FormComponent } from '@components/form';
import { WebsiteInventoryContext } from '@pages/website-inventory/context';
import { IWebsiteInventory } from '@pages/website-inventory';
import { sortArrayAlphabetically } from '@utils/Array';
import { buildOptionsSearch } from '@utils/Company';
import { ModuleApp, ActionElementType, ElementType, generateId } from '@utils/GenerateId';
import { COLLECTION_OPTIONS } from '.';

const Form: React.FC<IWebsiteInventory> = ({ isDualModule }) => {
    const { productServices, handleSelectProduct, handleChangeIsOutput } = useContext(WebsiteInventoryContext);
    const [isOutput, setIsOutput] = useState('Agregar entrada');
    const changeRadioOutput = (value: string): void => {
        setIsOutput(value);
        handleChangeIsOutput(value);
    };
    return (
        <section className="flex flex-row gap-4.5">
            <FormComponent sendWithEnter>
                {isDualModule && (
                    <RadioButton
                        moduleId={ModuleApp.INVENTORY_MOVEMENTS}
                        selected={isOutput}
                        entities={COLLECTION_OPTIONS}
                        setSelected={(isOutput: string): void => changeRadioOutput(isOutput)}
                        classesContainer="mb-4 gap-8"
                        classesRadioButton="w-60 input-radio"
                    />
                )}
                <SelectSearchInput
                    id={generateId({
                        module: ModuleApp.INVENTORY_MOVEMENTS,
                        submodule: `product-filter`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    labelText="Producto"
                    classesWrapper="w-45"
                    optionSelect={sortArrayAlphabetically(buildOptionsSearch(productServices))}
                    isNew
                    classesWrapperInput="bg-white"
                    selectIconType="arrowDownGreen"
                    onChangeSelect={(selectValue): void => {
                        handleSelectProduct(selectValue, isOutput);
                    }}
                />
            </FormComponent>
        </section>
    );
};

export default Form;
