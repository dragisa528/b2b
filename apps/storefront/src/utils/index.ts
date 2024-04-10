import {
  openPageByClick,
  redirectBcMenus,
  removeBCMenus,
} from './b3AccountItem'
import {
  getProductOptionList,
  handleGetCurrentProductInfo,
  isAllRequiredOptionFilled,
  isModifierNumberTextValid,
  isModifierTextValid,
} from './b3AddToShoppingList'
import clearInvoiceCart from './b3ClearCart'
import currencyFormat, {
  currencyFormatConvert,
  currencyFormatInfo,
  handleGetCorrespondingCurrency,
  ordersCurrencyFormat,
} from './b3CurrencyFormat'
import {
  displayExtendedFormat,
  displayFormat,
  getUTCTimestamp,
} from './b3DateFormat'
import { getLineNumber, getTextLenPX } from './b3GetTextLenPX'
import handleHideRegisterPage from './b3HideRegister'
import { getLogo, getQuoteEnabled } from './b3Init'
import { convertLabel, manipulateString } from './b3ManipulateString'
import { showPageMask } from './b3PageMask'
import distanceDay from './b3Picker'
import getProductPriceIncTax from './b3Price'
import b2bPrintInvoice from './b3PrintInvoice'
import getProxyInfo from './b3Proxy'
import { setCartPermissions } from './b3RolePermissions'
import { serialize } from './b3Serialize'
import { B3LStorage, B3SStorage } from './b3Storage'
import { globalSnackbar, snackbar } from './b3Tip'
import b3TriggerCartNumber from './b3TriggerCartNumber'
import getCookie from './b3utils'
import {
  getActiveCurrencyInfo,
  getDefaultCurrencyInfo,
  handleGetCorrespondingCurrencyToken,
} from './currencyUtils'
import {
  convertArrayToGraphql,
  convertObjectToGraphql,
} from './graphqlDataConvert'
import {
  clearCurrentCustomerInfo,
  getCompanyUserInfo,
  getCurrentCustomerInfo,
  getSearchVal,
  loginInfo,
} from './loginInfo'
import { validatorRules } from './validatorRules'

export { isB2bTokenPage, isUserGotoLogin, logoutSession } from './b3logout'
export * from './b3Product/b3Product'
export * from './basicConfig'
export * from './masquerade'
export { b2bLogger } from './b3Logger'
export {
  getQuoteConfig,
  getStoreInfo,
  getStoreTaxZoneRates,
  getTemPlateConfig,
  setStorefrontConfig,
} from './storefrontConfig'

export { loginjump } from './b3Login'

// TODO: Clean this up
export {
  b2bPrintInvoice,
  B3LStorage,
  B3SStorage,
  b3TriggerCartNumber,
  clearCurrentCustomerInfo,
  clearInvoiceCart,
  convertArrayToGraphql,
  convertLabel,
  convertObjectToGraphql,
  currencyFormat,
  currencyFormatConvert,
  currencyFormatInfo,
  displayExtendedFormat,
  displayFormat,
  distanceDay,
  getActiveCurrencyInfo,
  getCompanyUserInfo,
  getCookie,
  getCurrentCustomerInfo,
  getDefaultCurrencyInfo,
  getLineNumber,
  getLogo,
  getProductOptionList,
  getProductPriceIncTax,
  getProxyInfo,
  getQuoteEnabled,
  getSearchVal,
  getTextLenPX,
  getUTCTimestamp,
  globalSnackbar,
  handleGetCorrespondingCurrency,
  handleGetCurrentProductInfo,
  handleHideRegisterPage,
  isAllRequiredOptionFilled,
  isModifierNumberTextValid,
  isModifierTextValid,
  loginInfo,
  manipulateString,
  openPageByClick,
  ordersCurrencyFormat,
  redirectBcMenus,
  removeBCMenus,
  serialize,
  setCartPermissions,
  showPageMask,
  snackbar,
  validatorRules,
  handleGetCorrespondingCurrencyToken,
}
