import fs from 'fs'
import GameDB from './game'

const mockSelect = jest.fn().mockReturnThis()

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: mockSelect
    }))
  }))
}))

describe('GameDB', () => {
  describe('getAll()', () => {
    test('should return empty on error', async () => {
      mockSelect.mockReturnValueOnce({ error: 'test' })
      const db = new GameDB()
      const games = await db.getAll()

      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(games).toHaveLength(0)
    })
    test('should return a list of games', async () => {
      const data = JSON.parse(
        fs.readFileSync('./src/models/__fixtures__/game.json', 'utf-8')
      )
      mockSelect.mockReturnValueOnce({ data })
      const db = new GameDB()
      const games = await db.getAll()

      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(games).toHaveLength(5)
    })
  })
})
