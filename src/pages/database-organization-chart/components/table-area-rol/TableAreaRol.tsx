import React from 'react';
import { Icon } from '@components/icon';
import { Table } from '@components/table';
import { Checkbox } from '@components/checkbox';
import { TextInput } from '@components/input';
import { ORGANIZATION_CHART_CONTENT } from '@information-texts/DatabaseEmployees';
import {
    FIRST_ERROR,
    MAX_LENGTH,
    TYPE_AREA,
    TYPE_POSITION,
} from '@pages/database-organization-chart/constants/DatabaseOrganizationChart';
import { IGenericRecord } from '@models/GenericRecord';
import { lengthGreaterThanZero } from '@utils/Length';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';
import { ITableAreaRolProps, TypeAction, TypeError } from '../../models/DatabaseOrganizationChart';

const HeaderTable: React.FC = () => {
    return (
        <tr className="table-data__header">
            <th className="column-title"></th>
            <th className="column-title">Área</th>
            <th className="column-title">Cargo</th>
            <th className="column-title"></th>
        </tr>
    );
};

export const TableAreaRol: React.FC<ITableAreaRolProps> = ({
    data,
    dataDelete,
    actionsTable,
    errors,
    isSubmitted,
    isFiltered,
}) => {
    const { disabledInputs } = usePermissions();
    const { ERROR, ERROR_POSITION, ERROR_EXIST, ERROR_EXIST_POSITION } = ORGANIZATION_CHART_CONTENT;
    const { handleActionsArea, handleActionsPosition, handleDelete } = actionsTable;
    const { areas, positions } = dataDelete;

    const isEven = (index: number): boolean => (index + 1) % 2 === 0;
    const calculateRowSpan = (data: IGenericRecord[] = []): number => data?.length + 1;

    const showSpecificArea = (id: string): boolean => (isFiltered ? id === isFiltered : true);
    const findArea = (id: string): boolean => areas.some((area: string) => area === id);
    const findPosition = (id: string): boolean => positions.some((position: string) => position === id);
    const showMessageError = (type: string, error: TypeError): string => {
        if (type === TYPE_AREA && error === TypeError.EXIST) return ERROR_EXIST;
        if (type === TYPE_POSITION && error === TypeError.REQUIRED) return ERROR_POSITION;
        if (type === TYPE_POSITION && error === TypeError.EXIST) return ERROR_EXIST_POSITION;
        return ERROR;
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-end justify-end py-2 trash-width">
                <Icon
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                        submodule: `organization-chart-area-rol`,
                        action: ActionElementType.TRASH,
                        elementType: ElementType.ICO,
                    })}
                    name="trashBlue"
                    classIcon="w-5.5 h-5.5 cursor-pointer"
                    {...(!disabledInputs && { onClick: (): void => handleDelete() })}
                />
            </div>
            <Table
                id={generateId({
                    module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                    submodule: 'organization-chart-area-rol',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TBL,
                })}
                isHeaderRowsCustom
                headerRowsCustom={<HeaderTable />}
                editable={!disabledInputs}
                disabled={disabledInputs}
                data={[]}
                className="table-data"
                customTable
            >
                {data.map(({ id, temporal_id, name: name_area, positions }, index) =>
                    showSpecificArea(id || temporal_id || '') ? (
                        <React.Fragment key={`${index}-area`}>
                            {lengthGreaterThanZero(positions) ? (
                                positions?.map(({ id: id_position, temporal_id: temporal_id_position, name }, indexPosition) => (
                                    <tr
                                        id={generateId({
                                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                            submodule: `organization-chart-area-rol-${index}-${indexPosition}-position`,
                                            action: ActionElementType.INFO,
                                            elementType: ElementType.ROW,
                                        })}
                                        className="table-data__item"
                                        key={`${index}-${indexPosition}-position`}
                                    >
                                        {indexPosition === 0 && (
                                            <>
                                                <td
                                                    className="column-field-transparent width-checkbox"
                                                    rowSpan={calculateRowSpan(positions)}
                                                >
                                                    <Checkbox
                                                        disabled={disabledInputs}
                                                        checked={findArea(id || temporal_id || '')}
                                                        onChange={(): void =>
                                                            handleActionsArea(TypeAction.SELECT, id || temporal_id)
                                                        }
                                                    />
                                                </td>
                                                <td
                                                    className={`${
                                                        isEven(index) ? 'column-field-even' : 'column-field-odd'
                                                    } width-area`}
                                                    rowSpan={calculateRowSpan(positions)}
                                                >
                                                    <TextInput
                                                        id={generateId({
                                                            module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                                            submodule: `organization-chart-area-rol-${index}-${indexPosition}-position-area`,
                                                            action: ActionElementType.INFO,
                                                            elementType: ElementType.TXT,
                                                        })}
                                                        value={name_area}
                                                        maxLength={MAX_LENGTH.AREA}
                                                        lettersWithAccent
                                                        classesWrapperInput="input--styles"
                                                        onChange={(event): void =>
                                                            handleActionsArea(TypeAction.WRITE, id || temporal_id, event)
                                                        }
                                                        classesInput="bg--input"
                                                        classesWrapper="w-full"
                                                        disabled={disabledInputs}
                                                    />
                                                </td>
                                            </>
                                        )}
                                        <td
                                            className={`h-10 ${
                                                isEven(index) ? 'column-field-even' : 'column-field-odd'
                                            } width-rol`}
                                        >
                                            <TextInput
                                                id={generateId({
                                                    module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                                    submodule: `organization-chart-area-rol-${index}-${indexPosition}-position`,
                                                    action: ActionElementType.INFO,
                                                    elementType: ElementType.TXT,
                                                })}
                                                value={name}
                                                maxLength={MAX_LENGTH.POSITION}
                                                lettersWithAccent
                                                onChange={(event): void =>
                                                    handleActionsPosition(
                                                        TypeAction.WRITE,
                                                        id || temporal_id || '',
                                                        id_position || temporal_id_position,
                                                        event
                                                    )
                                                }
                                                classesWrapperInput="input-rol--styles"
                                                classesInput="bg--input"
                                                disabled={disabledInputs}
                                            />
                                        </td>
                                        <td className="h-10 column-field-transparent width-checkbox">
                                            <Checkbox
                                                checked={findPosition(id_position || temporal_id_position || '')}
                                                onChange={(): void =>
                                                    handleActionsPosition(
                                                        TypeAction.SELECT,
                                                        id || temporal_id || '',
                                                        id_position || temporal_id_position
                                                    )
                                                }
                                                disabled={disabledInputs}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <>
                                    <tr className="table-data__item">
                                        <td className="column-field-transparent width-checkbox" rowSpan={calculateRowSpan([])}>
                                            <Checkbox
                                                checked={findArea(id || temporal_id || '')}
                                                onChange={(): void => handleActionsArea(TypeAction.SELECT, id || temporal_id)}
                                                disabled={disabledInputs}
                                            />
                                        </td>
                                        <td
                                            className={`${isEven(index) ? 'column-field-even' : 'column-field-odd'} width-area`}
                                            rowSpan={calculateRowSpan([])}
                                        >
                                            <TextInput
                                                id={generateId({
                                                    module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                                                    submodule: `organization-chart-area-rol-${index}-area`,
                                                    action: ActionElementType.INFO,
                                                    elementType: ElementType.TXT,
                                                })}
                                                value={name_area}
                                                maxLength={MAX_LENGTH.AREA}
                                                lettersWithAccent
                                                onChange={(event): void =>
                                                    handleActionsArea(TypeAction.WRITE, id || temporal_id, event)
                                                }
                                                classesWrapperInput="input--styles"
                                                classesInput="bg--input"
                                                disabled={disabledInputs}
                                            />
                                        </td>
                                        <td
                                            className={`h-10 ${
                                                isEven(index) ? 'column-field-even' : 'column-field-odd'
                                            } width-rol`}
                                        >
                                            <div
                                                className={disabledInputs ? 'link--disabled' : 'link--style'}
                                                {...(!disabledInputs && {
                                                    onClick: (): void =>
                                                        handleActionsPosition(TypeAction.ADD, id || temporal_id || ''),
                                                })}
                                            >
                                                + Agregar cargo
                                            </div>
                                        </td>
                                        <td className="column-field-transparent width-checkbox" />
                                    </tr>
                                </>
                            )}
                            {lengthGreaterThanZero(positions) && (
                                <tr className="table-data__item">
                                    <td className={`h-10 ${isEven(index) ? 'column-field-even' : 'column-field-odd'} width-rol`}>
                                        <div
                                            className={disabledInputs ? 'link--disabled' : 'link--style'}
                                            {...(!disabledInputs && {
                                                onClick: (): void =>
                                                    handleActionsPosition(TypeAction.ADD, id || temporal_id || ''),
                                            })}
                                        >
                                            + Agregar cargo
                                        </div>
                                    </td>
                                    <td className="column-field-transparent width-checkbox" />
                                </tr>
                            )}
                        </React.Fragment>
                    ) : null
                )}
            </Table>
            {isSubmitted && lengthGreaterThanZero(errors) && (
                <div className="mt-2 ml-10 text-sm text-purple">
                    {showMessageError(errors[FIRST_ERROR].type, errors[FIRST_ERROR].error)}
                </div>
            )}
            {!isFiltered && (
                <div
                    className={`mt-2 ml-10 ${disabledInputs ? 'link--disabled' : 'link--style'}`}
                    {...(!disabledInputs && { onClick: (): void => handleActionsArea(TypeAction.ADD) })}
                >
                    + Agregar área
                </div>
            )}
        </div>
    );
};
