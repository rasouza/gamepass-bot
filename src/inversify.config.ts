import { Container } from 'inversify'
import { Client } from 'discord.js'
import { buildProviderModule } from 'inversify-binding-decorators'

const container = new Container()
container.bind<Client>(Client).toDynamicValue(() => new Client())
container.load(buildProviderModule())
export { container }
