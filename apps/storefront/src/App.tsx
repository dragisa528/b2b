import {
  useEffect,
  lazy,
  Suspense,
} from 'react'

import {
  Box,
} from '@mui/material'

import {
  HashRouter,
  Route,
  Routes,
  Outlet,
} from 'react-router-dom'
import {
  useB3AppOpen,
} from '@b3/hooks'

import {
  Layout,
  RegisteredCloseButton,
  ThemeFrame,
} from '@/components'
import {
  RegisteredProvider,
} from '@/pages/registered/context/RegisteredContext'

const FONT_URL = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
const CUSTOM_STYLES = `
body {
  background: #acacac;
  font-family: Roboto;
};
`
// const HeaderContainer = styled('div')(() => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'flex-end',
//   marginBottom: '1rem',
// }))

// const PageContainer = styled('div')(() => ({
//   padding: '40px',
// }))

const {
  height: defaultHeight,
  overflow: defaultOverflow,
} = document.body.style

const Home = lazy(() => import('./pages/Home'))

const Form = lazy(() => import('./pages/Form'))

const Registered = lazy(() => import('./pages/registered/Registered'))

const RegisteredBCToB2B = lazy(() => import('./pages/registered/RegisteredBCToB2B'))

const Login = lazy(() => import('./pages/login/Login'))

const ForgotPassword = lazy(() => import('./pages/login/ForgotPassword'))

export default function App() {
  const [{
    isOpen,
    openUrl,
  }, setOpenPage] = useB3AppOpen({
    isOpen: false,
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.height = '100%'
      document.body.style.overflow = 'hidden'
      if (openUrl) {
        const {
          origin,
          pathname,
          search,
        } = window.location
        window.location.href = `${origin}${pathname}${search}#${openUrl}`
      }
    } else {
      document.body.style.height = defaultHeight
      document.body.style.overflow = defaultOverflow
    }
  }, [isOpen])

  useEffect(() => {
    const {
      pathname,
      hash,
    } = window.location

    if (/login.php/.test(pathname) || (hash === '#/login' && pathname === '/checkout')) {
      setOpenPage({
        isOpen: true,
        openUrl: '/login',
      })
    }
  }, [])

  return (
    <HashRouter>
      <div className="bundle-app">
        <ThemeFrame
          className={isOpen ? 'active-frame' : undefined}
          fontUrl={FONT_URL}
          customStyles={CUSTOM_STYLES}
        >

          {isOpen ? (
            <Suspense fallback={(
              <Box sx={{
                display: 'flex',
                width: '100%',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
                Loading...
              </Box>
            )}
            >
              <Routes>
                <Route
                  path="/"
                  element={(
                    <Layout>
                      <RegisteredCloseButton setOpenPage={setOpenPage} />
                      <Outlet />
                    </Layout>
                )}
                >
                  <Route
                    path="/"
                    element={<Home />}
                  />
                  <Route
                    path="form"
                    element={<Form />}
                  />
                  <Route
                    path="login"
                    element={<Login />}
                  />
                  <Route
                    path="forgotpassword"
                    element={<ForgotPassword />}
                  />
                  <Route
                    path="registeredbctob2b"
                    element={(
                      <RegisteredProvider>
                        <RegisteredBCToB2B />
                      </RegisteredProvider>
                    )}
                  />
                  <Route
                    path="registered"
                    element={(
                      <RegisteredProvider>
                        <Registered />
                      </RegisteredProvider>
                    )}
                  />
                </Route>
              </Routes>
            </Suspense>
          ) : null}
        </ThemeFrame>
      </div>
    </HashRouter>
  )
}
