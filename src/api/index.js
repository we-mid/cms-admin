import fetch from 'isomorphic-fetch'
import { apiUrl } from '../../config'

// todo: qs params
export function fetchApi (url, options) {
  url = `${apiUrl}${url}`
  return fetch(url, options)
    .then(res => res.json())
    .catch(err => {
      throw new Error(`json parse ${err}`)
    })
    .then(data => {
      if (data.error) {
        throw new Error(data.error)
      }
      return data
    })
    .catch(err => {
      console.error('fetchApi err', err)
      // alert(err)
      throw err
    })
}
