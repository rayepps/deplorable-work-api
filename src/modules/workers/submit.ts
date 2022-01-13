import _ from 'radash'
import * as t from '../../core/types'
import type { Props } from '@exobase/core'
import { useJsonArgs, useCors, useService } from '@exobase/hooks'
import { useLambda } from '@exobase/lambda'
import makeGraphCMS, { GraphCMS } from '../../core/graphcms'
import makeSlack, { SlackClient } from '../../core/slack'


interface Args {
  name: string
  desiredRole: string
  description: string
  thumbnailId: string | null
}

interface Services {
  graphcms: GraphCMS
  slack: SlackClient
}

interface Response {
  worker: t.Worker
}

async function submitWorkerProfile({ args, services }: Props<Args, Services>): Promise<Response> {
  const { graphcms, slack } = services

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

  slack.sendMessage(`*Worker Profile Created*
Id: \`${worker.id}\`
Name: \`${worker.name}\`
Role: \`${worker.desiredRole}\`
Thumbnail: ${worker.thumbnail?.url}
Edit: https://app.graphcms.com/c6f9fdc9fc0443d1b2b726217307c65f/master/content/6d919531bccb4a24bef1deb005634511/view/d57a29b985094f3c8b0d2e1ffb194fd5/${worker.id}
Description: 
\`\`\`
${worker.description}
\`\`\`
`)

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
    graphcms: makeGraphCMS(),
    slack: makeSlack()
  }),
  submitWorkerProfile
)