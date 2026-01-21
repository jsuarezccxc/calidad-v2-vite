import React from 'react';

export const TaskListHeader: React.FC = () => (
    <div className="gantt__list-header">
        <p className="flex-1 text-sm font-allerbold text-blue">Nombre</p>
        <p className="flex-1 text-sm font-allerbold text-blue">De </p>
        <p className="flex-1 text-sm font-allerbold text-blue">Hasta</p>
    </div>
);
