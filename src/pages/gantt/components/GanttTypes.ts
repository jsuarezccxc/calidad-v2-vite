/**
 * Custom Gantt Types - React 18 Compatible
 * Replaces gantt-task-react types
 */

/**
 * View modes for the Gantt chart
 */
export enum ViewMode {
    Hour = 'Hour',
    QuarterDay = 'QuarterDay',
    HalfDay = 'HalfDay',
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Year = 'Year',
}

/**
 * Task styles configuration
 */
export interface TaskStyles {
    progressColor?: string;
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressSelectedColor?: string;
}

/**
 * Task type for Gantt chart
 */
export interface Task {
    id: string;
    name: string;
    start: Date;
    end: Date;
    progress: number;
    type?: 'task' | 'milestone' | 'project';
    isDisabled?: boolean;
    styles?: TaskStyles;
    dependencies?: string[];
}

/**
 * Props for the custom Gantt component
 */
export interface GanttProps {
    tasks: Task[];
    viewMode?: ViewMode;
    columnWidth?: number;
    rowHeight?: number;
    headerHeight?: number;
    fontSize?: string;
    locale?: string;
    arrowColor?: string;
    onDateChange?: (task: Task) => void;
    onDoubleClick?: (task: Task) => void;
    TooltipContent?: React.FC<{ task: Task }>;
    TaskListHeader?: React.FC;
    TaskListTable?: React.FC<{ tasks: Task[] }>;
}
