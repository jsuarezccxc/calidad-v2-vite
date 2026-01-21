/**
 * This interface is progress information card
 *
 * @typeParam classes: string - optional class for the container
 * @typeParam module: string - module name
 * @typeParam percentage: string - Percentage to advance
 * @typeParam threeSteps: boolean - Optional if is three steps
 * @typeParam isShowingSteps: boolean - Optional if is toggle steps
 */
export interface IProgressInformation {
    classes?: string;
    module: string;
    percentage: string;
    threeSteps?: boolean;
    isShowingSteps?: boolean;
}
