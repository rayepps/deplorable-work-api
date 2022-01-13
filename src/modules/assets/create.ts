import _ from 'radash'
import type { Props } from '@exobase/core'
import { useJsonArgs, useCors, useService } from '@exobase/hooks'
import { useLambda } from '@exobase/lambda'
import makeGraphCMS, { GraphCMS } from '../../core/graphcms'


interface Args {
  url: string
}

interface Services {
  graphcms: GraphCMS
}

interface Response {
  assetId: string
}

async function submitJobPosting({ args, services }: Props<Args, Services>): Promise<Response> {
  const { graphcms } = services

  const assetId = await graphcms.createAsset({
    url: args.url
  })

  return {
    assetId
  }

}

export default _.compose(
  useLambda(),
  useCors(),
  useJsonArgs<Args>(yup => ({
    url: yup.string().required()
  })),
  useService<Services>({
    graphcms: makeGraphCMS()
  }),
  submitJobPosting
)