import Link from 'next/link'
import { useUser } from '../context/user'

const Nav = () => {
  // @ts-ignore
  const { user } = useUser()
  return (
    <nav className="w-full py-4 px-6 border-b border-gray-200">
      <div className="space-x-2">
        <Link href="/">Home</Link>
        {!!user && <Link href="/dashboard">Dashboard</Link>}
        <Link href="/pricing">Pricing</Link>
        <div className="float-right">
          <Link href={user ? '/logout' : 'login'}>
            {user ? 'Logout' : 'Login'}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Nav
