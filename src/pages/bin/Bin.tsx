import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import useFilter from '@hooks/useFilter';
import useSearch from '@hooks/useSearch';
import { IOptionSelect, SearchInput, SelectInput } from '@components/input';
import { PageTitle } from '@components/page-title';
import { Table } from '@components/table';
import { TitleButtons } from '@constants/Buttons';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { NotFindElements } from '@components/not-find-elements';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { searchData } from '@utils/Search';
import { ModuleApp } from '@utils/GenerateId';
import { RootState } from '@redux/rootReducer';
import { getBinInformation, restoreInformation } from '@redux/bin/actions';
import { IGenericRecord } from '@models/GenericRecord';
import usePermissions from '@hooks/usePermissions';
import { fieldsBody, headersTable, keyForSearch, optionsFilterBy } from '.';

/**
 * Bin page where user can restore any item for any category
 *
 * @returns A react element
 */
const Bin: React.FC = (): React.ReactElement => {
    const history = useHistory();
    const dispatch = useDispatch();

    const {
        bin: { data = [] },
    } = useSelector((state: RootState) => state);

    const [dataTable, setDataTable] = useState<IGenericRecord[]>([]);
    const [dataWhenSearching, setDataWhenSearching] = useState<IGenericRecord[]>([]);
    const [isSearch, setIsSearch] = useState<boolean>(false);

    const { onChangeFilter, filter, dataFiltered } = useFilter(
        lengthGreaterThanZero(dataWhenSearching) ? dataWhenSearching : dataTable
    );

    const { disabledInputs } = usePermissions();

    const withoutFilter = filter.some((fil: IGenericRecord) => fil.key === 'all');

    const { resultData, filterData, searchValue, setResultData } = useSearch(
        lengthGreaterThanZero(filter) && !withoutFilter ? dataFiltered : dataTable,
        keyForSearch
    );

    useEffect(() => {
        dispatch(getBinInformation());
        refactorData();

        if (searchValue) {
            setDataWhenSearching(resultData);
            setIsSearch(true);
        } else {
            setDataWhenSearching([]);
        }
    }, []);

    useEffect(() => {
        refactorData();
    }, [data]);

    useEffect(() => {
        setIsSearch(withoutFilter);

        if (withoutFilter) setResultData(searchData(dataTable, searchValue, keyForSearch));
    }, [dataFiltered]);

    useEffect(() => {
        if (searchValue) {
            setDataWhenSearching(resultData);
            setIsSearch(true);
        } else {
            setDataWhenSearching([]);
        }
    }, [searchValue]);

    const refactorData = (): void => setDataTable(data.map((item: IGenericRecord) => ({ ...item, category: item.category })));

    const dataForShowingTable = (): IGenericRecord[] => {
        if ((lengthEqualToZero(filter) || withoutFilter) && !searchValue) return dataTable;

        return isSearch ? resultData : dataFiltered;
    };

    const restore = (item: IGenericRecord): void => {
        dispatch(restoreInformation(item.id));
    };

    return (
        <>
            <PageTitle title="Papelera" />
            <p className="text-gray-dark my-7">
                Desde la papelera de reciclaje puede restaurar cualquier elemento que haya sido eliminado. Seleccione el elemento
                que desea restaurar y luego haga click en el botón Restaurar.
            </p>
            <div className="flex flex-col flex-1">
                <div className="flex flex-col lg:flex-row mb-7">
                    <SearchInput
                        name="searcher"
                        labelText="Buscador:"
                        placeholder="..."
                        value={searchValue}
                        onChange={filterData}
                    />
                    <SelectInput
                        name="filter-by"
                        labelText="Filtrar por:"
                        options={optionsFilterBy}
                        optionSelected={(option: IOptionSelect): void => onChangeFilter(option)}
                        placeholder="Productos, Servicios, Proveedores, Bodegas"
                        classesWrapper="w-73 lg:ml-7 xs:mt-2 mt-0"
                        selectTextClass={lengthGreaterThanZero(filter) ? 'text-sm' : 'text-tiny leading-4'}
                    />
                </div>

                <Table
                    headersTable={headersTable}
                    fieldsBody={fieldsBody(restore, disabledInputs)}
                    data={dataForShowingTable()}
                    editable={false}
                />

                {data && lengthEqualToZero(data) ? (
                    <NotFindElements customText="Hasta el momento no ha eliminado elementos." withoutData />
                ) : dataForShowingTable() && lengthEqualToZero(dataForShowingTable()) ? (
                    <NotFindElements />
                ) : (
                    <></>
                )}
            </div>
            <PageButtonsFooter
                moduleId={ModuleApp.BIN}
                bgColorLeftButton={'blue'}
                titleButtonLeft={TitleButtons.BACK}
                onClickButtonLeft={(): void => history.goBack()}
            />
        </>
    );
};

export default Bin;
