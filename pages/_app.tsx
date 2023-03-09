import '../styles/globals.css'
import type { AppProps } from 'next/app'
import UserProvider from '../context/user'
import dynamic from 'next/dynamic'

const Nav = dynamic(() => import('../components/nav'), { ssr: false })

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Nav />
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
