import HackQuery from './HackQuery'
import { useQuery } from 'remax'
import { useState } from 'react'

export { HackQuery }

export function useHackQuery<Q = any>(): Q {
  const query: any = useQuery()
  const [hackQuery] = useState<any>(() => (
    HackQuery.parseQueryObj(query)
  ))
  return hackQuery
}
