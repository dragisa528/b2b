import {
  B3Lang,
} from '@b3/lang'

import {
  format,
} from 'date-fns'

import {
  re,
} from '../../constants'

const inputFormat = 'yyyy-MM-dd'

export interface CustomFieldItems {
  [key: string]: any
}
export interface QuoteConfig {
  [key: string]: string
}

export interface ValidateOptions {
  max?: string | Number,
  min?: string | Number,
  [key: string]: any
}
export interface RegisterFields {
  name: string,
  label?: string,
  required?: Boolean,
  fieldType?: string,
  default?: string | Array<any> | number,
  [key: string]: any
}

interface ValidateOptionItems {
  max?: number,
  min?: number,
  [key: string]: any
}

export type ContactInformationItems = Array<RegisterFields>

interface AccountFormFieldsItemsValueConfigs {
  defaultValue?: string,
  fieldName?: string,
  isRequired?: boolean,
  labelName?: string,
  maximumLength?: string,
  maxLength?: string,
  name?: string,
  required?: string
  type?: string,
  custom?: boolean
  id: string | number
  // [key: string]: string
}

interface AccountFormFieldsItems {
  fieldId?: string,
  fieldName?: string,
  fieldType?: string,
  groupId: number | string,
  groupName?: string,
  id?: string,
  isRequired?: boolean,
  labelName?: string,
  visible?: boolean,
  custom?: boolean
  valueConfigs?: AccountFormFieldsItemsValueConfigs
}

type AccountFormFieldsList = Array<[]> | Array<AccountFormFieldsItems>

export interface RegisterFieldsItems {
  id?: string | number,
  name: string,
  label: string
  required: boolean,
  default: string | number | Array<string>,
  fieldType: string | number,
  xs: number,
  visible: boolean,
  custom: boolean,
  bcLabel?: string,
  fieldId: string,
  groupId: string | number,
  groupName: string
  options?: any,
  disabled: boolean,
}

export const steps = [
  'intl.user.register.step.account',
  'intl.user.register.step.details',
  'intl.user.register.step.finish',
]

const companyExtraFieldsType = ['text', 'multiline', 'number', 'dropdown']

export const Base64 = {
  encode(str: string | number | boolean) {
    return window.btoa(encodeURIComponent(str))
  },
  decode(str: string) {
    return decodeURIComponent(window.atob(str))
  },
}

export const validatorRules = (validateRuleTypes: string[], options?: ValidateOptions) => (val: string, b3lang: B3Lang) => {
  let str = ''
  validateRuleTypes.forEach((item: string) => {
    if (item === 'email' && val && !re.email.test(val)) {
      str = b3lang('intl.user.register.validatorRules.email')
    }
    if (item === 'phone' && val && !re.phone.test(val)) {
      str = b3lang('intl.user.register.validatorRules.phoneNumber')
    }
    if (item === 'number' && val && !re.number.test(val)) {
      str = b3lang('intl.user.register.validatorRules.number')
    }
    if (item === 'max' && options?.max && +options.max < +val) {
      str = b3lang('intl.user.register.validatorRules.max', {
        max: options.max,
      })
    }

    if (item === 'password' && val && !re.password.test(val)) {
      str = b3lang('intl.user.register.validatorRules.passwords')
    }
  })
  if (str) return str
}

const fieldsType = {
  text: ['text', 'number', 'password',
    'multiline'],
  checkbox: ['checkbox'],
  dropdown: ['dropdown'],
  radio: ['radio'],
  date: ['date'],
}

const classificationType = (item: CustomFieldItems) => {
  let optionItems: ValidateOptionItems = {}
  if (fieldsType.text.includes(item.fieldType)) {
    optionItems = {
      minlength: item.minlength || null,
      maxLength: item.maxLength || +item.maximumLength || null,
      min: item.min || null,
      max: item.max || +item.maximumValue || null,
      rows: item?.options?.rows || item.numberOfRows || null,
    }
    if (optionItems?.max) {
      optionItems.validate = validatorRules(['max'], {
        max: optionItems?.max,
      })
    }

    if (item.fieldType === 'password') {
      optionItems.validate = validatorRules(['password'])
    }

    if (item?.fieldName === 'email' || item?.fieldName === 'phone') {
      optionItems.validate = validatorRules([item.fieldName])
    }
    if (item.fieldType === 'number' || (item.fieldType === 'text' && item.type === 'integer')) {
      optionItems.validate = validatorRules(['number'])
    }
  }
  if (fieldsType.checkbox.includes(item.fieldType)) {
    optionItems = {
      default: item.default || [],
      options: item.options?.items || null,
    }
  }
  if (fieldsType.dropdown.includes(item.fieldType)) {
    const items = []
    if (item.options?.helperLabel) {
      items.push({
        label: item.options.helperLabel,
        value: '',
      })
    }
    const options = [...items, ...item.options?.items || []]

    if (item.listOfValue) {
      item.listOfValue.forEach((value: any) => options.push({
        label: value,
        value,
      }))
    }

    optionItems = {
      default: item.default || '',
      options: options || null,
    }
  }
  if (fieldsType.radio.includes(item.fieldType)) {
    optionItems = {
      default: item.default || '',
      options: item.options?.items || [],
    }
  }

  if (optionItems?.options) {
    optionItems?.options.forEach((option: any) => {
      if (option.value) {
        option.value = option.label
      }
    })
  }

  return optionItems
}

