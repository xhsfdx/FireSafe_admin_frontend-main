const fs = require('fs')
const path = require('path')

module.exports = [
  {
    url: '/api/maintainTree',
    method: 'get',
    response: () => {
      const jsonPath = path.resolve(__dirname, './maintainTree.json')
      const data = fs.readFileSync(jsonPath, 'utf8')
      return {
        code: 200,
        data: JSON.parse(data)
      }
    }
  }
]
