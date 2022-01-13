import _ from 'radash'
import * as crypto from 'crypto'


export const createId = (model: 'service' | 'platform' | 'user' | 'deployment' | 'membership' | 'domain') => {
  const rand = crypto.randomBytes(12).toString('hex')
  return `exo.${model}.${rand}`
}

export const username = (email: string) => {
  return email.replace(/@.+/, '')
}

export const slugger = (...parts: string[]) => {
  return parts
    .filter(x => !!x)
    .join('-')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')      // non alpha numeric with -
    .replace(/\-\-+/g, '-')          // --- with -
}

export default {
  slugger,
  username,
  createId
}