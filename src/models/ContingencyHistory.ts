/**
 * This interface is structure history data
 * 
 * @typeParam id: string - ID contingency
 * @typeParam start_date: string - Start contingency
 * @typeParam start_time: string - Start time contingency
 * @typeParam end_date: string - End contingency
 * @typeParam end_time: string - End time contingency
 * @typeParam description: string - Description
 * @typeParam file_path: string - File contingency
 * @typeParam status: string - Status contingency
 * @typeParam created_at: string - Create contingency
 * @typeParam updated_at: string - Update contingency
 */
export interface IContingencyHistory {
    id: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    description: string;
    file_path: string;
    status: string;
    created_at: string;
    updated_at: string;
}

/**
 * This interface is contingency state
 * 
 * @typeParam isEdit: boolean - Its edit item
 * @typeParam isChange: boolean - Its change item
 */
export interface IContingencyHistoryState extends IContingencyHistory {
    isEdit: boolean;
    isChange: boolean;
}
