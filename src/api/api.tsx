import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

export interface RequestOptionalParams {
  requestBody?: any;
  queryParameters?: any;
}

export default class Api {
  baseUrl: string = 'https://pokeapi.co/api/v2';

  /**
   * Build request URL
   *
   * @param endPoint
   * @param queryParameters
   * @private
   */
  private buildUrl(endPoint: string, queryParameters: any): string {
    let fullUrl =
      this.baseUrl + endPoint + Api.buildQueryParameters(queryParameters);
    return encodeURI(fullUrl);
  }

  /**
   * Build query parameters
   *
   * @param queryParameters
   * @private
   */
  private static buildQueryParameters(queryParameters: any): string {
    if (!queryParameters) {
      return '';
    }

    let result: string = '?';

    for (let key in queryParameters) {
      if (queryParameters.hasOwnProperty(key)) {
        let value = queryParameters[key];
        if (value !== undefined && value !== null) {
          if (!result.endsWith('?')) {
            result += '&';
          }
          result += `${key}=${value.toString()}`;
        }
      }
    }

    if (result.endsWith('?')) {
      result = '';
    }

    return result;
  }

  /**
   * Send request
   *
   * @param requestType
   * @param endPoint
   * @param optionalParams
   */
  public async request(
    requestType: Method,
    endPoint: string,
    optionalParams?: RequestOptionalParams,
  ): Promise<AxiosResponse> {
    if (endPoint === null || endPoint.length === 0) {
      throw new Error('Empty url');
    }

    const url: string = this.buildUrl(
      endPoint,
      optionalParams && optionalParams.queryParameters
        ? optionalParams.queryParameters
        : null,
    );

    try {
      const config: AxiosRequestConfig = {
        method: requestType,
        url: url,
        timeout: 5000, // timeout in 20 seconds
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          mode: 'no-cors',
        },
      };
      let response: AxiosResponse = await axios.request(config);
      return this.parseResponse(response);
    } catch (exception) {
      const error = Api.parseError(exception);
      console.log(
        `Failed to request. Status code: ${error.statusCode}. Cause: ${error.message}`,
      );
      throw new Error(error.statusCode + ' ' + error.message);
    }
  }

  /**
   * Parse response
   *
   * @param response
   * @private
   */
  private parseResponse(response: AxiosResponse) {
    if (response === null) {
      throw new Error('Null response.');
    }

    if (this.isRequestSuccessful(response)) {
      return response;
    }

    throw new Error('Response error.');
  }

  /**
   * Parse error
   *
   * @param error
   * @private
   */
  private static parseError(error: AxiosError) {
    let httpError: HttpResponseError = {
      statusCode: -1,
      message: '',
    };

    // client received an error response (5xx, 4xx) form the server
    if (error.response) {
      if (error.response.data) {
        httpError = {
          statusCode: error.response.status,
          message: error.response.data.error,
        };
      }
    }
    // client never received a response, or request never left
    else if (error.request) {
      httpError = {
        statusCode: -1,
        message: 'Server is not responding.',
      };
    }
    // anything else
    else {
      httpError = {
        statusCode: -1,
        message: 'Unexpected error.',
      };
    }

    return httpError;
  }

  /**
   * Check if a request is successful by checking the response code
   *
   * @param response
   */
  public isRequestSuccessful(response: AxiosResponse): boolean {
    return response != null && response.status >= 200 && response.status < 300;
  }
}

export interface HttpResponseError {
  statusCode: number;
  message?: string;
}
