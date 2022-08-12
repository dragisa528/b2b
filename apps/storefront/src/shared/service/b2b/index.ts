import {
  getB2BRegisterCustomFields,
  getB2BCompanyUserInfo,
  getB2BRegisterLogo,
  getB2BCountries,
  createB2BCompanyUser,
  storeB2BBasicInfo,
  getB2BAccountFormFields,
  getB2BLoginPageConfig,
  getBCForcePasswordReset,
} from './graphql/register'

import {
  uploadB2BFile,
} from './api/global'

import {
  createBCCompanyUser,
  validateBCCompanyExtraFields,
} from './api/register'

import {
  getBCToken,
} from './api/login'

export {
  getB2BRegisterCustomFields,
  getB2BRegisterLogo,
  getB2BCompanyUserInfo,
  getB2BCountries,
  createBCCompanyUser,
  uploadB2BFile,
  createB2BCompanyUser,
  storeB2BBasicInfo,
  validateBCCompanyExtraFields,
  getB2BAccountFormFields,
  getBCToken,
  getB2BLoginPageConfig,
  getBCForcePasswordReset,
}
