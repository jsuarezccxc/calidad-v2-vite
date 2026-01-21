import React, { Fragment } from 'react';
import { Task } from 'gantt-task-react';
import { getDateFormat } from '@utils/Date';

export const TaskListTable: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
    <Fragment>
        {tasks.map(({ end, id, name, start }: Task) => (
            <div className="gantt__table-row" key={id}>
                <p className="pr-2 truncate gantt__table-text" title={name}>
                    {name}
                </p>
                <p className="gantt__table-text">{getDateFormat(start, true).formattedDate}</p>
                <p className="gantt__table-text">{getDateFormat(end, true).formattedDate}</p>
            </div>
        ))}
    </Fragment>
);
