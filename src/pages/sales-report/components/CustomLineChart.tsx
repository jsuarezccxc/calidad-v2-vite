import React, { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Dot, Text } from 'recharts';
import { IGenericRecord } from '@models/GenericRecord';
import { ZERO } from '@pages/website-editor';
import { IDataChart } from '@pages/website-analytics/pages/website-dashboard';
import { Icon } from '@components/icon';
import { ONE } from '@constants/Numbers';
import { remToPx } from '@utils/Size';
import { formatNumber } from '@utils/Number';
import { SubstringText } from '@utils/SubstringText';
import { NUMBER_FORMAT_OPTIONS, ONE_THOUSAND } from '.';

const CustomTick: React.FC<IGenericRecord> = ({ x, y, payload }) => {
    const [font, maxDigits] = useMemo(() => {
        return [remToPx(0.5625), remToPx(0.5)];
    }, [document.body.clientWidth]);

    return (
        <Text x={x} y={y + maxDigits} fill="#0B2C4C" fontSize={font} fontFamily="AllerBold" textAnchor="middle" className="mt-1">
            {payload.value}
        </Text>
    );
};

const CustomTooltip: React.FC<IGenericRecord> = ({ active, payload, data }) => {
    if (active && payload && payload.length) {
        const quantity = payload[ZERO]?.value;
        const currentData = payload[ZERO]?.payload;
        const currentIndex = data?.findIndex((item: IGenericRecord) => item?.month === currentData?.month);
        const previousMonthData = currentIndex > ZERO ? data[currentIndex - ONE] : null;
        return (
            <div className="flex items-center justify-center p-2 bg-black border rounded shadow-lg">
                <Icon name={previousMonthData?.value > quantity ? 'arrowDecreases' : 'arrowIncreases'} className="mr-1 w-5.5" />
                <p className="text-white text-tiny">{formatNumber(quantity)}</p>
            </div>
        );
    }
    return null;
};

export const CustomLineChart: React.FC<IDataChart> = ({ data }) => {
    const [width, height, top, right, rDot, left] = useMemo(() => {
        return [remToPx(27.9375), remToPx(12.9375), remToPx(0.625), remToPx(1.875), remToPx(0.1875), remToPx(2.1875)];
    }, [document.body.clientWidth]);

    return (
        <ResponsiveContainer width={width} height={height}>
            <AreaChart data={data} margin={{ top, right, left, bottom: top }}>
                <CartesianGrid vertical={true} horizontal={false} />
                <XAxis
                    dataKey="month"
                    tick={<CustomTick />}
                    tickLine={false}
                    axisLine={{ stroke: '#AEAEAF', strokeWidth: '1' }}
                />
                <YAxis
                    tick={{ fontSize: '0.5rem', fill: '#0B2C4C', fontFamily: 'AllerBold' }}
                    axisLine={{ stroke: 'transparent' }}
                    tickLine={false}
                    tickFormatter={(value): string =>
                        value >= ONE_THOUSAND
                            ? `${SubstringText(formatNumber(value / ONE_THOUSAND, NUMBER_FORMAT_OPTIONS), 8)}k`
                            : formatNumber(value, NUMBER_FORMAT_OPTIONS)
                    }
                />
                <Tooltip content={<CustomTooltip data={data} />} />
                <defs>
                    <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(136, 132, 216, 1)" />
                        <stop offset="50%" stopColor="rgba(136, 132, 216, 0.8)" />
                        <stop offset="100%" stopColor="rgba(136, 132, 216, 0)" />
                    </linearGradient>
                </defs>
                <Area
                    dot={<Dot r={rDot} fill="#FFF" fillOpacity="1" />}
                    type="linear"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth="0.125rem"
                    fill="url(#colorFill)"
                    fillOpacity={0.15}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
