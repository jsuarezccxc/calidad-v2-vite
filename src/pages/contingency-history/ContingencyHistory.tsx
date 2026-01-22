import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IGenericRecord } from '@models/GenericRecord';
import { IContingencyHistoryState } from '@models/ContingencyHistory';
import { RootState } from '@redux/rootReducer';
import { getContingencyHistory, putContingency } from '@redux/contingency/actions';
import { buttonsFooterProps } from '@utils/Button';
import { compareStrings } from '@utils/Validation';
import { isCorrectResponse } from '@utils/Response';
import { getDateAnyFormat, getUnixFromDate } from '@utils/Date';
import { TitleButtons } from '@constants/Buttons';
import { CONTINGENCY_STATE } from '@constants/ContingencyActivation';
import { Form } from '@components/form';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { ChangeEvent, DatePickerDayInput, SearchInput } from '@components/input';
import { TableHistory } from './components';
import { IFormState, UTILS } from '.';
import './ContingencyHistory.scss';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';

const ContingencyHistory: React.FC = () => {
    const [history, dispatch] = [useHistory(), useDispatch()];
    const { contingencies, loader: loaderState } = useSelector(({ contingency, loader }: RootState) => ({
        ...contingency,
        ...loader,
    }));
    const [{ search, date }, setFormState] = useState<IFormState>({ search: '', date: null });
    const [contingencyHistory, setContingencyHistory] = useState<IContingencyHistoryState[]>([]);

    const filterTable = (): IContingencyHistoryState[] => {
        return contingencies
            .filter(item => {
                const matchesSearch = search
                    ? compareStrings(item.description, search) || compareStrings(CONTINGENCY_STATE[item.status], search)
                    : true;
                const matchesDate = date ? item.start_date === getDateAnyFormat(date, 'YYYY-MM-DD') : true;
                return matchesSearch && matchesDate;
            })
            .map(item => ({ ...item, isEdit: false, isChange: false }));
    };

    const handleSearch = ({ target }: ChangeEvent): void => {
        setFormState({ date, search: target.value });
    };

    const handleDate = (date: Date): void => {
        setFormState({ search, date: date.toString() });
    };

    const handleItemTime = (id: string, time: string): void => {
        const updateHistory = contingencyHistory.map(contingency => {
            if (contingency.id === id) {
                return {
                    ...contingency,
                    end_time: time,
                    isChange: true,
                };
            }
            return contingency;
        });
        setContingencyHistory(updateHistory);
    };

    const handleItemEdit = (id: string, value: boolean): void => {
        const updateHistory = contingencyHistory.map(contingency => {
            if (contingency.id === id) {
                return {
                    ...contingency,
                    isEdit: value,
                    isChange: true,
                };
            }
            return contingency;
        });
        setContingencyHistory(updateHistory);
    };

    const handleItemDate = (id: string, date: Date): void => {
        const updateHistory = contingencyHistory.map(contingency => {
            if (contingency.id === id) {
                return {
                    ...contingency,
                    end_date: getDateAnyFormat(date, 'YYYY-MM-DD'),
                    isChange: true,
                };
            }
            return contingency;
        });
        setContingencyHistory(updateHistory);
    };

    const handleSave = async (): Promise<void> => {
        const update = contingencyHistory.find(item => item.isChange);
        if (update) {
            const { statusCode }: IGenericRecord = await dispatch(putContingency(update.id, update));
            if (isCorrectResponse(statusCode)) {
                dispatch(getContingencyHistory());
            }
        }
    };

    useEffect(() => {
        dispatch(getContingencyHistory());
    }, []);

    useEffect(() => {
        setContingencyHistory(filterTable());
    }, [contingencies, search, date]);

    return (
        <>
            <PageTitle title={UTILS.PAGE_TITLE} />
            <BreadCrumb routes={UTILS.ROUTES} />
            <Information
                {...UTILS.SUB_INFORMATION}
                classNameSubContainer="justify-center"
                classNameTitle="text-blue text-26lg mb-4.5"
            />
            <Form className="contingency-history__form ">
                <SearchInput
                    id={generateId({
                        module: ModuleApp.CONTINGENCY,
                        submodule: `history-search`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    classesWrapper="w-45 xs:w-full"
                    onChange={handleSearch}
                    labelText="Buscador:"
                    value={search}
                    name="search"
                />
                <DatePickerDayInput
                    id={generateId({
                        module: ModuleApp.CONTINGENCY,
                        submodule: `history-date`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    selected={date ? getUnixFromDate(date) : null}
                    classesWrapper="w-57.5 xs:w-full"
                    onChangeDate={handleDate}
                    showPlaceHolderDate
                    labelText="Fecha:"
                    maxDate={new Date()}
                />
            </Form>
            <TableHistory
                isLoadingTable={loaderState}
                data={contingencyHistory}
                handleItemDate={handleItemDate}
                handleItemTime={handleItemTime}
                handleItemEdit={handleItemEdit}
            />
            <PageButtonsFooter
                {...buttonsFooterProps(ModuleApp.CONTINGENCY, history, UTILS.NEXT_PAGE, { moduleName: '', name: '' })}
                titleButtonCenter={TitleButtons.SAVE}
                onClickButtonCenter={handleSave}
                threeButtons
            />
        </>
    );
};

export default ContingencyHistory;
