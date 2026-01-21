/**
 * This interface to structure data
 * 
 * @typeParam start_date: string - Start contingency
 * @typeParam start_time: string - Start time contingency
 * @typeParam end_date: string - End contingency
 * @typeParam end_time: string - End time contingency
 * @typeParam description: string - Description
 * @typeParam file: File | undefined - File contingency
 */
export interface IContingencyActivation {
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    description: string;
    file: File | undefined;
}

/**
 * This interface is update contingency
 */
export interface IUpdateContingency extends Omit<IContingencyActivation, 'file'> {}
