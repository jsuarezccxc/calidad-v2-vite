import { Screenshot } from '../..';

export * from './InstructionsScreenshot';

/**
 * Interface props form instruction screenshots component
 * 
 * @typeParam descriptionStep: string - Description by screenshot
 * @typeParam screenshots: Screenshot[] - List of screenshots by step
 */
export interface IInstructionScreenshotProps {
    descriptionStep: string;
    screenshots: Screenshot[];
}
