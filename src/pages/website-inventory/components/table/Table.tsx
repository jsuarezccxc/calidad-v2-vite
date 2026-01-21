import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { Icon } from '@components/icon';
import { Table as TableComponent } from '@components/table';
import { WebsiteInventoryContext } from '@pages/website-inventory/context';
import usePermissions from '@hooks/usePermissions';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import HeaderTable from './components/header-table';
import ProductRow from './components/product-row';

const Table: React.FC = () => {
    const { handleShowConfirmDeleteModal, validate, totalsQuantities, countCheckedElements, quantityValidate } = useContext(
        WebsiteInventoryContext
    );
    const { loader: loaderState } = useSelector(({ loader }: RootState) => ({ ...loader }));
    const { disabledInputs } = usePermissions();
    return (
        <section className="flex flex-col w-full xl:w-max">
            <Icon
                id={generateId({
                    module: ModuleApp.INVENTORY_MOVEMENTS,
                    submodule: `product-selected`,
                    action: ActionElementType.TRASH,
                    elementType: ElementType.ICO,
                })}
                name="trashBlue"
                classIcon="w-5.5 mt-1 mb-2 self-end cursor-pointer"
                onClick={(): void => {
                    countCheckedElements && !disabledInputs ? handleShowConfirmDeleteModal() : '';
                }}
            />

            <TableComponent
                id={generateId({
                    module: ModuleApp.INVENTORY_MOVEMENTS,
                    submodule: `product`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isLoading={loaderState}
                sendFormWithEnter
                isHeaderRowsCustom
                headerRowsCustom={<HeaderTable />}
                fieldsBody={[]}
                data={[]}
                editable={false}
                customTable
                className="table-inventory"
                isNew
                wrapperClassName="table-inventory__container"
            >
                <ProductRow />
            </TableComponent>
            {validate && (
                <p className="p-0 mt-2 leading-4 text-tiny text-purple font-aller">{`${
                    quantityValidate ? '*La cantidad de salida supera la cantidad disponible en la bodega' : '*Campo obligatorio'
                }`}</p>
            )}
            <div>
                <div className="mt-4.5 bg-white md:w-full lg:w-max xl:w-max">
                    <div className="flex flex-row">
                        <div className="px-2 py-3 text-sm whitespace-normal font-aller bg-opacity-20 bg-green footer-width-field text-blue">
                            Total cantidad disponible para la venta
                        </div>
                        <div className="px-2 py-3 text-sm text-right bg-white font-allerbold footer-width-field__quantity text-gray-dark">
                            {totalsQuantities?.totalAvailableForSale ?? 0}
                        </div>
                    </div>
                    <div className="w-full px-2 py-3 text-sm whitespace-normal bg-opacity-20 font-aller text-blue bg-green border-b-1 border-gray">
                        <div>Total cantidad disponible para la venta por bodega</div>
                    </div>
                    {Object?.entries(totalsQuantities.availablePerWarehouse ?? {})?.map(([warehouseName, quantity], index) => (
                        <div key={`${index}-${warehouseName}`} className={`flex flex-row ${index % 2 ? 'bg-gray-light' : ''}`}>
                            <div className="px-2 py-3 text-sm whitespace-normal font-aller footer-width-field text-gray">
                                Cantidad disponible de {warehouseName}
                            </div>
                            <div className="w-full px-2 py-3 text-sm text-right footer-width-field__quantity font-aller text-gray">
                                {(quantity as number) ?? 0}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Table;
