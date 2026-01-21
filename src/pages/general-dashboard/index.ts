import { MONTHS } from '@constants/Date';
import { INFORMATION } from '@information-texts/GeneralDashboard';
import { INTERMEDIATE_PLANS, Plan } from '@models/GeneralDashboard';
import { IGenericRecord } from '@models/GenericRecord';
import { getDateFormat } from '@utils/Date';

export { default } from './GeneralDashboard';

/**
 * This describes the props of dates
 *
 * @typeParam current: string - Date of the current month
 * @typeParam previous: string - Date of last month
 * @typeParam selectedMonth: string - Month selected to obtain data
 */
export interface IDates {
    current: string;
    previous: string;
    selectedMonth: string;
}

/**
 * This returns the current plan
 *
 * @param activePlans: IGenericRecord - Active plans
 * @param isWithoutPlans: boolean - This indicates if the user has no active plans
 * @returns Plan
 */
export const getPlan = (activePlans: IGenericRecord, isWithoutPlans: boolean): Plan => {
    if (isWithoutPlans) return Plan.None;
    if (activePlans.website?.id) {
        const isIntermediatePlan = INTERMEDIATE_PLANS.includes(activePlans.website?.sub_module_id);
        return isIntermediatePlan ? Plan.Intermediate : Plan.Advanced;
    }
    return Plan.ElectronicDocuments;
};

/**
 * This returns the current dates according to the current month
 *
 * @param selectedMonth: string - Selected month
 * @returns IDates
 */
export const getInitialDates = (selectedMonth?: string): IDates => {
    const { month: currentMonth, year } = getDateFormat(new Date());

    const monthIndex = MONTHS.findIndex(month => month === selectedMonth);

    const correctMonth = (monthIndex >= VALID_ELEMENT_INDEX ? monthIndex : currentMonth) + 1;

    return {
        current: `${year}/${correctMonth}/1`,
        previous: `${year}/${correctMonth - 1}/1`,
        selectedMonth: MONTHS[correctMonth - 1],
    };
};

/**
 * This returns the dates to get the data from Google Analytics
 *
 * @returns IGenericRecord[]
 */
export const getAnalyticsDates = (): IGenericRecord[] => {
    const { month, year } = getDateFormat(new Date());

    return [
        {
            start_date: `${year}-${month}-1`,
            finish_date: `${year}-${month}-30`,
        },
        {
            start_date: `${year}-${month + 1}-1`,
            finish_date: `${year}-${month + 1}-30`,
        },
    ];
};

/**
 * Valid index when searching a list
 */
const VALID_ELEMENT_INDEX = 0;

/**
 * This value is used to get the website modules
 */
export const WEBSITE = 'Sitio web y tienda virtual';

/**
 * Dynamic banner according to the current plan
 */
export const BANNER: { [key in Plan]: (goToPaymentPlans: () => void) => JSX.Element } = {
    [Plan.None]: INFORMATION.WITHOUT_PLAN,
    [Plan.ElectronicDocuments]: INFORMATION.ELECTRONIC_DOCUMENTS,
    [Plan.Intermediate]: INFORMATION.INTERMEDIATE_PLANS,
    [Plan.Advanced]: INFORMATION.ADVANCED_PLANS,
};
