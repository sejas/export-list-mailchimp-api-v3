require('dotenv').config() //load .env file
const request = require('request-promise')
      ,saveToFile = require('./saveToFile')
      ,md5 = require('md5')

const API_KEY = process.env.MAPI_KEY
const DC = API_KEY.split('-')[1]
const LIST = process.env.MAPI_LIST

const API_URL = `https://${DC}.api.mailchimp.com/3.0`
const endpoint_list = (list_id) => `${API_URL}/lists/${list_id}`
const endpoint_remove = (list_id, email) => `${API_URL}/lists/${list_id}/members/${md5(email)}`

const emailsToRemove = [
'exampleemail1@example.com',
'exampleemail2@example.com',
'exampleemail3@example.com',
]

const optionsCreator = (url, body, method) => {
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
  if (method) {
    options.method = method
  }

  return options
}




const callbackCreator = () => new Promise((resolve, reject) => {
})

async function getTotalSubscribers(list) {
  const res =  await request(optionsCreator(endpoint_list(list)))
  return res.stats.member_count || 0
}

async function removeEmailFromList(list, email) {
  const endpoint = endpoint_remove(list, email)
  console.log('\n- endpoint', endpoint)
  // try{
  //   const userData =  await request(optionsCreator(endpoint, {apikey: API_KEY}, 'GET'))
  //   console.log('\n -userData', userData)
  // }catch(e){
  //   console.log('error reading user data',e)
  // }
  const options = optionsCreator(endpoint, {apikey: API_KEY}, 'DELETE')
  try{
    const res =  await request(options)
    getTotalSubscribers(LIST).then(total => console.log(`Total Users in List: ${total}`))
  }catch(e){
    console.log('error removing form list',e)
    return e
  }

  console.log('\n -res',res)
  return res
}


async function removeArrayEmailsFromList(list, emails) {
  for (var i = 0; i < emails.length; i++) {
    console.log('removing... '+emails[i])
    try {
      const res = await removeEmailFromList(list, emails[i])
      console.log('ok removing'+emails[i])
    }catch(e){
      console.log('Error removing'+emails[i])
    }

  }
}





getTotalSubscribers(LIST).then(total => console.log(`Total Users in List: ${total}`))
// removeArrayEmailsFromList(LIST, emailsToRemove)