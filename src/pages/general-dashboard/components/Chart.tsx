import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Dot, TooltipProps } from 'recharts';
import { IGenericRecord } from '@models/GenericRecord';
import { formatMoney } from '@utils/Decimals';
import { remToPx } from '@utils/Size';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const total = payload?.[0]?.payload?.total;
        return <p className="sales-chart__tooltip">{formatMoney(total, 0)}</p>;
    }

    return null;
};

export const Chart: React.FC<{ data: IGenericRecord[]; height?: number }> = ({ data }) => {
    const [widthResContainer, heightResContainer, widthLineChart, widthYAxis, rDot, line, marginBotton] = useMemo(() => {
        return [remToPx(32.1875), remToPx(10.6875), remToPx(27.1875), remToPx(5), remToPx(0.25), remToPx(0.375), remToPx(0.625)];
    }, [document.body.clientWidth]);

    return (
        <ResponsiveContainer
            id={generateId({
                module: ModuleApp.OTHERS,
                submodule: 'chart-bars',
                action: ActionElementType.INFO,
                elementType: ElementType.CHT,
            })}
            width={widthResContainer}
            height={heightResContainer}
        >
            <LineChart width={widthLineChart} data={data} margin={{ bottom: marginBotton }}>
                <CartesianGrid fontSize="0.75rem" stroke="none" fill="#0B2C4C0D" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: '0.5625rem', fill: '#0B2C4C', fontFamily: 'AllerBold', dy: '0.3125rem' }}
                    tickSize={line}
                    axisLine={{ stroke: 'transparent' }}
                />
                <YAxis
                    tick={{ fontSize: '0.5625rem', fill: '#0B2C4C', fontFamily: 'AllerBold', dx: '-0.3125rem' }}
                    tickLine={false}
                    axisLine={{ stroke: 'transparent' }}
                    max={900000}
                    label={{
                        value: 'Valor pesos',
                        angle: -90,
                        position: 'insideLeft',
                        style: {
                            fontSize: '0.75rem',
                            fontFamily: 'AllerBold',
                            fill: '#81319B',
                            textAnchor: 'middle',
                        },
                    }}
                    tickFormatter={(value): string => formatMoney(value, 0)}
                    width={widthYAxis}
                />
                <Legend
                    align="center"
                    wrapperStyle={{
                        fontSize: '0.75rem',
                        color: '#81319B',
                        fontFamily: 'AllerBold',
                        display: 'block',
                        position: 'absolute',
                        bottom: 0,
                    }}
                    payload={[{ value: 'Día', type: 'line', id: 'ID01' }]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    strokeWidth="0.125rem"
                    dataKey="total"
                    stroke="url(#colorUv)"
                    dot={<Dot r={rDot} fill="#0B2C4C" strokeWidth={0} />}
                    activeDot={{ r: rDot * 2, fill: '#0B2C4C', strokeWidth: 0 }}
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
