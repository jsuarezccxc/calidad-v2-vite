import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { SimpleButton } from '@components/button';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { Text } from '@components/table-input';
import { ITEMS_PAGE } from '@constants/Paginator';
import { Routes } from '@constants/Paths';
import usePermissions from '@hooks/usePermissions';
import { IGenericRecord } from '@models/GenericRecord';
import { deleteWarehousesDataBase } from '@redux/warehouses/actions';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { ModalDelete, ModalErrorDeleteInvoice, ModalTransferAlert } from './Modals';
import { TableHeader } from './TableHeader';

export const WarehousesTable: React.FC<IGenericRecord> = ({ setWarehouses = (): void => {}, warehouseList, isLoadingTable }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { data } = warehouseList;
    const { disabledInputs } = usePermissions();
    const [listDelete, setListDelete] = useState<string[]>([]);
    const [showTransferAlert, setShowTransferAlert] = useState<boolean>(false);
    const [showModalErrorInvoice, setShowModalErrorInvoice] = useState<boolean>(false);
    const [dataErrorInvoice, setDataErrorInvoice] = useState<IGenericRecord[]>([]);
    const [showModalDelete, setShowModalDelete] = useState(false);

    const navigateToDetail = (id: string): void => {
        history.push(`${getRoute(Routes.WAREHOUSES)}?detail=${id}`);
    };

    const toggleDelete = (id: string): void => {
        setListDelete(prevList => (prevList.includes(id) ? prevList.filter(item => item !== id) : [...prevList, id]));
    };

    const deleteWarehouse = async (): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await dispatch(deleteWarehousesDataBase(listDelete));

        if (response.invoices?.length) {
            const flattenedInvoices = response.invoices.flatMap((warehouse: IGenericRecord) => warehouse.invoices);
            setListDelete(response.invoices.map((warehouse: IGenericRecord) => warehouse.id));
            setDataErrorInvoice(flattenedInvoices);
            setShowModalDelete(false);
            return setShowModalErrorInvoice(true);
        }
        if (response.inventory?.length) {
            setShowTransferAlert(true);
        }
        setShowModalDelete(false);
    };

    return (
        <div className="flex flex-col">
            <ModalDelete
                listDelete={listDelete}
                onCancel={(): void => {
                    setShowModalDelete(false);
                }}
                onConfirm={deleteWarehouse}
                show={showModalDelete}
            />
            <ModalTransferAlert
                listDelete={listDelete}
                onClose={async (): Promise<void> => {
                    setShowTransferAlert(false);
                    setListDelete([]);
                }}
                show={showTransferAlert}
            />
            <ModalErrorDeleteInvoice
                listDelete={listDelete}
                onClose={async (): Promise<void> => {
                    setShowModalErrorInvoice(false);
                }}
                show={showModalErrorInvoice}
                invoices={dataErrorInvoice}
            />
            <div className="warehouse-list__wrapper-table">
                <Icon
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        submodule: `${ModuleApp.MODALS}-delete`,
                        action: ActionElementType.TRASH,
                        elementType: ElementType.ICO,
                    })}
                    name="trashBlue"
                    classIcon="w-5.5 m-2 cursor-pointer self-end"
                    {...(listDelete.length && !disabledInputs && { onClick: (): void => setShowModalDelete(!showModalDelete) })}
                />
                <Table
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                        action: ActionElementType.INFO,
                        elementType: ElementType.TBL,
                    })}
                    isLoading={isLoadingTable}
                    customTable
                    isHeaderRowsCustom
                    data={[]}
                    isNew
                    headerRowsCustom={<TableHeader />}
                    className="warehouse-list__table-container"
                    wrapperClassName="warehouse-list__table-wrapper"
                    paginatorBackendData={{
                        ...warehouseList,
                        setData: (data: IGenericRecord[]): void => {
                            const [{ warehouses }] = data || {};
                            setWarehouses(warehouses);
                        },
                    }}
                >
                    {data.map((warehouse: IGenericRecord, index: number) => (
                        <tr
                            id={generateId({
                                module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                submodule: `warehouse-${warehouse.id}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.ROW,
                            })}
                            key={warehouse.id}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-light'}`}
                        >
                            <td className="h-10 xs:h-8.75 border-0 bg-gray-background">
                                <div
                                    className={`w-5 h-5 border rounded cursor-pointer border-gray ${
                                        listDelete?.includes(warehouse.id) ? 'bg-blue' : ''
                                    }`}
                                    {...(!disabledInputs && { onClick: (): void => toggleDelete(warehouse.id) })}
                                />
                            </td>
                            <td className="border-b border-gray">
                                <Text
                                    text={String(index + 1)}
                                    disabled
                                    type="text"
                                    editTable={false}
                                    className="p-2 text-sm text-gray font-aller"
                                />
                            </td>
                            <td className="border-b border-gray">
                                <SimpleButton
                                    id={generateId({
                                        module: ModuleApp.TECHNICAL_SHEET_WAREHOUSES,
                                        submodule: `warehouse-${warehouse.id}`,
                                        action: ActionElementType.REDIRECT,
                                        elementType: ElementType.BTN,
                                    })}
                                    onClick={(): void => navigateToDetail(warehouse.id)}
                                    className="text-sm underline cursor-pointer text-purple font-aller hover:text-green"
                                >
                                    {warehouse.name}
                                </SimpleButton>
                            </td>
                            <td className="border-b border-gray">
                                <Text
                                    text={warehouse.country_name}
                                    disabled
                                    type="text"
                                    editTable={false}
                                    className="p-2 text-sm text-gray font-aller"
                                />
                            </td>
                            <td className="border-b border-gray">
                                <Text
                                    text={warehouse.department_name}
                                    disabled
                                    type="text"
                                    editTable={false}
                                    className="p-2 text-sm text-gray font-aller"
                                />
                            </td>
                            <td className="border-b border-gray">
                                <Text
                                    text={warehouse.city_name}
                                    disabled
                                    type="text"
                                    editTable={false}
                                    className="p-2 text-sm text-gray font-aller"
                                />
                            </td>
                            <td className="border-b border-gray">
                                <Text
                                    text={warehouse.address}
                                    disabled
                                    type="text"
                                    editTable={false}
                                    className="p-2 text-sm text-gray font-aller"
                                />
                            </td>
                        </tr>
                    ))}
                </Table>
                <div className={`${data?.length > ITEMS_PAGE ? 'xs:mt-2' : 'mt-9.5'} flex w-full pl-8`}>
                    <div className="border-b warehouse-list__total-warehouses border-gray">
                        <Text
                            text="Total bodegas"
                            disabled
                            type="text"
                            editTable={false}
                            className="h-full p-2 text-sm text-blue font-allerbold"
                        />
                    </div>
                    <div className="warehouse-list__total">
                        <Text
                            text={warehouseList?.meta?.total}
                            disabled
                            type="text"
                            editTable={false}
                            className="h-full p-2 text-sm text-gray font-aller"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
