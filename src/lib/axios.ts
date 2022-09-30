import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { interfaces } from 'inversify'
import { Logger } from 'winston'

export interface AxiosFactory {
  (name: string, baseURL: string): AxiosInstance
}

export const axiosFactory =
  (context: interfaces.Context) => (name: string, baseURL: string) => {
    const logger = context.container.get<Logger>('Logger')
    const successfulRequest = (config: AxiosRequestConfig) => {
      logger.debug(`[${name}] request sent`, { config })
      return config
    }

    const errorRequest = (error: any) => {
      return Promise.reject(error)
    }

    const successfulResponse = (response: AxiosResponse) => {
      logger.debug(`[${name}] got response`, { response: response.data })
      return response
    }
    const errorResponse = errorRequest

    const client = axios.create({ baseURL })

    // Add a request interceptor
    client.interceptors.request.use(successfulRequest, errorRequest)
    client.interceptors.response.use(successfulResponse, errorResponse)

    return client
  }
