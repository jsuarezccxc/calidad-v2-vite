import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Dot, TooltipProps } from 'recharts';
import { IDataChart } from '@pages/website-analytics/pages/website-dashboard';
import { remToPx } from '@utils/Size';

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    const formatDateForTooltip = (date: string | number): string => {
        const dateString = date.toString();
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);

        return `${year}/${month}/${day}`;
    };

    if (active && payload && payload.length) {
        const date = formatDateForTooltip(label);
        const quantityUsers = payload[0].value;

        return (
            <div className="p-2 bg-white border rounded shadow-lg">
                <p className="text-sm font-bold text-gray-800">Fecha: {date}</p>
                <p className="text-sm text-gray-700">
                    Cantidad de usuarios: <span className="font-bold">{quantityUsers}</span>
                </p>
            </div>
        );
    }

    return null;
};

const CustomLineChart: React.FC<IDataChart> = ({ data }) => {
    const formatDate = (dateNumber: number): string => {
        const dateString = dateNumber.toString();
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1;
        const day = parseInt(dateString.substring(6, 8), 10);

        const date = new Date(year, month, day);
        const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long', day: 'numeric' });
        return formatter.format(date);
    };

    const [containerWidth, containerHeight, yaxisWidth, top, right, left, bottom, rBlue, rFocus] = useMemo(() => {
        return [
            remToPx(27.813),
            remToPx(13.125),
            remToPx(1.625),
            remToPx(0.563),
            remToPx(0.75),
            remToPx(1.25),
            remToPx(1.875),
            remToPx(1.25),
            remToPx(0.313),
            remToPx(0.25),
            remToPx(0.5),
        ];
    }, [document.body.clientWidth]);

    return (
        <ResponsiveContainer width={containerWidth} height={containerHeight} className="-mt-1">
            <LineChart data={data} margin={{ top, right, left, bottom }}>
                <CartesianGrid stroke="none" fill="#0B2C4C0D" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: '0.563rem', fill: '#0B2C4C', fontFamily: 'AllerBold' }}
                    axisLine={{ stroke: 'transparent' }}
                    tickFormatter={data.length ? formatDate : (): string => ''}
                />
                <YAxis
                    tick={{ fontSize: '0.563rem', fill: '#0B2C4C', fontFamily: 'AllerBold' }}
                    tickLine={false}
                    axisLine={{ stroke: 'transparent' }}
                    label={{
                        value: 'Numero de usuarios',
                        angle: -90,
                        position: 'insideLeft',
                        offset: -5,
                        style: {
                            fontSize: '0.75rem',
                            fontFamily: 'AllerBold',
                            fill: '#81319B',
                            textAnchor: 'middle',
                        },
                    }}
                    width={yaxisWidth}
                />
                <Legend
                    align="center"
                    wrapperStyle={{
                        fontSize: '0.75rem',
                        color: '#81319B',
                        fontFamily: 'AllerBold',
                        display: 'block',
                        position: 'absolute',
                        top: '10.9375rem',
                        marginRight: '-0.625rem',
                        left: '1.9375rem',
                    }}
                    payload={[{ value: 'Día', type: 'line', id: 'ID01' }]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    strokeWidth="0.125rem"
                    dataKey="quantityUsers"
                    stroke="url(#colorUv)"
                    dot={<Dot r={rBlue} fill="#0B2C4C" strokeWidth={0} />}
                    activeDot={{ r: rFocus, fill: '#0B2C4C', strokeWidth: 0 }}
                />

                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#81319B" stopOpacity={0.8} />
                        <stop offset="50%" stopColor="#00A99D" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0B2C4C" stopOpacity={0.8} />
                    </linearGradient>
                </defs>
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CustomLineChart;
