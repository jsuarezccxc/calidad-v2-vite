import React, { useEffect, useState } from 'react';
import { SelectInput } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { formatMonths } from '@utils/Input';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { CardDisabled, Chart, IChartCardProps, Sales } from '.';

export const ChartCard: React.FC<IChartCardProps> = ({ disable, sales = {}, selectedMonth, updateSelectedMonth }) => {
    const [chartData, setChartData] = useState<IGenericRecord[]>([]);

    useEffect(() => {
        formatChartData();
    }, [sales]);

    const formatChartData = (): void => {
        if (Object.keys(sales).length) {
            setChartData(
                sales.invoice_total_per_range.map(({ day, total }: IGenericRecord) => ({
                    date: `${day} ${selectedMonth}`,
                    total,
                }))
            );
        }
    };

    return (
        <div
            id={generateId({
                module: ModuleApp.DASHBOARD,
                submodule: 'website-chart-sales',
                action: ActionElementType.INFO,
                elementType: ElementType.CRD,
            })}
            className="chart-card"
        >
            <div className="flex justify-between w-full mb-2">
                <h2 className="text-blue font-allerbold text-2lg">{disable ? Sales.TotalSales : Sales.SalesValue}</h2>
                <SelectInput
                    id={generateId({
                        module: ModuleApp.DASHBOARD,
                        submodule: 'website-chart-sales-month',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    classesWrapper="chart-card__select"
                    options={formatMonths()}
                    optionSelected={updateSelectedMonth}
                    value={selectedMonth}
                />
            </div>
            <Chart data={chartData} />
            {disable && <CardDisabled />}
        </div>
    );
};
