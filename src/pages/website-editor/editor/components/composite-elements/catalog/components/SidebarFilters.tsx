import React, { useState } from 'react';
import { Icon } from '@components/icon';
import { SelectInput } from '@components/input';
import { ElementOption } from '@models/WebsiteNode';
import { Filter as inputFilter } from '../../../element-editor';
import { ActiveButton } from '..';
import { Title, Filter, PRICE_SETTING, ISidebarFilter, Inputs, PRICE } from '.';

export const SidebarFilters: React.FC<ISidebarFilter> = ({
    filterByValue,
    isMobile = false,
    activeButton = ActiveButton.Filter,
    setActiveButton = (): void => {},
    filters = '',
    data,
    handlePrice = (): void => {},
    valueFilter,
    priceSetting,
    handleChange,
    dataCategories,
    selectCategory,
    resultCatalog = 0,
    handlePriceProduct,
    handleSelectOrder,
    orderProducts,
}) => {
    const { option, setting } = data;
    const [activeDateFilter, setActiveDateFilter] = useState('');
    return (
        <aside
            className={`sidebar-filters w-full overflow-y-auto rounded bg-green-scrollbar max-h-full overflow-x-hidden pr-2 ${
                isMobile && activeButton ? 'sidebar-filters__mobile' : ''
            }`}
        >
            {isMobile && activeButton ? (
                <div className="flex items-center mb-7">
                    <Icon name="arrowLeftCatalog" onClick={(): void => setActiveButton(null)} />

                    <div className="flex-1 text-center font-allerbold text-primary">
                        {activeButton === ActiveButton.Filter ? 'Filtrar' : 'Ordenar'} por:
                    </div>
                </div>
            ) : (
                option !== ElementOption.Two && (
                    <Title
                        includeArrow={false}
                        title={`Resultados ${resultCatalog}`}
                        wrapperClassName="mb-7"
                        titleClassName={option === ElementOption.Three ? 'text-lg' : 'text-xl '}
                    />
                )
            )}

            {isMobile && filters && activeButton === ActiveButton.Sort && (
                <>
                    {filters?.includes(inputFilter.VALUE) && (
                        <SelectInput
                            classesWrapper="catalog__input catalog__input--small mb-4.5"
                            labelText="Ordenar por valor:"
                        />
                    )}
                    {filters?.includes(inputFilter.DATE) && (
                        <SelectInput classesWrapper="catalog__input catalog__input--small" labelText="Ordenar según fecha:" />
                    )}
                </>
            )}

            {filterByValue && (
                <Filter
                    setting={{ ...(priceSetting || PRICE_SETTING), name: option === ElementOption.Three ? option : PRICE }}
                    isActive={activeDateFilter === PRICE}
                    handlePrice={handlePrice}
                    valueFilter={valueFilter}
                    handleChange={handleChange}
                    onClick={(): void => setActiveDateFilter(activeDateFilter === PRICE ? '' : PRICE)}
                />
            )}

            {option === ElementOption.Two && (
                <>
                    <Title
                        activateArrow={activeDateFilter === 'valueDate'}
                        onClick={(): void => setActiveDateFilter(activeDateFilter === 'valueDate' ? '' : 'valueDate')}
                        title="Por fecha o valor"
                        titleClassName="filter__category-title cursor-pointer"
                        includeArrow
                        wrapperClassName="mt-6 mb-2"
                    />
                    {activeDateFilter === 'valueDate' && (
                        <div className="flex flex-col gap-y-4.5">
                            <Inputs
                                filters={setting?.filters}
                                isMobile={isMobile}
                                containerClass={`${isMobile ? 'px-5 ' : ''}`}
                                option={option}
                                handlePriceProduct={handlePriceProduct}
                                handleSelectOrder={handleSelectOrder}
                                orderProducts={orderProducts}
                                isInputSearch={false}
                                classSelectInputs="flex-col-reverse gap-2.5"
                            />
                        </div>
                    )}
                    <div className="mt-3.5 border-b border-secondary/20 w-full mx-auto" />
                </>
            )}

            {((!activeButton && !isMobile) || activeButton === ActiveButton.Filter) && (
                <>
                    <Title includeArrow={false} title="Categorías" wrapperClassName="my-7" />
                    <section className="flex flex-col gap-3">
                        {dataCategories?.map(item => (
                            <Filter
                                key={item.id}
                                setting={{ title: item.title, amount: item.amount, options: item.options, id: item.id }}
                                selectCategory={selectCategory}
                            />
                        ))}
                    </section>
                </>
            )}
        </aside>
    );
};
