import React, { useMemo } from 'react';
import { Task } from './GanttTypes';
import { getDateFormat, SubtractDays } from '@utils/Date';

export const TaskTooltip: React.FC<{ task: Task }> = ({ task }) => {
    const taskDays = useMemo(() => SubtractDays(task.start.getTime(), task.end.getTime()), []);

    return (
        <div className="gantt__task-tooltip">
            <p className="text-sm font-allerbold text-blue">
                {task.name}: {getDateFormat(task.start, true).formattedDate} - {getDateFormat(task.end, true).formattedDate}
            </p>
            <p className="mt-1 text-xs text-gray-dark">
                Duración: {taskDays} día{taskDays > 1 ? 's' : ''}
            </p>
            <p className="mt-1 text-xs text-gray-dark">Progreso: {task.progress}%</p>
        </div>
    );
};
