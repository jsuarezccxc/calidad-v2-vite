import React from 'react';
import { TooltipTable } from '@components/tooltip-table';
import { BODY_TOOLTIP, TABLE_TOOLTIPS } from '@information-texts/DatabaseEmployees';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { IHeaderTableDatabaseEmployee } from '..';

export const HeaderDatabaseEmployee: React.FC<IHeaderTableDatabaseEmployee> = ({ data }) => {
    return (
        <tr className="header-database-employees">
            {data.map((header, index) => (
                <th
                    id={generateId({
                        module: ModuleApp.TECHNICAL_SHEET_EMPLOYEES,
                        submodule: `header-${index}`,
                        action: ActionElementType.INFO,
                        elementType: ElementType.COL,
                    })}
                    key={`col-${index}`}
                    className="field-header--uneditable w-col-header"
                >
                    <div className="container__tooltip">
                        {header.title === TABLE_TOOLTIPS.STATE.title && (
                            <TooltipTable
                                text={BODY_TOOLTIP(TABLE_TOOLTIPS.STATE)}
                                className="rounded material-tooltip"
                                disabledDefinitionSection
                            />
                        )}
                        <p>{header.title}</p>
                    </div>
                </th>
            ))}
        </tr>
    );
};
