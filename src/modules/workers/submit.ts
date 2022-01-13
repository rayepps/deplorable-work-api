import _ from 'radash'
import * as t from '../../core/types'
import type { Props } from '@exobase/core'
import { useJsonArgs, useCors, useService } from '@exobase/hooks'
import { useLambda } from '@exobase/lambda'
import makeGraphCMS, { GraphCMS } from '../../core/graphcms'


interface Args {
  name: string
  desiredRole: string
  description: string
  thumbnailId: string | null
}

interface Services {
  graphcms: GraphCMS
}

interface Response {
  worker: t.Worker
}

async function submitWorkerProfile({ args, services }: Props<Args, Services>): Promise<Response> {
  const { graphcms } = services

  const worker = await graphcms.createWorker({
    name: args.name,
    description: args.description,
    desiredRole: args.desiredRole,
    createdAt: new Date().toISOString(),
    thumbnail: {
      url: null,
      id: args.thumbnailId
    }
  })

  if (args.thumbnailId) {
    await graphcms.publishAsset(args.thumbnailId)
  }

  await graphcms.publishWorker(worker.id)

  return {
    worker
  }

}

export default _.compose(
  useLambda(),
  useCors(),
  useJsonArgs<Args>(yup => ({
    name: yup.string().required().min(1, 'Cannot be empty'),
    desiredRole: yup.string().required().min(1, 'Cannot be empty'),
    description: yup.string().required().min(1, 'Cannot be empty'),
    thumbnailId: yup.string().nullable().default(null)
  })),
  useService<Services>({
    graphcms: makeGraphCMS()
  }),
  submitWorkerProfile
)