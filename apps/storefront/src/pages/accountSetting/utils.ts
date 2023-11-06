import { Fields, ParamProps } from '@/types/accountSetting'
import { validatorRules } from '@/utils'
import { bcBaseUrl } from '@/utils/basicConfig'

import { deCodeField } from '../registered/config'

function sendUpdateAccountRequest(data: string): Promise<string> {
  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
    mode: 'cors',
    credentials: 'include',
  }

  return fetch(
    `${bcBaseUrl()}/account.php?action=update_account`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.text()
    })
    .then((responseData) => responseData)
}

const getXsrfToken = (): string | undefined => {
  const cookies = document.cookie
  const cookieArray = cookies.split(';').map((cookie) => cookie.trim())

  const xsrfCookie = cookieArray.find((cookie) =>
    cookie.startsWith('XSRF-TOKEN=')
  )

  if (xsrfCookie) {
    const xsrfToken = xsrfCookie.split('=')[1]
    return decodeURIComponent(xsrfToken)
  }

  return undefined
}

// Password and email Change Send emails
function sendEmail(data: any) {
  return new Promise<boolean>((resolve, reject) => {
    const { email, confirmPassword, newPassword, currentPassword } = data
    const formData = new URLSearchParams()
    const token = getXsrfToken() || ''
    formData.append('FormField[1][1]', email)
    formData.append('FormField[1][24]', currentPassword)
    formData.append('FormField[1][2]', newPassword)
    formData.append('FormField[1][3]', confirmPassword)
    formData.append('authenticity_token', token)
    const requestBody: string = formData.toString()

    sendUpdateAccountRequest(requestBody)
      .then((response) => {
        const isFlag = response.includes('alertBox--error')
        resolve(!isFlag)
      })
      .catch((error) => {
        console.error('Error:', error)
        reject()
      })
  })
}

const emailValidate = validatorRules(['email'])

export const initB2BInfo = (
  accountSettings: any,
  contactInformation: Partial<Fields>[],
  accountB2BFormFields: Partial<Fields>[],
  additionalInformation: Partial<Fields>[]
) => {
  contactInformation.forEach((item: Partial<Fields>) => {
    if (deCodeField(item?.name || '') === 'first_name') {
      item.default = accountSettings.firstName
    }
    if (deCodeField(item?.name || '') === 'last_name') {
      item.default = accountSettings.lastName
    }
    if (deCodeField(item?.name || '') === 'phone') {
      item.default = accountSettings.phoneNumber
    }
    if (deCodeField(item?.name || '') === 'email') {
      item.default = accountSettings.email
      item.validate = emailValidate
    }
  })

  accountB2BFormFields.forEach((item: Partial<Fields>) => {
    if (item.name === 'role') {
      item.default = accountSettings.role
      item.muiSelectProps = {
        disabled: true,
      }
    } else if (item.name === 'company') {
      item.default = accountSettings.company
      item.disabled = true
    }
  })

  additionalInformation.forEach((item: Partial<Fields>) => {
    const formFields = (accountSettings?.formFields || []).find(
      (field: Partial<Fields>) => field.name === item.bcLabel
    )
    if (formFields) item.default = formFields.value
  })

  return [
    ...contactInformation,
    ...accountB2BFormFields,
    ...additionalInformation,
  ]
}

export const initBcInfo = (
  accountSettings: any,
  contactInformation: Partial<Fields>[],
  additionalInformation: Partial<Fields>[]
) => {
  contactInformation.forEach((item: Partial<Fields>) => {
    if (deCodeField(item?.name || '') === 'first_name') {
      item.default = accountSettings.firstName
    }
    if (deCodeField(item?.name || '') === 'last_name') {
      item.default = accountSettings.lastName
    }
    if (deCodeField(item?.name || '') === 'phone') {
      item.default = accountSettings.phoneNumber
    }
    if (deCodeField(item?.name || '') === 'email') {
      item.default = accountSettings.email
      item.validate = emailValidate
    }
    if (deCodeField(item?.name || '') === 'company') {
      item.default = accountSettings.company
    }
  })

  additionalInformation.forEach((item: Partial<Fields>) => {
    const formFields = (accountSettings?.formFields || []).find(
      (field: Partial<Fields>) => field.name === item.bcLabel
    )
    if (formFields) item.default = formFields.value
  })

  return [...contactInformation, ...additionalInformation]
}

