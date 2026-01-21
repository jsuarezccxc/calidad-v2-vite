import React, { useMemo, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Table } from '@components/table';
import { NumberFormatInput } from '@components/table-input';
import { IOptionSelect, SelectSearchTableInput } from '@components/input';
import { Icon } from '@components/icon';
import { Paginator } from '@components/paginator';
import { TableError } from '@components/table-error';
import { getProductsError, TABLES } from '@pages/product-shipping-cost-information';
import { IGenericRecord } from '@models/GenericRecord';
import { ITEMS_PAGE } from '@constants/Paginator';
import { ZERO } from '@constants/Numbers';
import { NINE } from '@constants/ElectronicInvoice';
import { TWO } from '@pages/purchasing-process/components/summary-table';
import usePaginator from '@hooks/usePaginator';
import usePermissions from '@hooks/usePermissions';
import { buildOptions } from '@utils/Company';
import { toLimitedCharactersWithLengthValue } from '@utils/Number';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import { FIELDS, IProductTableProps, defaultProduct, ProductTableHeader } from '.';

export const ProductTable: React.FC<IProductTableProps> = ({
    data = [],
    products = [],
    setData = (): void => {},
    checkedProducts = [],
    onClickTrash = (): void => {},
    validate = false,
    setIsSave = (): void => {},
}) => {
    const { paginator, getLimits } = usePaginator(data);

    const enableLink = products?.length ? data?.length < products?.length : false;

    const selectedIds = useMemo(() => data?.map(item => item?.id), [data]);

    const getOptions = (): IOptionSelect[] => buildOptions(products)?.filter(item => selectedIds?.every(id => id !== item?.id));

    const options = useMemo(() => getOptions(), [products]);

    const tableError = useMemo(() => (validate ? getProductsError(data) : ''), [validate, data]);

    const { disabledInputs } = usePermissions();

    const addProduct = (): void => {
        if (enableLink) {
            if (data.length < ITEMS_PAGE) setData([...data, { ...defaultProduct, id: uuid() }]);
        }
    };

    const toggleSelectItem = (items: IGenericRecord[], idItem: string): IGenericRecord[] => {
        return items?.map((item: IGenericRecord) => ({
            ...item,
            checked: idItem === item.id ? !item?.checked : item?.checked,
        }));
    };

    const handleChangeData = ({ value, name, id }: IGenericRecord, idItem: string): void => {
        setIsSave(false);
        setData(
            data.map(item => {
                if (item.id === idItem) {
                    return {
                        ...item,
                        [name]:
                            name === FIELDS.SHIPPING_COST ? toLimitedCharactersWithLengthValue(value.toString(), NINE) : value,
                        ...(name === FIELDS.NAME ? { product_id: id } : {}),
                    };
                }

                return item;
            })
        );
    };

    const getFieldClass = ({ name, additional_shipping_cost: cost }: IGenericRecord): string => {
        return validate && name && !Number(cost) ? 'border-purple' : '';
    };

    useEffect(() => {
        getLimits();
    }, [data]);

    const productsOptionsRender = options.map(item => ({
        ...item,
        name: item.value,
        value: item.value,
        id: item.id,
    }));

    const productIdToNameMap = useMemo(() => {
        const map = new Map<string, string>();
        productsOptionsRender.forEach(option => {
            if (option.id) {
                map.set(option.id, option.value);
            }
        });
        return map;
    }, [productsOptionsRender]);

    return (
        <div className="relative flex flex-col w-full lg:w-max">
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `product-table-shipping-cost`,
                    action: ActionElementType.TRASH,
                    elementType: ElementType.ICO,
                })}
                name="trashBlue"
                className="absolute w-5.5 h-5.5 self-end mb-2.5 ml-4 right-0 lg:-right-8 -top-8"
                hoverIcon={`${checkedProducts?.length ? 'trashGreen' : 'trashBlue'}`}
                onClick={(): void => onClickTrash(TABLES.PRODUCTS)}
            />
            <Table
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `product-table-shipping-cost`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                sendFormWithEnter
                customTable
                isHeaderRowsCustom
                data={[]}
                isNew
                headerRowsCustom={<ProductTableHeader />}
                className="w-max"
                wrapperClassName="overflow-y-auto lg:overflow-visible w-full"
            >
                {data?.slice(paginator?.limits?.start, paginator?.limits?.finish)?.map((item, index) => {
                    return (
                        <tr
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `product-table-shipping-cost-${item.id}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            key={item?.id}
                            className={!(index % TWO) ? 'tr-white' : 'tr-gray'}
                        >
                            <td className="bg-white shipping-cost__check-field">
                                <div
                                    className={`shipping-cost__check ${
                                        item?.checked ? 'bg-blue border-transparent' : 'border-gray'
                                    }`}
                                    onClick={(): void => setData(toggleSelectItem(data, item.id))}
                                />
                            </td>
                            <td className="field-body--editable field-height">
                                {productsOptionsRender.length > ZERO && (
                                    <SelectSearchTableInput
                                        id={generateId({
                                            module: ModuleApp.WEBSITE,
                                            submodule: `product-table-shipping-cost-${item.id}-products`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        name="transfer"
                                        iconClassName="lg:-top-1 xs:-top-1"
                                        classesWrapperInput="border-none text-gray-dark text-center w-full"
                                        placeholder="Seleccionar"
                                        classesWrapper="relative w-full select-table"
                                        isTable
                                        isTableSearch
                                        optionSelect={productsOptionsRender}
                                        valueSelect={productIdToNameMap.get(item.product_id) || ''}
                                        onChangeSelect={(_, { name, id }): void =>
                                            handleChangeData({ value: name, name: FIELDS.NAME, id }, item.id)
                                        }
                                        centerTextSelect
                                        disabled={disabledInputs}
                                        isNewSelect
                                        isTransparent
                                    />
                                )}
                            </td>
                            <td className={`relative field-body--editable field-height ${getFieldClass(item)}`}>
                                <NumberFormatInput
                                    id={generateId({
                                        module: ModuleApp.WEBSITE,
                                        submodule: `product-table-shipping-cost-${item.id}-additional-cost`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    allowNegative={false}
                                    value={item.additional_shipping_cost}
                                    containerClass="field-money flex w-full justify-between"
                                    inputClass="field-money__input w-full flex-1"
                                    onChange={({ floatValue }): void =>
                                        handleChangeData({ value: floatValue || '', name: FIELDS.SHIPPING_COST }, item.id)
                                    }
                                    disabled={disabledInputs}
                                    fixedDecimalScale
                                />
                            </td>
                        </tr>
                    );
                })}
            </Table>
            <p
                className={`shipping-cost__add-item hover:text-purple ${
                    data?.length < ITEMS_PAGE ? '' : 'shipping-cost__disabled-link'
                } ${data?.length ? 'ml-8' : 'ml-0'}`}
                onClick={addProduct}
            >
                + Agregar producto
            </p>
            {tableError && (
                <div className="mt-2 ml-8">
                    <TableError customText={tableError} />
                </div>
            )}
            {data?.length > ITEMS_PAGE && <Paginator {...paginator} />}
        </div>
    );
};
