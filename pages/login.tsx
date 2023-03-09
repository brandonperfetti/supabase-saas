import { useEffect } from 'react'
import { Wrapper } from '../components/common/Wrapper'
import { useUser } from '../context/user'

const Login = () => {
  // @ts-ignore
  const { login } = useUser()

  useEffect(() => {
    login()
  }, [])

  return (
    <Wrapper>
      <p>Logging in</p>
    </Wrapper>
  )
}

export default Login
