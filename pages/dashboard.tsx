import { Wrapper } from '../components/common/Wrapper'
import { supabase } from '../utils/supabase'
import { useUser } from '../context/user'
import { NextPage } from 'next'
import axios from 'axios'
import { useRouter } from 'next/router'

const Dashboard: NextPage = () => {
  // @ts-ignore
  const { user, isLoading } = useUser()
  const router = useRouter()
  const loadPortal = async () => {
    const { data } = await axios.get('/api/portal')
    router.push(data.url)
  }
  return (
    <Wrapper>
      <h1 className="text-3xl">Dashboard</h1>
      {!isLoading && (
        <div className="space-y-2">
          <p>
            {user?.is_subscribed
              ? `Subscribed: ${user.interval}`
              : 'Not Subscribed'}
          </p>
          <button onClick={loadPortal}>Manage Subscription</button>
        </div>
      )}
    </Wrapper>
  )
}

// @ts-ignore
export const getServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      },
      props: {}
    }
  }
  return {
    props: {}
  }
}

export default Dashboard
