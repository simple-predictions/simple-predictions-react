const env = require('dotenv').config()

console.log(process.env)
const base_url = process.env.BASE_URL || 'http://192.168.0.16:5000'
export default base_url