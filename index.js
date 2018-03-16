require('dotenv').config() //load .env file
const request = require('request-promise')
const saveToFile = require('./saveToFile')

const API_KEY = process.env.MAPI_KEY
const DC = API_KEY.split('-')[1]
const LIST = process.env.MAPI_LIST

const API_URL = `https://${DC}.api.mailchimp.com/3.0/`
const endpoint_list = (list_id) => `${API_URL}/lists/${list_id}`
const endpoint_members_list = (list_id) => `${API_URL}/lists/${list_id}/members`
const endpoint_export = `https://${DC}.api.mailchimp.com/export/1.0/list/`



const optionsCreator = (url, body) => {
 let options = {
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic '+API_KEY
    },
    body,
    transform: (body) => JSON.parse(body)
  }
  if (body) {
    options.method = 'POST'
    options.json = true
    options.transform = null
  }
  return options
}




const callbackCreator = () => new Promise((resolve, reject) => {
})

async function getTotalSubscribers(list) {
  const res =  await request(optionsCreator(endpoint_list(list)))
  return res.stats.member_count || 0
}

async function exportSubscribers(list) {
  const res =  await request(optionsCreator(endpoint_export, {id: list, apikey: API_KEY}))
  return res
}


getTotalSubscribers(LIST).then(total => console.log(`Total Users in List: ${total}`))
exportSubscribers(LIST).then(users => {
  console.log(users)
  saveToFile(users)
  console.log('saved in file')
})
