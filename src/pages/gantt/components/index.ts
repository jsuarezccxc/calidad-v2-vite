import React from 'react';
import styled from '@emotion/styled';
import { Task, ViewMode } from './GanttTypes';

export * from './GanttTypes';
export * from './GanttChart';
export * from './Slider';
export * from './TaskForm';
export * from './TaskListHeader';
export * from './TaskListTable';
export * from './TaskTooltip';
export * from './ViewModes';

/**
 * This interface describes the slider props
 *
 * @typeParam setTask: React.Dispatch<React.SetStateAction<Task>> - Function to set a new task
 * @typeParam task: Task - Selected task
 * @typeParam disabled: boolean - Optional disabled field
 */
export interface ISliderProps {
    setTask: React.Dispatch<React.SetStateAction<Task>>;
    task: Task;
    disabled?: boolean;
}

/**
 * This interface describes the view modes props
 *
 * @typeParam deleteTask: () => void - Function to delete tasks
 * @typeParam handleChangeDate: (value: Date, name: string) => void - Function to change the dates of the tasks
 * @typeParam onSubmit: () => void - Function to save the task data
 * @typeParam showModal: boolean - Indicates when to show the modal
 * @typeParam setTask: React.Dispatch<React.SetStateAction<Task>> - Function to set a new task
 * @typeParam task: Task - Selected task
 * @typeParam toggleModal: () => void - Function to hide and show the modal
 * @typeParam updateTask: boolean - Indicates if current task should be edited
 * @typeParam validateForm: boolean - Indicates if the form should be validated
 */
export interface ITaskFormProps {
    deleteTask: () => void;
    handleChangeDate: (value: Date, name: string) => void;
    onSubmit: () => void;
    showModal: boolean;
    setTask: React.Dispatch<React.SetStateAction<Task>>;
    task: Task;
    toggleModal: () => void;
    updateTask: boolean;
    validateForm: boolean;
}

/**
 * This interface describes the view modes props
 *
 * @typeParam setViewMode: React.Dispatch<React.SetStateAction<ViewMode>> - Function to change the view mode
 * @typeParam viewMode: ViewMode - Selected view mode
 */
export interface IViewModesProps {
    setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
    viewMode: ViewMode;
}

/**
 * List with the view modes used to see the tasks
 */
export const VIEW_MODES: { key: ViewMode; value: string }[] = [
    {
        key: ViewMode.Hour,
        value: 'Hora',
    },
    {
        key: ViewMode.QuarterDay,
        value: 'Cuarto de día',
    },
    {
        key: ViewMode.HalfDay,
        value: 'Medio día',
    },
    {
        key: ViewMode.Day,
        value: 'Día',
    },
    {
        key: ViewMode.Week,
        value: 'Semana',
    },
    {
        key: ViewMode.Month,
        value: 'Mes',
    },
    {
        key: ViewMode.Year,
        value: 'Año',
    },
];

/**
 * Positions on the slider ball
 */
const progressLeft: { [progress: number]: string } = {
    0: '10px',
    50: '20px',
    100: '30px',
};

/**
 * Function that returns the progress position of the slider
 *
 * @param progress: number - Task progress
 * @returns string
 */
const getProgressPosition = (progress: number): string => progressLeft[progress] || (progress > 50 ? '25px' : '15px');

/**
 * Styled component of the slider wrapper
 */
export const SliderWrapper = styled.div<{ progress: number }>`
    .gantt {
        &__slider-marker {
            left: ${({ progress }: { progress: number }): string => `calc(${progress}% - ${getProgressPosition(progress)})`};
        }
    }
`;
