import _ from 'radash'
import * as t from '../../core/types'
import type { Props } from '@exobase/core'
import { useJsonArgs, useCors, useService } from '@exobase/hooks'
import { useLambda } from '@exobase/lambda'
import makeGraphCMS, { GraphCMS } from '../../core/graphcms'


interface Args {
  title: string
  location: string
  link: string
  companyName: string
  description: string
  thumbnailId: string | null
}

interface Services {
  graphcms: GraphCMS
}

interface Response {
  job: t.Job
}

async function submitJobPosting({ args, services }: Props<Args, Services>): Promise<Response> {
  const { graphcms } = services

  const job = await graphcms.createJob({
    title: args.title,
    location: args.location,
    description: args.description,
    link: args.link,
    createdAt: new Date().toISOString(),
    company: {
      name: args.companyName
    },
    thumbnail: {
      url: null,
      id: args.thumbnailId
    }
  })

  if (args.thumbnailId) {
    await graphcms.publishAsset(args.thumbnailId)
  }

  await graphcms.publishJob(job.id)

  return {
    job
  }

}

export default _.compose(
  useLambda(),
  useCors(),
  useJsonArgs<Args>(yup => ({
    title: yup.string().required().min(1, 'Cannot be empty'),
    location: yup.string().required().min(1, 'Cannot be empty'),
    link: yup.string().required().min(1, 'Cannot be empty'),
    companyName: yup.string().required().min(1, 'Cannot be empty'),
    description: yup.string().required(),
    thumbnailId: yup.string().nullable().default(null)
  })),
  useService<Services>({
    graphcms: makeGraphCMS()
  }),
  submitJobPosting
)