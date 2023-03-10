import crypto from 'crypto-js'
import {SALARY_REVIEW} from './../helpers/routePath'

export const decrypt = (cipherText, secretKey) => {
  if (!cipherText) {
    return undefined
  }
  // Decrypt
  try {
    const bytes = crypto.AES.decrypt(cipherText, secretKey)
    const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8))
    return decryptedData
  } catch (error) {
    return undefined
  }
}

export const LATE_ARRIVAL_KEY = 'latearrivalkey123456789'
export const USERS_KEY = 'userkey123456789'
export const CONFIGURATION_KEY = 'configurationkey123456789'
export const SALARY_REVIEW_KEY = 'salaryreviewkey123456789'
export const ACTIVITY_LOGS_KEY = 'activitylogskey123456789'

export const PROJECT_KEY = 'projectkey123456789'
export const CLIENT_KEY = 'clientkey123456789'
export const PROJECT_STATUS_KEY = 'projectstatuskey123456789'
export const PROJECCT_TAG_KEY = 'projecttagkey123456789'
export const PROJECT_TYPE_KEY = 'projecttypekey123456789'
