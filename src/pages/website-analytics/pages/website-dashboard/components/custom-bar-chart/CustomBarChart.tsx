import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IDataChart } from '@pages/website-analytics/pages/website-dashboard';
import { remToPx } from '@utils/Size';
import { barColors } from '.';

const CustomBarChart: React.FC<IDataChart> = ({ data }) => {
    const minXValue = Math.min(...data.map(entry => entry?.count));
    const maxXValue = Math.max(...data.map(entry => entry?.count));

    const ticksX = [];
    for (let i = minXValue; i <= maxXValue; i += 10) {
        ticksX.push(i);
    }

    const [heightContainer, barSize] = useMemo(() => {
        return [remToPx(7.313), remToPx(1.375)];
    }, [document.body.clientWidth]);

    return (
        <ResponsiveContainer width="100%" height={heightContainer}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: -50, bottom: -20 }}>
                <CartesianGrid stroke="none" />

                <XAxis
                    type="number"
                    tick={{ fontSize: '0.688rem', fontWeight: 'normal', fontFamily: 'Aller', fill: '#0B2C4C' }}
                    tickLine={false}
                    axisLine={{ stroke: '#0B2C4C' }}
                />
                <YAxis dataKey="age" type="category" stroke="transparent" />
                <Tooltip />
                <Legend
                    align="center"
                    wrapperStyle={{
                        fontSize: '0.75rem',
                        color: '#0B2C4C',
                        fontWeight: 'normal',
                        fontFamily: 'Aller',
                        display: 'block',
                        position: 'absolute',
                        top: '6.5rem',
                        marginRight: '-0.625rem',
                        left: '-1.875rem',
                    }}
                    payload={[{ value: 'Edad Usuarios', type: 'line', id: 'ID01' }]}
                />
                <Bar dataKey="count" fill="#81319B26" barSize={barSize}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % 20]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CustomBarChart;
