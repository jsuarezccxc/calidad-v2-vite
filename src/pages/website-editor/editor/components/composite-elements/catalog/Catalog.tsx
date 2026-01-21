import React, { useState, useMemo, useContext, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import defaultProduct from '@assets/images/catalog/image-deafult-catalog-two.svg';
import { IOptionSelect, SearchInput } from '@components/input';
import { Icon } from '@components/icon';
import { ZERO } from '@constants/UtilsConstants';
import { ONE } from '@constants/Numbers';
import { CAROUSEL_FIVE } from '@constants/WebsiteNode';
import { ElementOption } from '@models/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import { RootState } from '@redux/rootReducer';
import { getCatalogWebsite } from '@redux/product-catalog/actions';
import { setFilterCategories } from '@redux/website-node/actions';
import { removeThousandsPoint } from '@utils/Decimals';
import { removeSpecialCharacters } from '@utils/Text';
import { formatNumber } from '@utils/Number';
import LocalStorage from '@utils/LocalStorage';
import { Filter } from '../../element-editor';
import { SliderProduct } from './components/SliderProduct';
import {
    Buttons,
    DEFAULT_ORDER_PRODUCTS,
    IFilterOption,
    IFilterSetting,
    Inputs,
    Pagination,
    PRICE_SETTING,
    ProductCard,
    SidebarFilters,
} from './components';
import { Wrapper, ActiveButton, NAME_PRICE, IFilterData, FILTER_DEFAULT, OrderType, DEFAULT_TOP_CATALOG } from '.';
import './Catalog.scss';

export const Catalog: React.FC<IElementProps> = memo(({ data, isMobile }) => {
    const {
        catalogWebsite: { data: catalogWebsite },
        categories,
    } = useSelector((state: RootState) => state.productCatalog);
    const { open } = useSelector((state: RootState) => state.menu);
    const { selectedElement, logoSize } = useContext(ElementsContext);

    const dispatch = useDispatch();

    const [paginatedData, setPaginatedData] = useState<IGenericRecord[]>([]);
    const [activeButton, setActiveButton] = useState<ActiveButton | null>(null);
    const [widthDropZone, setWidthDropZone] = useState(0);
    const [activeModalFilters, setActiveModalFilters] = useState(false);
    const [activePage, setActivePage] = useState<number>(1);
    const [dataFilter, setDataFilter] = useState<IGenericRecord[]>([]);
    const [valueFilter, setValueFilter] = useState<IFilterData>(FILTER_DEFAULT);
    const [priceSetting, setPriceSetting] = useState<IFilterSetting>(PRICE_SETTING);
    const [dataCategories, setDataCategories] = useState<IGenericRecord[]>([]);
    const [orderProducts, setOrderProducts] = useState({ date: { name: '', value: '' }, value: { name: '', value: '' } });
    const [slideOptionThree, setSlideOptionThree] = useState<IGenericRecord[]>([]);
    const [isOrder, setIsOrder] = useState(false);

    const catalog = useMemo(() => catalogWebsite, [catalogWebsite]);

    useEffect(() => {
        const dataCarousel = JSON.parse(localStorage[CAROUSEL_FIVE] ?? '{}');
        if (!dataCarousel?.filterCategories?.length) return;

        setValueFilter({ ...valueFilter, categories: dataCarousel?.filterCategories });
        LocalStorage.setObject(CAROUSEL_FIVE, { filterCategories: [], selectedPage: '' });
        dispatch(setFilterCategories({ filterCategories: [], selectedPage: '' }));
    }, []);

    useEffect(() => {
        setIsOrder(!isOrder);
        setOrderProducts({
            ...orderProducts,
            date: { name: DEFAULT_ORDER_PRODUCTS[data?.setting?.ordering || ''], value: data?.setting?.ordering },
        });

        setPriceSetting({
            ...priceSetting,
            options: getOptionsPriceSetting(data?.setting?.priceRanges ?? []),
        });
    }, [data.setting]);

    useEffect(() => {
        if (!isMobile) {
            setActiveButton(null);
        }
    }, [isMobile]);

    useEffect(() => {
        setDataFilter(catalog);
        setPriceSetting({
            ...priceSetting,
            options: getOptionsPriceSetting(data?.setting?.priceRanges ?? []),
        });
        data?.option === ElementOption.Three &&
            setValueFilter({
                ...valueFilter,
                priceMax: Math.max(...catalog.flatMap((item: IGenericRecord) => item.value_with_taxes)),
            });
    }, [catalog]);

    useEffect(() => {
        setDataCategories(
            categories
                ?.map(item => ({
                    title: item?.name,
                    options: item?.sub_categories,
                    amount: catalog?.filter((product: IGenericRecord) => product?.category_ids.includes(item?.id)).length,
                    id: item?.id,
                }))
                .filter(item => item.amount)
        );
    }, [categories]);

    useEffect(() => {
        (async (): Promise<void> => {
            await dispatch(getCatalogWebsite(true));
        })();
    }, []);

    useEffect(() => {
        setSlideOptionThree(
            catalogWebsite
                ?.filter((item: IGenericRecord) => data?.setting?.productList?.includes(item?.id))
                .map((item: IGenericRecord) => ({
                    id: 1,
                    image: item?.unique_product_images[ZERO]?.url,
                    price: item.discount_website
                        ? item.value_with_taxes - (item.value_with_taxes * item.discount_website) / 100
                        : item.value_with_taxes,
                    priceDiscount: item.discount_website && item?.value_with_taxes,
                    title: item?.name,
                    description: item?.description,
                }))
        );
    }, [selectedElement, catalogWebsite]);

    const getOptionsPriceSetting = (priceRanges: IGenericRecord[]): IFilterOption[] =>
        priceRanges?.map((item: IGenericRecord) => ({
            id: item.id,
            name: `${formatNumber(item.min)} - ${formatNumber(item.max)}`,
            minRange: item.min,
            maxRange: item.max,
            amount: catalog.filter(
                (product: IGenericRecord) =>
                    product.value_with_taxes > (item?.min || ZERO) && product.value_with_taxes <= (item?.max || ZERO)
            ).length,
        }));

    const activateButton = (button: ActiveButton): void => setActiveButton(button);

    const updateActivePage = (page: number): void => setActivePage(page);

    const element = document.getElementById('drop-zone');
    useEffect(() => {
        if (element) {
            setWidthDropZone(element.offsetWidth);
        }
    }, [open]);

    const filterByValue = data.setting?.filters?.includes(Filter.PRICE_RANGE);

    const getDataFilter = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        setValueFilter({ ...valueFilter, text: value });
    };

    const getFilterPrice = (data: IGenericRecord[]): IGenericRecord[] => {
        if (!valueFilter.priceMin || !valueFilter.priceMax) return data;
        return data.filter(item => {
            if (item?.value_with_taxes > Number(valueFilter.priceMin) && item?.value_with_taxes < Number(valueFilter.priceMax))
                return item;
        });
    };

    const getSearchCatalog = (data: IGenericRecord[]): IGenericRecord[] => {
        if (!valueFilter.text) return data;
        return data.filter(item => {
            if (item.name.toLowerCase().includes(valueFilter.text.toLowerCase())) return item;
        });
    };

    const getFilterPriceCheck = (data: IGenericRecord[]): IGenericRecord[] => {
        if (!valueFilter.priceFilter.length) return data;
        return data.filter(item => {
            if (
                priceSetting.options.some(
                    option =>
                        valueFilter.priceFilter.includes(option?.id || '') &&
                        item.value_with_taxes > (option.minRange || 0) &&
                        item.value_with_taxes < (option.maxRange || 0)
                )
            )
                return item;
        });
    };
    const hasCommonElement = (idSelected: string[], idCategories: string[]): boolean => {
        return idSelected.some(item => idCategories.includes(item));
    };

    const getFilterCategory = (data: IGenericRecord[]): IGenericRecord[] => {
        if (!valueFilter.categories.length) return data;
        return data?.filter(item => hasCommonElement(valueFilter.categories, item.category_ids || []));
    };

    const getOrderProducts = (data: IGenericRecord[]): IGenericRecord[] => {
        setIsOrder(!isOrder);
        return data.sort((priceMin: IGenericRecord, priceMax: IGenericRecord) => {
            if (orderProducts.value.name === OrderType.Lees) return priceMin.value_with_taxes - priceMax.value_with_taxes;
            if (orderProducts.value.name === OrderType.More) return priceMax.value_with_taxes - priceMin.value_with_taxes;
            if (orderProducts.date.name === OrderType.OldDate) return priceMin.created_at - priceMax.created_at;
            return priceMax.created_at - priceMin.created_at;
        });
    };

    useEffect(() => {
        setDataFilter(getOrderProducts(getFilterCategory(getFilterPriceCheck(getSearchCatalog(getFilterPrice(catalogWebsite))))));
        setActivePage(ONE);
    }, [valueFilter, catalogWebsite, orderProducts]);

    const handlePriceProduct = ({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>): void => {
        if (NAME_PRICE.includes(name)) {
            const formattedValue = value.replace(/[^0-9]/g, '');
            setValueFilter({
                ...valueFilter,
                [name]: name === OrderType.Text ? formattedValue : removeThousandsPoint(removeSpecialCharacters(formattedValue)),
            });
            return;
        }
    };

    const toggleCheckedFilters = (e: React.ChangeEvent<HTMLInputElement>, id = ''): void => {
        const filterIds = [...valueFilter.priceFilter, id];
        setValueFilter({
            ...valueFilter,
            priceFilter: valueFilter.priceFilter.includes(id)
                ? valueFilter.priceFilter?.filter(item => item && item !== id)
                : filterIds,
        });
    };

    const selectCategory = (id: string): void => {
        setValueFilter({ ...valueFilter, categories: [...valueFilter.categories, id] });
    };

    const handleSelectOrder = (option: IOptionSelect): void => {
        const { value, type = '', name } = option;
        setOrderProducts({
            ...orderProducts,
            [type]: { name: name, value: value },
            [type === OrderType.Value ? OrderType.Date : OrderType.Value]: { name: '', value: '' },
        });
        setActivePage(ONE);
    };

    const paginationProps = useMemo(
        () => ({
            activePage,
            data: dataFilter,
            itemsPerPage: Number(data.setting?.itemsPerPage),
            updatePaginatedData: (data: IGenericRecord[]): void => setPaginatedData(data),
            updateActivePage,
            isOrder,
        }),
        [dataFilter, data, activePage, valueFilter, orderProducts, isOrder]
    );

    const categorySelected = dataCategories.filter(item => valueFilter.categories.includes(item.id));
    const topCatalog = (logoSize.height && logoSize.height > DEFAULT_TOP_CATALOG && logoSize.height + 5) || DEFAULT_TOP_CATALOG;
    const widthCatalogTwo = widthDropZone ? widthDropZone : '100%';

    return (
        <>
            <Wrapper
                className={`relative catalog mt-10 mb-20 pr-6 cursor-default catalog--${isMobile ? 'mobile' : ''}`}
                style={{
                    ...data.style,
                    width: widthDropZone || '100%',
                    top: topCatalog,
                    left: 0,
                }}
            >
                {data?.option === ElementOption.One && (
                    <>
                        {!isMobile && (
                            <div className={`p-5 pr-0 max-h-200 sidebar-filters-${data?.option}`}>
                                <div className="flex flex-wrap gap-4">
                                    {categorySelected?.map((item: IGenericRecord) => (
                                        <div className="flex pb-2.5" key={item.id}>
                                            <p className="border border-green rounded-lg h-8.75 w-max text-gray-dark flex justify-center items-center p-1 leading-4">
                                                {item?.title}
                                            </p>
                                            <Icon
                                                name="closeGreen"
                                                className="ml-2 cursor-pointer w-7 h-7"
                                                onClick={(): void =>
                                                    setValueFilter({
                                                        ...valueFilter,
                                                        categories: valueFilter.categories.filter(
                                                            category => category !== item.id
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <SidebarFilters
                                    filterByValue={filterByValue}
                                    data={data}
                                    handlePrice={handlePriceProduct}
                                    valueFilter={valueFilter}
                                    priceSetting={priceSetting}
                                    handleChange={toggleCheckedFilters}
                                    dataCategories={dataCategories}
                                    selectCategory={selectCategory}
                                    resultCatalog={dataFilter.length}
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <Inputs
                                filters={data.setting?.filters}
                                isMobile={isMobile}
                                containerClass={`${isMobile ? 'px-5 ' : ''}`}
                                option={data?.option}
                                handlePriceProduct={getDataFilter}
                                handleSelectOrder={handleSelectOrder}
                                orderProducts={orderProducts}
                            />
                            {isMobile && (
                                <Buttons
                                    activeButton={activeButton}
                                    activateButton={activateButton}
                                    filters={data.setting?.filters}
                                />
                            )}
                            <main className={isMobile ? 'mt-7' : 'mt-16'}>
                                <>
                                    {isMobile && (
                                        <SidebarFilters
                                            setActiveButton={setActiveButton}
                                            activeButton={activeButton}
                                            isMobile={isMobile}
                                            filterByValue={false}
                                            filters={data.setting?.filters}
                                            data={data}
                                        />
                                    )}
                                    {!activeButton && (
                                        <>
                                            <Pagination {...paginationProps} />
                                            <section className="product-list bg-green-scrollbar">
                                                {(paginatedData || []).map((item, index) => (
                                                    <ProductCard
                                                        key={index}
                                                        item={item}
                                                        showUnitValue={data.setting?.showUnitValue}
                                                        option={data?.option}
                                                    />
                                                ))}
                                            </section>
                                        </>
                                    )}
                                </>
                                <Pagination {...paginationProps} isInferior />
                            </main>
                        </div>
                    </>
                )}
                {data?.option === ElementOption.Two && (
                    <>
                        {activeModalFilters && (
                            <div
                                className="absolute left-0 z-10 w-full h-full option-two__container-two"
                                style={{ width: widthCatalogTwo, top: 0, maxHeight: 'auto' }}
                            />
                        )}
                        <div className="relative flex-1 w-full pl-6">
                            {activeModalFilters && (
                                <div className="w-110.75 absolute -right-9 bg-white z-20 top-0 ">
                                    <div className="flex items-center justify-end w-110.75 h-12 gap-3 my-2 shadow-card">
                                        <Icon name="iconFilter" className="w-8 h-8" />
                                        <p className="text-blue">Filtrar y ordenar</p>
                                        <Icon
                                            name="closeGreen"
                                            className="w-8 h-8 mr-4 cursor-pointer ml-28"
                                            onClick={(): void => setActiveModalFilters(false)}
                                        />
                                    </div>
                                    <div className="p-5 overflow-y-auto bg-green-scrollbar max-h-200">
                                        <div className="flex flex-col option-two__border">
                                            <h2 className="mb-8 text-xl text-blue font-allerbold">Filtros aplicados</h2>
                                            <div className="flex flex-wrap gap-4">
                                                {categorySelected?.map((item: IGenericRecord) => (
                                                    <div className="flex pb-2.5" key={item.id}>
                                                        <p className="border border-green rounded-lg h-8.75 w-max text-gray-dark flex justify-center items-center p-1 leading-4">
                                                            {item?.title}
                                                        </p>
                                                        <Icon
                                                            name="closeGreen"
                                                            className="ml-2 cursor-pointer w-7 h-7"
                                                            onClick={(): void =>
                                                                setValueFilter({
                                                                    ...valueFilter,
                                                                    categories: valueFilter.categories.filter(
                                                                        category => category !== item.id
                                                                    ),
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="px-5 py-2">
                                            <h2 className="mb-4 text-xl font-allerbold text-blue">Ordenar por</h2>
                                            {!isMobile && (
                                                <SidebarFilters
                                                    filterByValue={filterByValue}
                                                    data={data}
                                                    handlePrice={handlePriceProduct}
                                                    valueFilter={valueFilter}
                                                    priceSetting={priceSetting}
                                                    handleChange={toggleCheckedFilters}
                                                    dataCategories={dataCategories}
                                                    selectCategory={selectCategory}
                                                    resultCatalog={dataFilter.length}
                                                    handlePriceProduct={getDataFilter}
                                                    handleSelectOrder={handleSelectOrder}
                                                    orderProducts={orderProducts}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h2 className="text-green text-1.5xl font-allerbold p-2.5 mt-4.5">Categorías</h2>
                            <img
                                alt="product"
                                className="m-auto mb-8 option-two__image-banner h-50"
                                src={selectedElement?.setting?.imageBannerFile || defaultProduct}
                            />
                            <SearchInput
                                classesWrapper="option-two__input mx-auto"
                                placeholder="Buscar por"
                                onChange={getDataFilter}
                            />
                            <div className="flex gap-3 my-2 cursor-pointer" onClick={(): void => setActiveModalFilters(true)}>
                                <Icon name="iconFilter" />
                                <p className="text-xl underline text-blue">Filtrar y ordenar</p>
                            </div>

                            {isMobile && (
                                <Buttons
                                    activeButton={activeButton}
                                    activateButton={activateButton}
                                    filters={data.setting?.filters}
                                />
                            )}
                            <main className={isMobile ? 'mt-7' : ''}>
                                <>
                                    {isMobile && (
                                        <SidebarFilters
                                            setActiveButton={setActiveButton}
                                            activeButton={activeButton}
                                            isMobile={isMobile}
                                            filterByValue={false}
                                            filters={data.setting?.filters}
                                            data={data}
                                        />
                                    )}
                                    {!activeButton && (
                                        <>
                                            <Pagination {...paginationProps} />
                                            <section className="option-two__product-list-two bg-green-scrollbar">
                                                {(paginatedData || []).map((item, index) => (
                                                    <ProductCard
                                                        key={index}
                                                        item={item}
                                                        showUnitValue={data.setting?.showUnitValue}
                                                        classContainer="option-two__product-card-two"
                                                        option={data?.option}
                                                    />
                                                ))}
                                            </section>
                                        </>
                                    )}
                                </>
                                <Pagination {...paginationProps} isInferior />
                            </main>
                        </div>
                    </>
                )}
                {data?.option === ElementOption.Three && (
                    <>
                        {!isMobile && (
                            <div className="catalog__option-three">
                                <SidebarFilters
                                    filterByValue={filterByValue}
                                    data={data}
                                    handlePrice={handlePriceProduct}
                                    valueFilter={valueFilter}
                                    priceSetting={priceSetting}
                                    handleChange={toggleCheckedFilters}
                                    dataCategories={dataCategories}
                                    selectCategory={selectCategory}
                                    resultCatalog={dataFilter.length}
                                />
                            </div>
                        )}
                        <div className="flex-1 catalog__container-products">
                            <Inputs
                                filters={data.setting?.filters}
                                isMobile={isMobile}
                                containerClass={`flex flex-row-reverse w-11/12 justify-between ${isMobile ? 'px-5 ' : ''} `}
                                option={data?.option}
                                handlePriceProduct={getDataFilter}
                                handleSelectOrder={handleSelectOrder}
                                orderProducts={orderProducts}
                            />
                            <SliderProduct slideOptionThree={slideOptionThree} />
                            {isMobile && (
                                <Buttons
                                    activeButton={activeButton}
                                    activateButton={activateButton}
                                    filters={data.setting?.filters}
                                />
                            )}
                            <main className={isMobile ? 'mt-7' : 'mt-0.5'}>
                                <>
                                    {isMobile && (
                                        <SidebarFilters
                                            setActiveButton={setActiveButton}
                                            activeButton={activeButton}
                                            isMobile={isMobile}
                                            filterByValue={false}
                                            filters={data.setting?.filters}
                                            data={data}
                                        />
                                    )}
                                    {!activeButton && (
                                        <>
                                            <Pagination {...paginationProps} />
                                            <section className="h-auto option-two__product-list-two bg-green-scrollbar">
                                                {(paginatedData || []).map((item, index) => (
                                                    <ProductCard
                                                        key={index}
                                                        item={item}
                                                        showUnitValue={data.setting?.showUnitValue}
                                                        classContainer="option-two__product-card-two"
                                                        option={data?.option}
                                                    />
                                                ))}
                                            </section>
                                        </>
                                    )}
                                </>
                                <Pagination {...paginationProps} isInferior />
                            </main>
                        </div>
                    </>
                )}
            </Wrapper>
        </>
    );
});
