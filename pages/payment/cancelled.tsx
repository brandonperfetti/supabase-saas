import { NextPage } from 'next'
import { Wrapper } from '../../components/common/Wrapper'

const Cancelled:NextPage = () => {
  return (
    <Wrapper>
      <p>Payment cancelled! You will no longer be charged.</p>
    </Wrapper>
  )
}

export default Cancelled
