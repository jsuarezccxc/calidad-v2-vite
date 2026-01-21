/**
 * Props interface for Information Page components
 * 
 * @typeParam title: string - Title to be displayed on the information page
 * @typeParam description: string | JSX.Element - Description content that can be either plain text or JSX element
 */
export interface IInformationPageProps {
    title: string;
    description: string | JSX.Element;
}
