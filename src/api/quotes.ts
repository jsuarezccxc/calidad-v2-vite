import { FetchRequest } from '@models/Request';
import FetchClient, { headerDefault } from './client';

/**
 * Performs a GET request for quote data
 *
 * @param request - The fetch request object containing resource endpoint
 * @returns Promise with quote data
 */
export const apiGetQuote = (request: FetchRequest): Promise<unknown> => 
  FetchClient.get(request.resource, null, headerDefault);

/**
 * Performs a POST request to create or report quotes
 *
 * @param request - The fetch request object containing resource endpoint and data
 * @returns Promise with API response
 */
export const apiPostQuote = (request: FetchRequest): Promise<unknown> => 
  FetchClient.post(request.resource, request.data);

/**
 * Performs a PUT request to update quote data
 *
 * @param request - The fetch request object containing resource endpoint and data
 * @returns Promise with updated quote data
 */
export const apiPutQuote = (request: FetchRequest): Promise<unknown> => 
  FetchClient.put(request.resource, request.data);

/**
 * Performs a DELETE request to remove quote
 *
 * @param request - The fetch request object containing resource endpoint and data
 * @returns Promise with deletion confirmation
 */
export const apiDeleteQuote = (request: FetchRequest): Promise<unknown> =>
  FetchClient.delete(request.resource, request.data, true);

/**
 * Performs a GET request to retrieve quote as blob data (PDF/Excel files)
 *
 * @param request - The fetch request object containing resource endpoint
 * @returns Promise with blob data for file downloads
 */
export const apiGetQuoteBlob = (request: FetchRequest): Promise<unknown> =>
  FetchClient.get(request.resource, null, headerDefault, true);

/**
 * Performs a POST request to retrieve quote as blob data (PDF/Excel files)
 * Used when filters/data need to be sent in request body
 *
 * @param request - The fetch request object containing resource endpoint and data
 * @returns Promise with blob data for file downloads
 */
export const apiPostQuoteBlob = (request: FetchRequest): Promise<unknown> =>
  FetchClient.post(request.resource, request.data, true, headerDefault);

