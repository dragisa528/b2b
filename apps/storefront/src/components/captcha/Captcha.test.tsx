import {
  beforeAll,
  afterEach,
  describe,
  it,
  expect,
  vi,
} from 'vitest'
import {
  ThemeFrame,
} from '../ThemeFrame'
import {
  render, screen,
} from '../../utils/test-utils'
import {
  Captcha, loadCaptchaScript, loadCaptchaWidgetHandlers,
} from './Captcha'

declare global {
    interface Window {
        INITIALIZE_CAPTCHA_testid?: Function
    }
}

const TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const CAPTCHA_URL = 'https://www.google.com/recaptcha/api.js?render=explicit'
const INIT_BROWSER:{head:string, body:string} = {
  head: '', body: '',
}

beforeAll(() => {
  INIT_BROWSER.head = document.head.innerHTML
  INIT_BROWSER.body = document.body.innerHTML
})

afterEach(() => {
  window.INITIALIZE_CAPTCHA_testid = undefined
  document.head.innerHTML = INIT_BROWSER.head
  document.body.innerHTML = INIT_BROWSER.body
})

describe('loadCaptchaScript', () => {
  it('should inject recaptcha script to Document', () => {
    loadCaptchaScript(document)
    const [recaptchaScript] = document.getElementsByTagName('script')
    expect(recaptchaScript.src).toBe(CAPTCHA_URL)
  })
})

describe('loadCaptchaWidgetHandlers', () => {
  it('should inject script', () => {
    loadCaptchaWidgetHandlers(document, 'testid')
    const [recaptchaHandlersScript] = document.getElementsByTagName('script')
    expect(recaptchaHandlersScript.innerHTML.length).toBeGreaterThan(0)
  })
  it('should replace text by id', () => {
    loadCaptchaWidgetHandlers(document, 'testid')
    const [recaptchaHandlersScript] = document.getElementsByTagName('script')
    expect(recaptchaHandlersScript.innerHTML).toMatch('testid')
  })
})

describe('Captcha', () => {
  it('should render the captcha wrapper', () => {
    vi.useFakeTimers()
    render(
      <ThemeFrame title="test-frame">
        <Captcha
          siteKey={TEST_SITE_KEY}
          theme="dark"
          size="normal"
        />
      </ThemeFrame>,
    )
    vi.advanceTimersToNextTimer()
    const iframe: HTMLIFrameElement = screen.getByTitle('test-frame')
    const iframeDocument = iframe.contentDocument as Document
    const [captchaWrapper] = iframeDocument.body.getElementsByTagName('div')

    expect(captchaWrapper.id).toMatch('widget')
    expect(captchaWrapper.dataset.sitekey).toBe(TEST_SITE_KEY)
    expect(captchaWrapper.dataset.theme).toBe('dark')
    expect(captchaWrapper.dataset.size).toBe('normal')
  })
})