const noEncryptFieldList = ['country', 'state', 'email']

const groupItems = {
  1: 'contactInformation',
  2: 'additionalInformation',
  3: 'businessDetails',
  4: 'address',
  5: 'password',
}

export const deCodeField = (fieldName: string) => {
  if (noEncryptFieldList.includes(fieldName)) {
    return fieldName
  }
  return Base64.decode(fieldName)
}

export const enCodeFieldName = (fieldName: string) => {
  if (noEncryptFieldList.includes(fieldName)) {
    return fieldName
  }

  return Base64.encode(fieldName)
}

const bcFieldName = (fieldName: string) => {
  if (fieldName === 'countryCode') {
    return 'country'
  }
  if (fieldName === 'stateOrProvince') {
    return 'state'
  }
  return fieldName
}

export const conversionSigleItem = (item: CustomFieldItems): Partial<RegisterFieldsItems> => {
  const requiredItems = {
    id: item.id || item.fieldName,
    name: bcFieldName(item.name) || enCodeFieldName(item.fieldName),
    label: item.label || item.labelName,
    required: item.required || item.isRequired,
    default: item.default || item.defaultValue || '',
    fieldType: item.fieldType,
    xs: 12,
    visible: item?.visible || false,
    custom: item?.custom || false,
    bcLabel: item.label || '',
    type: item.type || '',
  }

  if (typeof (item.fieldType) === 'number') {
    item.fieldType = companyExtraFieldsType[item.fieldType]
    requiredItems.fieldType = item.fieldType
  }

  const optionItems = classificationType(item)

  return {
    ...requiredItems,
    ...optionItems,
  }
}

export const toHump = (name:string) => name.replace(/_(\w)/g, (all, letter) => letter.toUpperCase())

export const conversionItemFormat = (FormFields: AccountFormFieldsList) => {
  const getFormFields: any = {}
  FormFields.forEach((item: CustomFieldItems) => {
    const key: string = (groupItems as CustomFieldItems)[item.groupId]

    if (!getFormFields[key]?.length) {
      getFormFields[key] = []
    }

    let obj:any = {}
    if (item.valueConfigs?.id) {
      obj = conversionSigleItem(item.valueConfigs)
    } else {
      obj = conversionSigleItem(item)
    }

    obj.required = item.isRequired
    obj.id = item.id
    obj.fieldId = item.fieldId
    obj.groupId = item.groupId
    obj.groupName = item.groupName
    obj.visible = item.visible
    obj.label = item.labelName
    obj.custom = obj.custom || item?.custom

    if (obj.fieldType === 'date' && !obj.default) {
      obj.default = format(new Date(), inputFormat)
    }

    if (obj.name === 'country') {
      obj.replaceOptions = {
        label: 'countryName',
        value: 'countryCode',
      }
    }

    if (obj.name === 'state') {
      obj.replaceOptions = {
        label: 'stateName',
        value: 'stateName',
      }
    }

    if (item.fieldId === 'field_confirm_password') {
      obj.name = 'confirmPassword'
    }
    if (obj.fieldType === 'files') {
      obj.filesLimit = 3
      obj.maxFileSize = 10485760
      obj.default = []
    }

    if (obj.fieldType === 'checkbox' && !obj.options) {
      obj.label = ''
      obj.options = [{
        label: item.labelName,
        value: item.labelName,
      }]
    }

    if (obj.fieldType === 'text' && obj.type === 'integer') {
      obj.fieldType = 'number'
    }
    getFormFields[key].push(obj)
  })

  return getFormFields
}

export const getAccountFormFields = (accountFormFields: AccountFormFieldsList) => {
  if (accountFormFields?.length) {
    const filterVisibleAccountFormFields: AccountFormFieldsList = accountFormFields ? (accountFormFields as any).filter((item: Partial<AccountFormFieldsItems>) => !!item.visible) : []

    const getAccountFormItems = filterVisibleAccountFormFields ? conversionItemFormat(filterVisibleAccountFormFields) : {}

    return getAccountFormItems
  }
  return {}
}

// todo

export const companyAttachmentsFields = (b3lang: B3Lang) : ContactInformationItems => [
  {
    name: 'companyAttachments',
    label: b3lang('intl.user.register.label.companyAttachments'),
    default: [],
    fieldType: 'file',
    required: false,
    xs: 12,
    filesLimit: 3,
    maxFileSize: 10485760, // 10M
  },
]
export interface Country {
  countryCode: string,
  countryName: string,
  id?: string,
  states: []
}
export interface State {
  stateCode?: string,
  stateName?: string,
  id?: string,
}

export const getRegisterLogo = (quoteConfig:Array<QuoteConfig>): string => {
  const item:Array<QuoteConfig> = quoteConfig.filter((list:QuoteConfig) => list.key === 'quote_logo')

  return item[0].isEnabled
}
