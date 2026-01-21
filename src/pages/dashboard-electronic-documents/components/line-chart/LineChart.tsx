import React, { ReactElement, ReactNode, useMemo } from 'react';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Dot, Text, YAxis } from 'recharts';
import { Icon } from '@components/icon';
import { formatNumber } from '@utils/Number';
import { remToPx } from '@utils/Size';
import { ICustomTickProps, ILineChartProps, ITooltipProps, UTILS } from '.';
import './LineChart.scss';

const CustomTick: React.FC<ICustomTickProps> = ({ x, y, payload }) => {
    const [font, yAditional] = useMemo(() => {
        return [remToPx(0.5625), remToPx(0.5)];
    }, [document.body.clientWidth]);

    return (
        <Text x={x} y={y + yAditional} fill="#0B2C4C" fontSize={font} fontFamily="AllerBold" textAnchor="middle" className="mt-1">
            {payload.value as string}
        </Text>
    );
};

const CustomTooltip: React.FC<ITooltipProps> = ({ active, payload, data }) => {
    if (active && payload && payload.length) {
        const [{ value = 0, payload: currentPayload = { month: '' } }] = payload;
        const index = data.findIndex(item => item.month === currentPayload.month);
        const currentData = index > UTILS.ZERO ? data[index - UTILS.ONE] : { value: 0 };
        return (
            <div className="custom-tooltip-line-chart">
                <Icon
                    name={currentData.value > (value as number) ? 'arrowDecreases' : 'arrowIncreases'}
                    className="w-5.5 h-5.5 mr-1"
                />
                <p>{formatNumber(value as number)}</p>
            </div>
        );
    }
    return <></>;
};

export const LineChart: React.FC<ILineChartProps> = ({ data }) => {
    const { ONE_THOUSAND } = UTILS;

    const [width, height, top, right, rDot, left] = useMemo(() => {
        return [remToPx(27.9375), remToPx(12.9375), remToPx(0.625), remToPx(1.875), remToPx(0.1875), remToPx(2.1875)];
    }, [document.body.clientWidth]);

    return (
        <ResponsiveContainer width={width} height={height}>
            <AreaChart data={data} margin={{ top, right, left, bottom: top }}>
                <CartesianGrid vertical={true} horizontal={false} />
                <XAxis
                    axisLine={{ fontSize: '.9375rem', stroke: '#AEAEAF', strokeWidth: '1' }}
                    tick={(props): ReactElement<SVGElement> => <CustomTick {...props} />}
                    tickLine={false}
                    dataKey="month"
                />
                <YAxis
                    tickFormatter={(value): string => formatNumber(value >= ONE_THOUSAND ? value / ONE_THOUSAND : value)}
                    tick={{ fontSize: '.5rem', fill: '#0B2C4C', fontFamily: 'AllerBold' }}
                    axisLine={{ stroke: 'transparent' }}
                    tickLine={false}
                />
                <Tooltip content={(props): ReactNode => <CustomTooltip {...props} data={data} />} />
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
                    strokeWidth="0.125rem"
                    stroke="#8884d8"
                    fillOpacity={0.15}
                    fill="url(#colorFill)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
