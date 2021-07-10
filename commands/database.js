const { createClient } = require('@supabase/supabase-js')

const Logger = require('../logger')
const XBox = require('../services/XBox')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

module.exports = {
  name: 'db',
  description: 'Uses Supabase',
  async execute(message, args) {
    // const games = await XBox.getCatalog()
    // const insert = await supabase.from('games').insert({id: 'teste'})
    // const { data, error } = await supabase.from('games').select('*')
    // console.log(`data`, data)
    // console.log(`error`, error)
    // console.log(`insert`, insert)
    const changes = await supabase
      .from('games')
      .on('*', payload => {
        Logger.debug(payload)
      })
      .subscribe()
      Logger.debug(changes)
  }
}