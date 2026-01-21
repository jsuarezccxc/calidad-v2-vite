export { InformativeQuestion } from './InformativeQuestion';

/**
 * This interface describes the informative question props
 *
 * @typeParam question: string - Question
 * @typeParam answer: string | JSX.Element - Answer
 */
export interface IInformativeQuestionProps {
    question: string;
    answer: string | JSX.Element;
}