export const b2bSubmitDataProcessing = (
  data: CustomFieldItems,
  accountSettings: any,
  decryptionFields: Partial<Fields>[],
  extraFields: Partial<Fields>[]
) => {
  const param: Partial<ParamProps> = {}
  param.formFields = []
  let isEdit = true
  let flag = true
  Object.keys(data).forEach((key: string) => {
    decryptionFields.forEach((item: Partial<Fields>) => {
      if (key === item.name) {
        flag = false
        if (deCodeField(item.name) === 'first_name') {
          if (accountSettings.firstName !== data[item.name]) isEdit = false
          param.firstName = data[item.name]
        }
        if (deCodeField(item.name) === 'last_name') {
          if (accountSettings.lastName !== data[item.name]) isEdit = false
          param.lastName = data[item.name]
        }
        if (deCodeField(item.name) === 'phone') {
          if (accountSettings.phoneNumber !== data[item.name]) isEdit = false
          param.phoneNumber = data[item.name]
        }
        if (deCodeField(item.name) === 'email') {
          if (accountSettings.email !== data[item.name]) isEdit = false
          param.email = data[item.name]
        }
      }
    })

    if (flag) {
      extraFields.forEach((field: Partial<Fields>) => {
        if (field.fieldId === key && param?.formFields) {
          param.formFields.push({
            name: field?.bcLabel || '',
            value: data[key],
          })
          flag = false
          const account = (accountSettings?.formFields || []).find(
            (formField: Partial<Fields>) => formField.name === field.bcLabel
          )
          if (
            account &&
            JSON.stringify(account.value) !== JSON.stringify(data[key])
          )
            isEdit = false
        }
      })
    }
    if (flag) {
      if (key === 'password') {
        param.newPassword = data[key]
        if (data[key]) isEdit = false
      } else {
        param[key] = data[key]
      }
    }
    flag = true
  })

  delete param.company

  delete param.role

  return {
    isEdit: !isEdit,
    param,
  }
}

export const bcSubmitDataProcessing = (
  data: CustomFieldItems,
  accountSettings: any,
  decryptionFields: Partial<Fields>[],
  extraFields: Partial<Fields>[]
) => {
  const param: Partial<ParamProps> = {}
  param.formFields = []
  let isEdit = true
  let flag = true
  Object.keys(data).forEach((key: string) => {
    decryptionFields.forEach((item: Partial<Fields>) => {
      if (key === item.name) {
        flag = false
        if (deCodeField(item.name) === 'first_name') {
          if (accountSettings.firstName !== data[item.name]) isEdit = false
          param.firstName = data[item.name]
        }
        if (deCodeField(item.name) === 'last_name') {
          if (accountSettings.lastName !== data[item.name]) isEdit = false
          param.lastName = data[item.name]
        }
        if (deCodeField(item.name) === 'phone') {
          if (accountSettings.phoneNumber !== data[item.name]) isEdit = false
          param.phoneNumber = data[item.name]
        }
        if (deCodeField(item.name) === 'email') {
          if (accountSettings.email !== data[item.name]) isEdit = false
          param.email = data[item.name]
        }
        if (deCodeField(item.name) === 'company') {
          if (accountSettings.company !== data[item.name]) isEdit = false
          param.company = data[item.name]
        }
      }
    })

    if (flag) {
      extraFields.forEach((field: Partial<Fields>) => {
        if (field.fieldId === key && param?.formFields) {
          param.formFields.push({
            name: field?.bcLabel || '',
            value: data[key],
          })
          flag = false
          const account = (accountSettings?.formFields || []).find(
            (formField: Partial<Fields>) => formField.name === field.bcLabel
          )
          if (
            account &&
            JSON.stringify(account.value) !== JSON.stringify(data[key])
          )
            isEdit = false
        }
      })
    }

    if (flag) {
      if (key === 'password') {
        param.newPassword = data[key]
        if (data[key]) isEdit = false
      } else {
        param[key] = data[key]
      }
    }
    flag = true
  })

  return {
    isEdit: !isEdit,
    param,
  }
}

export default sendEmail
