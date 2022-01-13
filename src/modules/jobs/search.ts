import _ from 'radash'
import * as t from '../../core/types'
import type { Props } from '@exobase/core'
import { useJsonArgs, useCors, useService } from '@exobase/hooks'
import { useLambda } from '@exobase/lambda'
import makeGraphCMS, { GraphCMS } from '../../core/graphcms'


interface Args {
  pageSize: number
  page: number
  orderBy: 'price' | 'date'
  orderAs: 'asc' | 'desc'
  type?: t.TrainingType
  tags?: string[]
  state?: string
  city?: string
  company?: string
  dates?: {
    preset: 'this-month' | 'next-month' | 'custom'
    startsAfter?: string
    endsBefore?: string
  }
}

interface Services {
  graphcms: GraphCMS
}

interface Response {
  jobs: t.Job[]
  total: number
}

async function searchEvents({ args, services }: Props<Args, Services>): Promise<Response> {
  const { graphcms } = services
  const query = args

  // const {
  //   events,
  //   total
  // } = await graphcms.searchEvents(query)

  return {
    jobs: [],
    total: 0
  }

}

export default _.compose(
  useLambda(),
  useCors(),
  useJsonArgs<Args>(yup => ({
    pageSize: yup.number().integer().positive().required(),
    page: yup.number().integer().positive().required(),
    orderBy: yup.string().required(),
    orderAs: yup.string().required(),
    type: yup.string(),
    tags: yup.array().of(yup.string()),
    state: yup.string(),
    city: yup.string(),
    company: yup.string(),
    dates: yup.object({
      preset: yup.string(),
      startsAfter: yup.string(),
      endsBefore: yup.string()
    })
  })),
  useService<Services>({
    graphcms: makeGraphCMS()
  }),
  searchEvents
)