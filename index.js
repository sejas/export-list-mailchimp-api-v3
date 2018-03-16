const request = require('request-promise');
const API_KEY = process.env.MAPI_KEY
const DC = API_KEY.split('-')[1]
const LIST = process.env.MAPI_LIST

const API_URL = `https://${DC}.api.mailchimp.com/3.0/`

const endpoint_list = (list_id) => `${API_URL}/lists/${list_id}`
const endpoint_members_list = (list_id) => `${API_URL}/lists/${list_id}/members`


const optionsCreator = (url) => ({
  url,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic '+API_KEY
  },
  transform: (body) => JSON.parse(body)
})




const callbackCreator = () => new Promise((resolve, reject) => {
})

async function getTotalSubscribers(list) {
  const res =  await request(optionsCreator(endpoint_list(list)))
  console.log("MEMBER COUNT: ", res.stats.member_count);
}


getTotalSubscribers(LIST)