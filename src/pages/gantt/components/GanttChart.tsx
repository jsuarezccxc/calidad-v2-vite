import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GanttProps, Task, ViewMode } from './GanttTypes';

/**
 * Custom Gantt Chart Component - React 18 Compatible
 * Replaces gantt-task-react library
 */
export const GanttChart: React.FC<GanttProps> = ({
    tasks,
    viewMode = ViewMode.Day,
    columnWidth = 60,
    rowHeight = 50,
    headerHeight = 50,
    fontSize = '0.875rem',
    locale = 'es-CO',
    arrowColor = 'gray',
    onDateChange,
    onDoubleClick,
    TooltipContent,
    TaskListHeader,
    TaskListTable,
}) => {
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState<{ task: Task; type: 'move' | 'resize-start' | 'resize-end' } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Calculate date range
    const { startDate, endDate, columns } = useMemo(() => {
        if (!tasks.length) return { startDate: new Date(), endDate: new Date(), columns: [] };

        let minDate = new Date(tasks[0].start);
        let maxDate = new Date(tasks[0].end);

        tasks.forEach(task => {
            if (task.start < minDate) minDate = new Date(task.start);
            if (task.end > maxDate) maxDate = new Date(task.end);
        });

        // Add padding
        minDate.setDate(minDate.getDate() - 1);
        maxDate.setDate(maxDate.getDate() + 7);

        const cols: Date[] = [];
        const current = new Date(minDate);

        while (current <= maxDate) {
            cols.push(new Date(current));
            switch (viewMode) {
                case ViewMode.Hour:
                    current.setHours(current.getHours() + 1);
                    break;
                case ViewMode.QuarterDay:
                    current.setHours(current.getHours() + 6);
                    break;
                case ViewMode.HalfDay:
                    current.setHours(current.getHours() + 12);
                    break;
                case ViewMode.Day:
                    current.setDate(current.getDate() + 1);
                    break;
                case ViewMode.Week:
                    current.setDate(current.getDate() + 7);
                    break;
                case ViewMode.Month:
                    current.setMonth(current.getMonth() + 1);
                    break;
                case ViewMode.Year:
                    current.setFullYear(current.getFullYear() + 1);
                    break;
            }
        }

        return { startDate: minDate, endDate: maxDate, columns: cols };
    }, [tasks, viewMode]);

    // Format date for header display
    const formatHeaderDate = useCallback((date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {};
        switch (viewMode) {
            case ViewMode.Hour:
                options.hour = '2-digit';
                options.minute = '2-digit';
                break;
            case ViewMode.QuarterDay:
            case ViewMode.HalfDay:
                options.day = '2-digit';
                options.hour = '2-digit';
                break;
            case ViewMode.Day:
                options.day = '2-digit';
                options.month = 'short';
                break;
            case ViewMode.Week:
                options.day = '2-digit';
                options.month = 'short';
                break;
            case ViewMode.Month:
                options.month = 'short';
                options.year = 'numeric';
                break;
            case ViewMode.Year:
                options.year = 'numeric';
                break;
        }
        return date.toLocaleDateString(locale, options);
    }, [viewMode, locale]);

    // Calculate task position
    const getTaskPosition = useCallback((task: Task) => {
        const totalTime = endDate.getTime() - startDate.getTime();
        const taskStart = task.start.getTime() - startDate.getTime();
        const taskDuration = task.end.getTime() - task.start.getTime();

        const totalWidth = columns.length * columnWidth;
        const x = (taskStart / totalTime) * totalWidth;
        const width = Math.max((taskDuration / totalTime) * totalWidth, 20);

        return { x, width };
    }, [startDate, endDate, columns.length, columnWidth]);

    // Handle mouse move for dragging
    const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (!dragging || !svgRef.current || !onDateChange) return;

        const rect = svgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const totalWidth = columns.length * columnWidth;
        const totalTime = endDate.getTime() - startDate.getTime();

        const timePerPixel = totalTime / totalWidth;
        const newTime = startDate.getTime() + (x * timePerPixel);

        const updatedTask = { ...dragging.task };

        if (dragging.type === 'move') {
            const duration = updatedTask.end.getTime() - updatedTask.start.getTime();
            updatedTask.start = new Date(newTime);
            updatedTask.end = new Date(newTime + duration);
        } else if (dragging.type === 'resize-end') {
            updatedTask.end = new Date(Math.max(newTime, updatedTask.start.getTime() + 86400000));
        } else if (dragging.type === 'resize-start') {
            updatedTask.start = new Date(Math.min(newTime, updatedTask.end.getTime() - 86400000));
        }

        setDragging({ ...dragging, task: updatedTask });
    }, [dragging, columns.length, columnWidth, startDate, endDate, onDateChange]);

    // Handle mouse up (end drag)
    const handleMouseUp = useCallback(() => {
        if (dragging && onDateChange) {
            onDateChange(dragging.task);
        }
        setDragging(null);
    }, [dragging, onDateChange]);

    // Handle tooltip position
    const handleTaskHover = useCallback((task: Task, e: React.MouseEvent) => {
        setHoveredTask(task);
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    }, []);

    const chartWidth = columns.length * columnWidth;
    const chartHeight = tasks.length * rowHeight;

    return (
        <div className="gantt-chart-container" style={{ display: 'flex', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
            {/* Task List Panel */}
            <div className="gantt-task-list" style={{ minWidth: '30rem', flexShrink: 0 }}>
                {TaskListHeader && <TaskListHeader />}
                {TaskListTable && <TaskListTable tasks={tasks} />}
            </div>

            {/* Chart Panel */}
            <div className="gantt-chart-panel" style={{ overflow: 'auto', flex: 1 }}>
                {/* Header */}
                <div
                    className="gantt-header"
                    style={{
                        display: 'flex',
                        height: headerHeight,
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    {columns.map((date, i) => (
                        <div
                            key={i}
                            style={{
                                width: columnWidth,
                                minWidth: columnWidth,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize,
                                borderRight: '1px solid #e0e0e0',
                                color: '#0B2C4C',
                                fontWeight: 500,
                            }}
                        >
                            {formatHeaderDate(date)}
                        </div>
                    ))}
                </div>

                {/* SVG Chart Area */}
                <svg
                    ref={svgRef}
                    width={chartWidth}
                    height={chartHeight}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ display: 'block' }}
                >
                    {/* Grid lines */}
                    {columns.map((_, i) => (
                        <line
                            key={`grid-${i}`}
                            x1={i * columnWidth}
                            y1={0}
                            x2={i * columnWidth}
                            y2={chartHeight}
                            stroke="#e0e0e0"
                            strokeWidth={1}
                        />
                    ))}

                    {/* Row backgrounds */}
                    {tasks.map((_, i) => (
                        <rect
                            key={`row-${i}`}
                            x={0}
                            y={i * rowHeight}
                            width={chartWidth}
                            height={rowHeight}
                            fill={i % 2 === 0 ? '#ffffff' : '#fafafa'}
                        />
                    ))}

                    {/* Row lines */}
                    {tasks.map((_, i) => (
                        <line
                            key={`row-line-${i}`}
                            x1={0}
                            y1={(i + 1) * rowHeight}
                            x2={chartWidth}
                            y2={(i + 1) * rowHeight}
                            stroke="#e0e0e0"
                            strokeWidth={1}
                        />
                    ))}

                    {/* Task bars */}
                    {tasks.map((task, i) => {
                        const displayTask = dragging?.task.id === task.id ? dragging.task : task;
                        const { x, width } = getTaskPosition(displayTask);
                        const y = i * rowHeight + rowHeight * 0.2;
                        const barHeight = rowHeight * 0.6;
                        const progressWidth = (width * displayTask.progress) / 100;

                        const bgColor = displayTask.styles?.backgroundColor || '#CCC';
                        const progressColor = displayTask.styles?.progressColor || '#0B2C4C';

                        return (
                            <g key={task.id}>
                                {/* Background bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={barHeight}
                                    fill={bgColor}
                                    rx={4}
                                    ry={4}
                                    style={{ cursor: task.isDisabled ? 'default' : 'move' }}
                                    onMouseDown={(e) => {
                                        if (!task.isDisabled && onDateChange) {
                                            e.preventDefault();
                                            setDragging({ task, type: 'move' });
                                        }
                                    }}
                                    onMouseEnter={(e) => handleTaskHover(task, e)}
                                    onMouseLeave={() => setHoveredTask(null)}
                                    onDoubleClick={() => onDoubleClick?.(task)}
                                />

                                {/* Progress bar */}
                                {progressWidth > 0 && (
                                    <rect
                                        x={x}
                                        y={y}
                                        width={progressWidth}
                                        height={barHeight}
                                        fill={progressColor}
                                        rx={4}
                                        ry={4}
                                        style={{ pointerEvents: 'none' }}
                                    />
                                )}

                                {/* Resize handles */}
                                {!task.isDisabled && onDateChange && (
                                    <>
                                        <rect
                                            x={x}
                                            y={y}
                                            width={8}
                                            height={barHeight}
                                            fill="transparent"
                                            style={{ cursor: 'ew-resize' }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDragging({ task, type: 'resize-start' });
                                            }}
                                        />
                                        <rect
                                            x={x + width - 8}
                                            y={y}
                                            width={8}
                                            height={barHeight}
                                            fill="transparent"
                                            style={{ cursor: 'ew-resize' }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDragging({ task, type: 'resize-end' });
                                            }}
                                        />
                                    </>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Tooltip */}
            {hoveredTask && TooltipContent && (
                <div
                    style={{
                        position: 'fixed',
                        left: tooltipPosition.x + 10,
                        top: tooltipPosition.y + 10,
                        zIndex: 1000,
                        pointerEvents: 'none',
                    }}
                >
                    <TooltipContent task={hoveredTask} />
                </div>
            )}
        </div>
    );
};

export default GanttChart;
