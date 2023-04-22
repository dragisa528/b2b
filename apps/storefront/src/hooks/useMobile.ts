import { useEffect, useState } from 'react'

const useMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // const ua = navigator.userAgent.toLowerCase()
  // const agents = ['iphone', 'ipad', 'ipod', 'android', 'windows phone'] // All fields that may be mobile devices

  useEffect(() => {
    // agents.forEach((item: string) => {
    //   if (ua.indexOf(item) !== -1) {
    //     setIsMobile(true)
    //   }
    // })
    const resize = () => {
      setIsMobile(document.body.clientWidth <= 750)
    }

    resize()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return [isMobile]
}

export default useMobile
