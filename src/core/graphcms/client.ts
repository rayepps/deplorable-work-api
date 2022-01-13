import { gql, GraphQLClient } from 'graphql-request'
import * as t from '../types'
import * as mappers from './mappers'
import axios from 'axios'


export class GraphCMS {

  constructor(
    private url: string,
    private token: string,
    private client: GraphQLClient
  ) { }

  async findJob(id: string): Promise<t.Job> {
    const query = gql`
      query findJobById {
        job(where: {
          id: "${id}"
        }) {
          id
          title
          location
          link
          createdAt
          companyName
          thumbnail {
            url
          }
        }
      }
    `
    const response = await this.client.request<{ job: t.JobItem }>(query)
    if (!response.job) return null
    return mappers.JobItem.toModel(response.job)
  }

  async createAsset({ url }: { url: string }): Promise<string> {
    const response = await axios(`${this.url}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `url=${encodeURIComponent(url)}`,
    })
    return response.data.id as string
  }

  async createJob(model: Omit<t.Job, 'id'>): Promise<t.Job> {
    const mutation = gql`
      mutation MakeJob($data: JobCreateInput!) {
        createJob(data: $data) {
          id
        }
      }
    `
    const response = await this.client.request(mutation, {
      data: {
        title: model.title,
        location: model.location,
        link: model.link,
        companyName: model.company.name,
        description: model.description,
        ...(model.thumbnail?.id && {
          thumbnail: {
            connect: {
              id: model.thumbnail.id
            }
          }
        })
      }
    })
    return {
      ...model,
      id: response.createJob.id
    }
  }
  
  async createWorker(model: Omit<t.Worker, 'id'>): Promise<t.Worker> {
    const mutation = gql`
      mutation MakeWorker($data: WorkerCreateInput!) {
        createWorker(data: $data) {
          id
        }
      }
    `
    const response = await this.client.request(mutation, {
      data: {
        name: model.name,
        desiredRole: model.desiredRole,
        description: model.description,
        ...(model.thumbnail?.id && {
          thumbnail: {
            connect: {
              id: model.thumbnail.id
            }
          }
        })
      }
    })
    return {
      ...model,
      id: response.createWorker.id
    }
  }

  async publishJob(jobId: string): Promise<void> {
    const mutation = gql`
      mutation PublishJob {
        publishJob(where: { id: "${jobId}" }, to: PUBLISHED) {
          id
        }
      }
    `
    await this.client.request(mutation)
  }

  async publishWorker(workerId: string): Promise<void> {
    const mutation = gql`
      mutation PublishWorker {
        publishWorker(where: { id: "${workerId}" }, to: PUBLISHED) {
          id
        }
      }
    `
    await this.client.request(mutation)
  }

  async publishAsset(assetId: string): Promise<void> {
    const mutation = gql`
      mutation PublishAsset {
        publishAsset(where: { id: "${assetId}" }, to: PUBLISHED) {
          id
        }
      }
    `
    await this.client.request(mutation)
  }

  async listJobs({
    page,
    size
  }: {
    page: number
    size: number
  }): Promise<{ jobs: t.Job[] }> {
    const query = gql`
      query listJobs {
        jobs(skip: ${(page - 1) * size}, first: ${size}) {
          id
          title
          location
          description
          link
          createdAt
          companyName
          thumbnail {
            url
          }
        }
      }
    `
    const response = await this.client.request<{ jobs: t.JobItem[] }>(query)
    if (!response.jobs) return {
      jobs: []
    }
    return {
      jobs: response.jobs.map(mappers.JobItem.toModel)
    }
  }
  
  async listWorkers({
    page,
    size
  }: {
    page: number
    size: number
  }): Promise<{ workers: t.Worker[] }> {
    const query = gql`
      query listWorkers {
        workers(skip: ${(page - 1) * size}, first: ${size}) {
          id
          name
          description
          desiredRole
          createdAt
          thumbnail {
            url
          }
        }
      }
    `
    const response = await this.client.request<{ workers: t.WorkerItem[] }>(query)
    if (!response.workers) return {
      workers: []
    }
    return {
      workers: response.workers.map(mappers.WorkerItem.toModel)
    }
  }

  // async searchEvents(search: {
  //   pageSize: number
  //   page: number
  //   orderBy?: 'price' | 'date'
  //   orderAs?: 'asc' | 'desc'
  //   type?: t.TrainingType
  //   tags?: string[]
  //   state?: string
  //   city?: string
  //   company?: string
  //   dates?: {
  //     preset: 'this-month' | 'next-month' | 'custom'
  //     startsAfter?: string
  //     endsBefore?: string
  //   }
  // }): Promise<{
  //   events: t.Event[]
  //   total: number
  // }> {
  //   const query = gql`
  //     query searchEvents($first: Int, $skip: Int, $stage: Stage!, $where: EventWhereInput, $orderBy: EventOrderByInput) {
  //       page: eventsConnection(
  //         first: $first
  //         skip: $skip
  //         stage: $stage
  //         where: $where
  //         orderBy: $orderBy
  //       ) {
  //         edges {
  //           node {
  //             id
  //             startDate
  //             endDate
  //             city
  //             state
  //             directLink
  //             externalLink
  //             slug
  //             location {
  //               latitude
  //               longitude
  //             }
  //             training {
  //               id
  //               slug
  //               name
  //               price
  //               displayPrice
  //               tags {
  //                 slug
  //                 name
  //               }
  //               thumbnail {
  //                 id
  //                 url
  //               }
  //               company {
  //                 id
  //                 slug
  //                 name
  //                 thumbnail {
  //                   id
  //                   url
  //                 }
  //               }
  //             }
  //           }
  //         }
  //         aggregate {
  //           count
  //         }
  //       }
  //     }
  //   `

  //   console.log('search')
  //   console.log(JSON.stringify(search, null, 2))

  //   const makeVariables = (): object => {
  //     const vars = {
  //       first: search.pageSize,
  //       skip: search.pageSize * (search.page - 1),
  //       stage: 'PUBLISHED',
  //       where: {
  //         AND: []
  //       },
  //       orderBy: null // TODO
  //     }

  //     if (search.orderBy && search.orderAs) {
  //       const orderBy = search.orderBy === 'date'
  //         ? 'startDate'
  //         : 'trainingPrice'
  //       vars.orderBy = `${orderBy}_${search.orderAs.toUpperCase()}`
  //     }

  //     if (search.tags) {
  //       vars.where.AND.push({
  //         training: {
  //           tags_some: {
  //             slug_in: search.tags
  //           }
  //         }
  //       })
  //     }

  //     if (search.type) {
  //       vars.where.AND.push({
  //         training: {
  //           type: search.type
  //         }
  //       })
  //     }

  //     if (search.state) {
  //       vars.where.AND.push({
  //         state: search.state
  //       })
  //     }

  //     if (search.company) {
  //       vars.where.AND.push({
  //         training: {
  //           company: {
  //             slug: search.company
  //           }
  //         }
  //       })
  //     }

  //     if (search.dates.preset) {
  //       const { preset } = search.dates
  //       if (preset === 'custom') {
  //         vars.where.AND.push({
  //           startDate_gt: search.dates.startsAfter,
  //           endDate_lt: search.dates.endsBefore
  //         })
  //       } else {
  //         const today = new Date()
  //         const range = preset === 'this-month'
  //           ? {
  //             startsAfter: today.toISOString(),
  //             endsBefore: new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()
  //           } : {
  //             startsAfter: new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString(),
  //             endsBefore: new Date(today.getFullYear(), today.getMonth() + 2, 0).toISOString()
  //           }
  //         vars.where.AND.push({
  //           startDate_gt: range.startsAfter,
  //           endDate_lt: range.endsBefore
  //         })
  //       }
  //     }

  //     console.log('variables')
  //     console.log(JSON.stringify(vars, null, 2))

  //     return vars
  //   }
  //   const response = await this.client.request<SearchEventsResponse>(query, makeVariables())
  //   return {
  //     events: response.page.edges.map(e => e.node),
  //     total: response.page.aggregate.count
  //   }

  // }

}

// type SearchEventsResponse = {
//   page: {
//     edges: {
//       node: t.Event
//     }[]
//     aggregate: {
//       count: number
//     }
//   }
// }