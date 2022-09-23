import GameDB from './game'
import gamepass from './__fixtures__/gamepass.json'

const mockIn = jest.fn()
const mockMaybeSingle = jest.fn()
const mockEq = jest.fn().mockImplementation(() => ({
  maybeSingle: mockMaybeSingle
}))
const mockSelect = jest.fn().mockImplementation(() => ({
  in: mockIn,
  eq: mockEq
}))

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockImplementation(() => ({
      select: mockSelect
    }))
  })
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
      mockSelect.mockReturnValueOnce({ data: gamepass })
      const db = new GameDB()
      const games = await db.getAll()

      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(games).toHaveLength(5)
    })
  })
  describe('getAllById()', () => {
    test('should return empty on error', async () => {
      mockIn.mockReturnValueOnce({ error: 'test' })
      const db = new GameDB()
      const games = await db.getAllById(['non-existent'])

      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockIn).toHaveBeenCalledWith('id', ['non-existent'])
      expect(games).toHaveLength(0)
    })
    test('should return a list of games', async () => {
      mockIn.mockReturnValueOnce({ data: gamepass })
      const db = new GameDB()
      const games = await db.getAllById(['9PJ2DSSXZR0P', '9N8CD0XZKLP4'])

      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(games).toHaveLength(5)
    })
  })

  describe('getById()', () => {
    test('should return empty on error', async () => {
      mockMaybeSingle.mockReturnValueOnce({ error: 'test' })
      const db = new GameDB()
      const games = await db.getById('non-existent')

      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', 'non-existent')
      expect(games).toBeUndefined()
    })
  })
})
