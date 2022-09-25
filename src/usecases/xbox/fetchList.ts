import 'reflect-metadata'
import { provide } from 'inversify-binding-decorators'
// import { AxiosClient } from 'config/axios'

@provide(FetchList)
// @AxiosClient('XBox', 'https://catalog.gamepass.com')
export class FetchList {}
