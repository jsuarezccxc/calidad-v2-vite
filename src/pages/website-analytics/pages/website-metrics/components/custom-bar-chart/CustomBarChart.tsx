import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatNumber } from '@utils/Number';
import { remToPx } from '@utils/Size';
import { IDataChart } from '@pages/website-analytics/pages/website-dashboard';
import { barColors, DEFAULT_FONTSIZE, MIN_LENGTH_FOR_TICKS, NUMBER_FORMAT_OPTIONS } from '.';

const CustomBarChart: React.FC<IDataChart> = ({ data, height, fontSize }) => {
    const minXValue = Math.min(...data.map(entry => entry?.ventas));
    const maxXValue = Math.max(...data.map(entry => entry?.ventas));

    const countTicksX = String(maxXValue).length >= MIN_LENGTH_FOR_TICKS ? 500 : 5;

    const ticksX = [];
    for (let i = minXValue; i <= maxXValue; i += countTicksX) {
        ticksX.push(i);
    }

    const [heightContainer, YAxisWidth, barSize, top, right, left, bottom] = useMemo(() => {
        return [remToPx(10.938), remToPx(5.625), remToPx(1.313), remToPx(1.25), remToPx(1.875), remToPx(1.25), remToPx(0.313)];
    }, [document.body.clientWidth]);

    return (
        <ResponsiveContainer width="100%" height={height ?? heightContainer}>
            <BarChart data={data} layout="vertical" margin={{ top, right, left, bottom }}>
                <CartesianGrid stroke="none" />
                <XAxis
                    type="number"
                    tick={{ fontSize: fontSize ?? DEFAULT_FONTSIZE, fontFamily: 'AllerBold', fill: '#0B2C4C' }}
                    tickLine={false}
                    axisLine={{ stroke: '#81319B' }}
                    ticks={[0, ...ticksX, maxXValue]}
                    tickFormatter={(tick): string => formatNumber(tick, NUMBER_FORMAT_OPTIONS)}
                />
                <YAxis
                    dataKey="producto"
                    type="category"
                    tick={{
                        fontStyle: 'italic',
                        fontSize: fontSize ?? DEFAULT_FONTSIZE,
                        fontFamily: 'AllerBold',
                        fill: '#0B2C4C',
                    }}
                    axisLine={{ stroke: 'transparent' }}
                    tickLine={false}
                    label={{
                        value: 'productos',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -5,
                        style: {
                            fontStyle: 'italic',
                            fontSize: DEFAULT_FONTSIZE,
                            fontFamily: 'AllerBold',
                            fill: '#00A99D',
                            textAnchor: 'middle',
                        },
                    }}
                    width={YAxisWidth}
                />
                <Tooltip
                    formatter={(value: number, name: string): string[] => [formatNumber(value, NUMBER_FORMAT_OPTIONS), name]}
                />
                <Bar dataKey="ventas" barSize={barSize} fill="#8884d8" radius={[0, 8, 8, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % 2]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CustomBarChart;
