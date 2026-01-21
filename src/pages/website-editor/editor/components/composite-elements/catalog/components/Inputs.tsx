import React from 'react';
import { SearchInput, SelectInput } from '@components/input';
import { ElementOption } from '@models/WebsiteNode';
import { getWordLimit } from '@utils/Text';
import { Filter } from '../../../element-editor';
import { IInputs, MAX_LENGTH_VALUE, OPTION_DATE, OPTION_PRICE } from '.';

export const Inputs: React.FC<IInputs> = ({
    filters = '',
    isMobile,
    containerClass,
    option,
    handlePriceProduct,
    handleSelectOrder = (): void => {},
    orderProducts,
    isInputSearch = true,
    classSelectInputs,
}) => {
    const valueLength = option === ElementOption.Three ? MAX_LENGTH_VALUE : orderProducts?.date?.value.length;
    return (
        <div className={`catalog__container-input-${option} ${containerClass}`}>
            {isInputSearch && (
                <SearchInput
                    classesWrapper={`catalog__input catalog__input--large-${option}`}
                    labelText="Buscar por:"
                    placeholder="..."
                    onChange={handlePriceProduct}
                    name="text"
                />
            )}

            {!isMobile && (
                <div
                    className={`flex ${
                        option === ElementOption.Three ? 'w-1/2 gap-4.5' : 'w-full mt-4.5 gap-7'
                    } ${classSelectInputs} `}
                >
                    {filters?.includes(Filter.VALUE) && (
                        <SelectInput
                            classesWrapper={`catalog__input catalog__input--small-${option}`}
                            labelText="Ordenar por valor:"
                            options={OPTION_PRICE}
                            optionSelected={handleSelectOrder}
                            value={orderProducts?.value?.value}
                        />
                    )}
                    {filters?.includes(Filter.DATE) && (
                        <SelectInput
                            name="date"
                            classesWrapper={`catalog__input catalog__input--small-${option}`}
                            labelText="Ordenar según fecha:"
                            options={OPTION_DATE}
                            optionSelected={handleSelectOrder}
                            value={getWordLimit(orderProducts?.date?.value, valueLength)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
