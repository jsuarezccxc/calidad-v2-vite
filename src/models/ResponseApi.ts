/**
 * This interface defines the structure of a response from an API.
 * 
 * @typeParam data: T - Optional data returned by the API, which can be of any type.
 * @typeParam message: string - A message providing additional information about the response.
 * @typeParam statusCode: number - The HTTP status code of the response.
 * @typeParam errors: Record<string, string>[] - Optional array of error objects, each containing key-value pairs of error details.
 */
export interface IApiResponse<T> {
    data?: T;
    message: string;
    statusCode: number;
    errors?: Record<string, string>[];
}
