import {
  useReducer,
  createContext,
  Dispatch,
  ReactNode,
  useMemo,
} from 'react'

import {
  RegisterFields,
  Country,
  State,
} from '../config'

interface RegisterState {
  contactInformation?: Array<RegisterFields>,
  accountType?: string,
  additionalInformation?: Array<RegisterFields>,
  bcContactInformationFields?: Array<RegisterFields>,
  emailMarketingNewsletter?: Boolean,
  companyInformation?: Array<RegisterFields>,
  companyExtraFields?: Array<RegisterFields>
  companyAttachment?: Array<RegisterFields>,
  addressBasicFields?: Array<RegisterFields>,
  addressExtraFields?: Array<RegisterFields>,
  countryList?: Array<Country>,
  stateList?: Array<State>,
  passwordInformation?: Array<RegisterFields>,
  isLoading?: Boolean,
  submitSuccess?: Boolean,
  isAutoApproval?: Boolean,
  storeName?: string,
}
interface RegisterAction {
  type: string,
  payload: RegisterState
}
export interface RegisterContext {
  state: RegisterState,
  dispatch: Dispatch<RegisterAction>,
}

interface RegisteredProviderProps {
  children: ReactNode
}

const initState = {
  contactInformation: [],
  bcContactInformation: [],
  additionalInformation: [],
  passwordInformation: [],
  accountType: '',
  emailMarketingNewsletter: false,
  companyInformation: [],
  companyExtraFields: [],
  companyAttachment: [],
  addressBasicFields: [],
  addressExtraFields: [],
  countryList: [],
  stateList: [],
  isLoading: false,
  storeName: '',
  submitSuccess: false,
  isAutoApproval: true,
}

export const RegisteredContext = createContext<RegisterContext>({
  state: initState,
  dispatch: () => {},
})

const reducer = (state: RegisterState, action: RegisterAction) => {
  switch (action.type) {
    case 'all':
      return {
        ...state,
        ...action.payload,
      }
    case 'loading':
      return {
        ...state,
        ...action.payload,
      }
    case 'contactInformation':
      return {
        ...state,
        contactInformation: action.payload.contactInformation,
      }
    case 'accountType':
      return {
        ...state,
        accountType: action.payload.accountType,
      }
    case 'emailSletter':
      return {
        ...state,
        emailMarketingNewsletter: action.payload.emailMarketingNewsletter,
      }
    case 'stateList':
      return {
        ...state,
        stateList: action.payload.stateList,
        addressBasicFields: action.payload.addressBasicFields,
      }
    case 'finishInfo':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export function RegisteredProvider(props: RegisteredProviderProps) {
  const [state,
    dispatch] = useReducer(reducer, initState)

  const {
    children,
  } = props

  const registerValue = useMemo(() => ({
    state,
    dispatch,
  }), [state])

  return (
    <RegisteredContext.Provider value={registerValue}>
      {children}
    </RegisteredContext.Provider>
  )
}