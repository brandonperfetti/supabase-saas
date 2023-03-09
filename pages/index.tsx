import Link from 'next/link'
import { Wrapper } from '../components/common/Wrapper'
import { useUser } from '../context/user'
import { supabase } from '../utils/supabase'

interface LessonsProps {
  lessons: [id: any, title: string, created_at: string, description: string]
}

export default function Home({ lessons }: LessonsProps) {
  // @ts-ignore
  const { user } = useUser()
  console.log('user', { user })
  return (
    <Wrapper>
      {user?.email && <h1>{user?.email} Is Logged in</h1>}
      <div>
        <ul>
          {/* @ts-ignore */}
          {lessons.map((lesson) => (
            <li key={lesson.id} className="py-2">
              <Link href={`/${lesson.id}`}>
                <div className="p-8 h-40 mb-4 rounded shadow text-xl flex">
                  {lesson.title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  )
}

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from('lesson').select('*')
  return {
    props: {
      lessons
    }
  }
}
