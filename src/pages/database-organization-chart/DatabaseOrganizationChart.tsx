import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { DATABASE_EMPLOYEE, ORGANIZATION_CHART_CONTENT } from '@information-texts/DatabaseEmployees';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { buildOptions } from '@utils/Company';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { IOptionSelect, SelectInput } from '@components/input';
import { ModalType, SharedModal } from '@components/modal';
import usePopper from '@hooks/usePopper';
import usePermissions from '@hooks/usePermissions';
import { IArea, IDeleteData } from '@models/DataEmployees';
import { RootState } from '@redux/rootReducer';
import { deleteDataAreas, getAreas, saveDataAreas } from '@redux/company/actions';
import {
    CurrentModal,
    CurrentTypeAction,
    IAreaData,
    IErrorTable,
    TypeAction,
    TypeModal,
    TypeSelection,
} from './models/DatabaseOrganizationChart';
import { useHandleActionsForm, useValidationForm } from './hooks';
import { TableAreaRol } from './components';
import { routes } from '.';
import './DatabaseOrganizationChart.scss';

const DatabaseOrganizationChart: React.FC = () => {
    const [history, dispatch] = [useHistory(), useDispatch()];
    const { disabledInputs } = usePermissions();
    const { anchorEl: anchorElTitle, mouseProps } = usePopper();
    const { handleAddData, handleEditData, handleDeleteData, getDataFilled } = useHandleActionsForm();
    const { validateFormTable } = useValidationForm();

    const {
        company: {
            areas: { data: areas },
        },
        session: { user },
    } = useSelector(({ company, session }: RootState) => ({ company, session }));
    const [dataTable, setDataTable] = useState<IAreaData[]>([]);
    const [isFiltered, setIsFiltered] = useState<string>('');
    const [errorsTable, setErrorsTable] = useState<IErrorTable[]>([]);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [modals, setModals] = useState<{
        save: boolean;
        area: boolean;
        position: boolean;
    }>({
        save: false,
        area: false,
        position: false,
    });
    const [dataToDelete, setDataToDelete] = useState<IDeleteData>({
        areas: [],
        positions: [],
    });

    const {
        TITLE,
        SUBTITLE,
        DESCRIPTION,
        AREA,
        TOOLTIP_TITLE,
        TOOLTIP_DESCRIPTION,
        MODAL_TITLE_AREA,
        MODAL_DESCRIPTION_AREA,
        MODAL_TITLE_POSITION,
        MODAL_DESCRIPTION_POSITION,
    } = ORGANIZATION_CHART_CONTENT;

    useEffect(() => {
        (async (): Promise<void> => {
            await dispatch(getAreas(true));
        })();
    }, []);

    useEffect(() => {
        handleSaveDataTable(areas || []);
    }, [areas]);

    useEffect(() => {
        isSubmitted && setIsSubmitted(false);
    }, [dataTable]);

    const handleSaveDataTable = (data: IAreaData[]): void => setDataTable(data);
    const handleModal = (type: CurrentModal): void => setModals({ ...modals, [type]: !modals[type] });
    const handleErrorsTable = (errors: IErrorTable[]): void => setErrorsTable(errors);

    const handleSelectElement = (id: string, type: TypeSelection): void => {
        const data = type === TypeSelection.AREAS ? [...dataToDelete.areas] : [...dataToDelete.positions];

        if (data.find(element => element === id)) {
            return setDataToDelete({
                ...dataToDelete,
                [type]: data.filter(item => item !== id),
            });
        }
        data.push(id);
        return setDataToDelete({
            ...dataToDelete,
            [type]: data,
        });
    };

    const handleAddArea = (): void => {
        const areaList = handleAddData(dataTable);
        handleSaveDataTable(areaList);
    };

    const handleAddPosition = (areaId: string): void => {
        const areaList = handleAddData(dataTable, areaId);
        handleSaveDataTable(areaList);
    };

    const handleEditArea = (areaId: string, value: string): void => {
        const newList = handleEditData(dataTable, value, areaId);
        handleSaveDataTable(newList);
    };

    const handleEditPosition = (areaId: string, positionId: string, value: string): void => {
        const newData = handleEditData(dataTable, value, areaId, positionId);
        handleSaveDataTable(newData);
    };

    const handleActionsArea = (type: CurrentTypeAction, areaId?: string, event?: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = event?.target || { value: '' };

        switch (type) {
            case TypeAction.WRITE:
                areaId && handleEditArea(areaId, value);
                break;
            case TypeAction.SELECT:
                areaId && handleSelectElement(areaId, TypeSelection.AREAS);
                break;
            default:
                handleAddArea();
                break;
        }
    };

    const handleActionsPosition = (
        type: CurrentTypeAction,
        areaId: string,
        positionId?: string,
        event?: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { value } = event?.target || { value: '' };

        switch (type) {
            case TypeAction.WRITE:
                positionId && handleEditPosition(areaId, positionId, value);
                break;
            case TypeAction.SELECT:
                positionId && handleSelectElement(positionId, TypeSelection.POSITIONS);
                break;
            default:
                handleAddPosition(areaId);
                break;
        }
    };

    const handleModalDelete = (): void => {
        const { areas, positions } = dataToDelete;

        if (lengthEqualToZero(areas) && lengthGreaterThanZero(positions)) {
            handleModal(TypeModal.POSITION);
        } else {
            handleModal(TypeModal.AREA);
        }
    };

    const handleDelete = async (): Promise<void> => {
        const newData = handleDeleteData(dataToDelete, dataTable);
        await dispatch(deleteDataAreas(dataToDelete));
        handleSaveDataTable(newData);
        setDataToDelete({
            areas: [],
            positions: [],
        });
    };

    const handleFilterByArea = (option: IOptionSelect): void => {
        setIsFiltered(option.id || '');
    };

    const handleSubmit = async (): Promise<void> => {
        if (lengthEqualToZero(dataTable)) return;
        setIsSubmitted(true);
        if (!validateFormTable(dataTable, handleErrorsTable)) return;
        const dataFormatted = getDataFilled(dataTable);
        const newData: IArea[] = dataFormatted?.map(({ id, name, positions }) => {
            return {
                id,
                name,
                company_id: user?.company_id || '',
                positions: positions?.map(position => ({
                    id: position.id,
                    name: position.name,
                })),
            };
        });

        await dispatch(saveDataAreas(newData, (): void => handleModal(TypeModal.SAVE)));
    };

    const handleRedirect = (path: string): void => history.push(path);

    return (
        <div className="database-organization-chart">
            <SharedModal
                moduleId={ModuleApp.TECHNICAL_SHEET_EMPLOYEES}
                open={modals.save}
                finalAction={(): void => handleModal(TypeModal.SAVE)}
            />
            <ModalType
                moduleId={`${ModuleApp.TECHNICAL_SHEET_EMPLOYEES}-organization-chart-area`}
                open={modals.area}
                finalAction={(): void => {
                    handleDelete();
                    handleModal(TypeModal.AREA);
                }}
                iconName="trashMulticolor"
                textButton={TitleButtons.DELETE}
                otherButton={{
                    textButton: TitleButtons.CANCEL,
                    onClick: (): void => handleModal(TypeModal.AREA),
                }}
                text={{
                    title: MODAL_TITLE_AREA,
                    description: MODAL_DESCRIPTION_AREA,
                }}
            />
            <ModalType
                moduleId={`${ModuleApp.TECHNICAL_SHEET_EMPLOYEES}-organization-chart-position`}
                open={modals.position}
                finalAction={(): void => {
                    handleDelete();
                    handleModal(TypeModal.POSITION);
                }}
                iconName="trashMulticolor"
                textButton={TitleButtons.DELETE}
                otherButton={{
                    textButton: TitleButtons.CANCEL,
                    onClick: (): void => handleModal(TypeModal.POSITION),
                }}
                text={{
                    title: MODAL_TITLE_POSITION,
                    description: MODAL_DESCRIPTION_POSITION,
                }}
            />
            <PageTitle title={DATABASE_EMPLOYEE.TITLE} classTitle="text-left text-base" classContainer="w-full" />
            <BreadCrumb routes={routes()} className="mb-4.5" />
            <h2 className="text-26lg mb-4.5 text-blue text-center font-allerbold">{TITLE}</h2>
            <Information
                title={SUBTITLE}
                customText={DESCRIPTION}
                isList
                onClickIcon={(): void => {}}
                hoverIcon={{ anchorElTitle, title: TOOLTIP_TITLE, description: TOOLTIP_DESCRIPTION, mouseProps }}
            />
            <SelectInput
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                    submodule: 'organization-chart-area-filter',
                    action: ActionElementType.INPUT,
                    elementType: ElementType.DRP,
                })}
                options={[
                    { key: '', value: 'Todas las areas' },
                    ...buildOptions(getDataFilled(dataTable)?.map(area => ({ ...area, id: area.id || area.temporal_id }))),
                ]}
                optionSelected={(option): void => handleFilterByArea(option)}
                labelText={AREA}
                placeholder="..."
                classesWrapper="filter-area"
            />
            <TableAreaRol
                data={dataTable}
                dataDelete={dataToDelete}
                actionsTable={{
                    handleActionsArea,
                    handleActionsPosition,
                    handleDelete: handleModalDelete,
                }}
                errors={errorsTable}
                isSubmitted={isSubmitted}
                isFiltered={isFiltered}
            />
            <PageButtonsFooter
                threeButtons
                disabledCenter={disabledInputs}
                titleButtonCenter={TitleButtons.SAVE}
                onClickButtonCenter={(): Promise<void> => handleSubmit()}
                {...buttonsFooterProps(
                    ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                    history,
                    (): void => handleRedirect(getRoute(Routes.DATABASE_MENU)),
                    {
                        name: '#',
                        moduleName: getRouteName(Routes.DATABASE_MENU),
                    }
                )}
            />
        </div>
    );
};

export default DatabaseOrganizationChart;
