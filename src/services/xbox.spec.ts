import path from 'path'
import { back as nockBack } from 'nock'
import { getIdCatalog, searchGames } from './xbox'
import Game from 'domain/Game'

nockBack.fixtures = path.join(__dirname, '__fixtures__')
nockBack.setMode('record')

describe('services/xbox.ts', () => {
  describe('getIdCatalog()', () => {
    let catalog: string[]
    beforeEach(async () => {
      const { nockDone } = await nockBack('catalog.json')
      catalog = await getIdCatalog()
      nockDone()
    })

    it('returns a list of games by ID', async () => {
      expect(catalog.length).toBeGreaterThan(200)
    })

    it('returns a valid ID', () => {
      expect(catalog[0].length).toBe(12)
    })
  })

  describe('searchGames()', () => {
    let games: Game[]

    beforeAll(async () => {
      const { nockDone } = await nockBack('search.json')
      await searchGames(['9ND0CG3LM22K', '9NJWTJSVGVLJ'])
      await searchGames(['test'])
      nockDone()
    })

    beforeEach(async () => {
      nockBack('search.json')
      games = await searchGames(['9ND0CG3LM22K', '9NJWTJSVGVLJ'])
    })

    describe('given valid IDs', () => {
      it('returns a list of games', () => {
        expect(games).toHaveLength(2)
      })

      it('should contain a game', () => {
        const game = games.shift()
        expect(game).toMatchObject({
          title: 'A Plague Tale: Innocence - Windows 10',
          developer: 'Asobo Studio'
        })
      })
    })

    describe('given an invalid ID', () => {
      it('should return empty', async () => {
        const games = await searchGames(['test'])
        expect(games).toHaveLength(0)
      })
    })
  })
})
