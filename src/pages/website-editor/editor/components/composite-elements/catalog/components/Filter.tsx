import React, { useEffect, useState } from 'react';
import { formatMoney } from '@utils/Decimals';
import { TextInput } from '@components/input';
import { ElementOption } from '@models/WebsiteNode';
import { Checkbox, Title, IFilterProps, SUBCATEGORY, PRICE } from '.';

export const Filter: React.FC<IFilterProps> = ({
    isActive,
    setting,
    handlePrice = (): void => {},
    valueFilter = { priceMin: '', priceMax: '', priceFilter: [] },
    handleChange,
    selectCategory,
    onClick,
}) => {
    const { name, title, options, amount, id } = setting;

    const [maxPriceRange, setMaxPriceRange] = useState(0);

    useEffect(() => {
        !maxPriceRange && setMaxPriceRange(valueFilter.priceMax);
    }, [valueFilter]);

    return (
        <div className="filter">
            <Title
                activateArrow={isActive}
                title={title}
                {...(name !== PRICE && { amount: amount })}
                titleClassName={`filter__category-title ${name === ElementOption.Three ? 'text-sm' : ''}`}
                includeArrow={!!options?.length}
                id={id}
                selectCategory={selectCategory}
                onClick={onClick}
            />
            <section className={`filter__content ${isActive ? 'filter__content--active' : ''}`}>
                {name === PRICE && isActive && (
                    <section className="flex items-center gap-5 mt-4.5 mb-5.5">
                        <TextInput
                            name="priceMin"
                            classesWrapperInput="product-catalog__money-input"
                            classesInput="border-0"
                            onChange={handlePrice}
                            type="text"
                            value={formatMoney(valueFilter.priceMin, 0)}
                        />
                        a
                        <TextInput
                            name="priceMax"
                            classesWrapperInput="product-catalog__money-input"
                            classesInput="border-0"
                            onChange={handlePrice}
                            type="text"
                            value={formatMoney(valueFilter.priceMax, 0)}
                        />
                    </section>
                )}
                {name === ElementOption.Three && (
                    <div className="mt-3 mb-4.5 w-full">
                        <div className="flex justify-between mb-1 ">
                            <p className="text-blue text-xtiny">{formatMoney(valueFilter.priceMin, 0)}</p>
                            <p className="text-xs text-blue">a</p>
                            <p className="text-blue text-xtiny">{formatMoney(valueFilter.priceMax, 0)}</p>
                        </div>
                        <div className="slider-price">
                            <input
                                name="priceMin"
                                type="range"
                                min={0}
                                max={maxPriceRange / 2}
                                value={Number(valueFilter.priceMin) || 0}
                                onChange={(e): void => {
                                    handlePrice(e);
                                }}
                                className="z-30 slider-price__range"
                            />
                            <input
                                name="priceMax"
                                type="range"
                                min={maxPriceRange / 2}
                                max={maxPriceRange}
                                value={Number(valueFilter?.priceMax) || maxPriceRange}
                                onChange={(e): void => handlePrice(e)}
                                className="slider-price__range"
                            />
                        </div>
                    </div>
                )}
                <ul className={`flex flex-col gap-3 mt-3`}>
                    {options?.map((option, index) => (
                        <Checkbox
                            key={index}
                            option={option}
                            name={name === ElementOption.Three ? name || '' : `${option.name}${index}`}
                            withoutCheck={name !== PRICE && name !== ElementOption.Three}
                            isActive={option.name == SUBCATEGORY}
                            handleChange={handleChange}
                            checked={valueFilter.priceFilter.includes(option.id)}
                        />
                    ))}
                </ul>
            </section>
        </div>
    );
};
