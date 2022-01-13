import _ from 'radash'
import * as t from '../../core/types'
import type { Props } from '@exobase/core'
import { useJsonArgs, useCors, useService } from '@exobase/hooks'
import { useLambda } from '@exobase/lambda'
import makeGraphCMS, { GraphCMS } from '../../core/graphcms'


interface Args {
  pageSize: number
  page: number
}

interface Services {
  graphcms: GraphCMS
}

interface Response {
  workers: t.Worker[]
}

async function listWorkers({ args, services }: Props<Args, Services>): Promise<Response> {
  const { graphcms } = services

  const { workers } = await graphcms.listWorkers({
    size: args.pageSize,
    page: args.page
  })

  return {
    workers
  }

}

export default _.compose(
  useLambda(),
  useCors(),
  useJsonArgs<Args>(yup => ({
    pageSize: yup.number().integer().positive().required(),
    page: yup.number().integer().positive().required()
  })),
  useService<Services>({
    graphcms: makeGraphCMS()
  }),
  listWorkers
)