import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RadioButton } from '@components/radiobutton';
import { IOption, SelectSearch } from '@components/select-search';
import { Link, LinkColor } from '@components/button';
import { SharedModal } from '@components/modal';
import { Text } from '@components/table-input';
import { Table } from '@components/table';
import { Icon } from '@components/icon';
import { MaxLengthFields } from '@constants/ElectronicInvoice';
import { COLOMBIA_ID } from '@constants/Location';
import { ModalType as ModalOption } from '@constants/Modal';
import { YES } from '@constants/RadioButtonOptions';
import { IGenericRecord } from '@models/GenericRecord';
import { removePhysicalStore } from '@redux/company/actions';
import { isEven } from '@utils/Number';
import { IDataStore } from '..';
import { MAX_LENGTH_TEXT, getSelectSearchOptions, radioButtonPropsPhysicalStore } from '.';
import { RootState } from '@redux/rootReducer';

const PhysicalStore: React.FC<IGenericRecord> = ({
    dataTable,
    handleChangeText,
    handleChangeSelect,
    addNewPhysicalStore,
    filterDataDeleted,
    validationStore,
    hasPhysicalStore,
    setHasPhysicalStore,
}) => {
    const dispatch = useDispatch();

    const { countries, departments, groupedCities } = useSelector((state: RootState) => state.company);

    const [listDeleteStore, setListDeleteStore] = useState<string[]>([]);
    const [openShowModalDelete, setOpenShowModalDelete] = useState(false);

    const getCities = ({ department_id }: IDataStore): IOption[] => {
        const departmentCode = departments?.find(department => String(department.id) === String(department_id))?.code;
        return getSelectSearchOptions(departmentCode ? groupedCities[departmentCode.trim()] : []);
    };

    const toggleDelete = (id: string): void => {
        setListDeleteStore(prevList => (prevList.includes(id) ? prevList.filter(storeId => storeId !== id) : [...prevList, id]));
    };

    const deleteStore = async (): Promise<void> => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const listDelete: any = await dispatch(removePhysicalStore(listDeleteStore));

            if (listDelete.physical_store?.length) {
                filterDataDeleted([...listDelete.physical_store, ...listDeleteStore]);
            } else {
                filterDataDeleted(listDeleteStore);
            }

            setOpenShowModalDelete(false);
            setListDeleteStore([]);
        } catch (error) {
            console.error('Error al eliminar la tienda:', error);
        }
    };

    return (
        <section className="p-4 mb-4 bg-white rounded-md shadow-lg">
            <h2 className="mb-3 text-green font-allerbold">Tienda física</h2>
            <p className="font-allerbold text-base text-blue mb-4.5">¿Su empresa tiene tienda física?</p>
            <RadioButton
                classesLabel="text-blue"
                {...radioButtonPropsPhysicalStore({
                    selected: hasPhysicalStore,
                    setSelected: setHasPhysicalStore,
                })}
            />
            {hasPhysicalStore === YES && (
                <>
                    <div className="flex justify-end mb-2 mt-4.5">
                        <Icon
                            name="trashBlue"
                            className="self-end"
                            hoverIcon="trashGreen"
                            onClick={(): void =>
                                setOpenShowModalDelete(listDeleteStore.length ? !openShowModalDelete : openShowModalDelete)
                            }
                        />
                    </div>
                    <Table data={[]} customTable={true} isHeaderRowsCustom={true} headerRowsCustom={<TableHeader />}>
                        {dataTable.map((store: IDataStore, index: number) => (
                            <tr key={`row-store-${store.id}`}>
                                <td className="h-10 m-auto">
                                    <div
                                        className={`w-5 h-5 ml-2 border rounded ${
                                            listDeleteStore.includes(store.id) ? 'bg-blue' : ''
                                        }`}
                                        onClick={(): void => toggleDelete(store.id)}
                                    />
                                </td>
                                <td
                                    className={`border-b border-gray ${isEven(index) ? '' : 'bg-gray-light'} ${
                                        validationStore && !store.name ? 'border border-purple' : ''
                                    }`}
                                >
                                    <Text
                                        type="text"
                                        name="name"
                                        text={store.name}
                                        onChange={(e): void => handleChangeText(e.target, store.id)}
                                        editTable
                                        disabled={false}
                                        className="table-store__text"
                                        maxLength={MAX_LENGTH_TEXT}
                                    />
                                </td>
                                <td
                                    className={`border-b border-gray ${isEven(index) ? '' : 'bg-gray-light'} ${
                                        validationStore && !store.address ? 'border border-purple' : ''
                                    }`}
                                >
                                    <Text
                                        type="text"
                                        name="address"
                                        text={store.address}
                                        onChange={(e): void => handleChangeText(e.target, store.id)}
                                        editTable
                                        className="table-store__text"
                                        disabled={false}
                                        maxLength={MAX_LENGTH_TEXT}
                                    />
                                </td>
                                <td
                                    className={`border-b border-gray ${isEven(index) ? '' : 'bg-gray-light'} ${
                                        validationStore && !store.country_id ? 'border border-purple' : ''
                                    }`}
                                >
                                    <SelectSearch
                                        options={getSelectSearchOptions(countries) || []}
                                        value={store.country_id?.toString()}
                                        onChange={(e): void => handleChangeSelect(e, 'country', store.id)}
                                        className="text-left"
                                        selectIconType="arrowDownGreen"
                                    />
                                </td>
                                <td
                                    className={`border-b border-gray ${isEven(index) ? '' : 'bg-gray-light'} ${
                                        validationStore && !store.department_name ? 'border border-purple' : ''
                                    }`}
                                >
                                    {Number(store.country_id) === COLOMBIA_ID ? (
                                        <SelectSearch
                                            options={getSelectSearchOptions(departments) || []}
                                            value={store.department_id?.toString()}
                                            onChange={(e): void => handleChangeSelect(e, 'department', store.id)}
                                            disabled={false}
                                            selectIconType="arrowDownGreen"
                                        />
                                    ) : (
                                        <Text
                                            type="text"
                                            name="department_name"
                                            text={store.department_name}
                                            onChange={(e): void => handleChangeText(e.target, store.id)}
                                            editTable
                                            className="table-store__text"
                                            disabled={false}
                                        />
                                    )}
                                </td>
                                <td
                                    className={`border-b border-gray ${isEven(index) ? '' : 'bg-gray-light'} ${
                                        validationStore && !store.city_name ? 'border border-purple' : ''
                                    }`}
                                >
                                    {Number(store.country_id) === COLOMBIA_ID ? (
                                        <SelectSearch
                                            options={getCities(store)}
                                            value={store.city_id?.toString()}
                                            onChange={(e): void => handleChangeSelect(e, 'city', store.id)}
                                            name="city"
                                            disabled={false}
                                            selectIconType="arrowDownGreen"
                                        />
                                    ) : (
                                        <Text
                                            type="text"
                                            name="city_name"
                                            text={store.city_name}
                                            onChange={(e): void => handleChangeText(e.target, store.id)}
                                            editTable
                                            className="table-store__text"
                                            disabled={false}
                                        />
                                    )}
                                </td>
                                <td
                                    className={`border-b border-gray ${isEven(index) ? '' : 'bg-gray-light'} ${
                                        validationStore && !store.phone ? 'border border-purple' : ''
                                    }`}
                                >
                                    <Text
                                        type="number"
                                        name="phone"
                                        text={store.phone}
                                        onChange={(e): void => handleChangeText(e.target, store.id)}
                                        editTable
                                        maxLength={MaxLengthFields.PHONE}
                                        className="table-store__text w-25 hidden__arrow"
                                        disabled={false}
                                    />
                                </td>
                            </tr>
                        ))}
                    </Table>
                    {validationStore && (
                        <label className="self-start text-tiny text-purple mr-1.5 ml-8 text-left leading-xtiny mt-1 block">
                            *Campos obligatorios
                        </label>
                    )}
                    <Link
                        classes="mt-2 text-base cursor-pointer"
                        text="+ Agregar tienda física"
                        href="#"
                        linkColor={LinkColor.GREEN}
                        onClick={addNewPhysicalStore}
                        disabled={false}
                    />
                </>
            )}
            <SharedModal
                handleClosed={(): void => setOpenShowModalDelete(!openShowModalDelete)}
                open={openShowModalDelete}
                finalAction={(): void => {
                    deleteStore();
                }}
                type={ModalOption.Delete}
                iconName="trashMulticolor"
                text={{ title: 'Eliminar', description: '¿Está seguro que desea eliminar los elementos seleccionados?' }}
            />
        </section>
    );
};

export default PhysicalStore;

const TableHeader: React.FC = () => {
    return (
        <tr className="leading-none">
            <th className="w-10 h-10" />
            <th className="table-store__standard">*Nombre de la sede</th>
            <th className="table-store__standard">*Dirección</th>
            <th className="table-store__standard">*Pais</th>
            <th className="table-store__standard">*Departamento/ estado</th>
            <th className="table-store__standard">*Ciudad</th>
            <th className="table-store__phone">*Teléfono</th>
        </tr>
    );
};
