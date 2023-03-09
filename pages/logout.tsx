import { NextPage } from 'next'
import { useEffect } from 'react'
import { Wrapper } from '../components/common/Wrapper'
import { useUser } from '../context/user'

const Logout: NextPage = () => {
  // @ts-ignore
  const { logout } = useUser()
  useEffect(() => {
    logout()
  }, [])
  return (
    <Wrapper>
      <p>Loging Out</p>
    </Wrapper>
  )
}

export default Logout
