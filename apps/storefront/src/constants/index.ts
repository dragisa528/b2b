export const SUPPORT_LANGUAGE = ['en', 'zh', 'fr', 'nl', 'de', 'it', 'es']

export const FILE_UPLOAD_ACCEPT_TYPE = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'image/*',
]

export const re = {
  phone: /^((\(\+?[0-9]{0,2}\))|(\+?[0-9]{0,2}))?(\s|-)?((\([0-9]{1,5}\))|([0-9]{1,5}))((\s|-)?)([0-9]{2,4}){0,3}((\s|-)?)[0-9]{4}$/,
  email: /^([A-Za-z0-9.!#$%&'*+-/=?^_`{|}~])+@([A-Za-z0-9\-.])+\.([A-Za-z][A-Za-z0-9]{1,64})$/,
  password: /^(?=.*[0-9].*)(?=.*[A-Za-z].*).{7,}$/,
  number: /^\d+$/,
}

export const PRODUCT_DEFAULT_IMAGE = 'https://cdn11.bigcommerce.com/s-1i6zpxpe3g/stencil/cd9e3830-4c73-0139-8a51-0242ac11000a/e/4fe76590-73f1-0139-3767-32e4ea84ca1d/img/ProductDefault.gif'
