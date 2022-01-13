import * as t from '../types'



export class JobItem {
  static toModel(item: t.JobItem): t.Job {
    return {
      id: item.id,
      title: item.title,
      location: item.location,
      link: item.link,
      createdAt: item.createdAt,
      description: item.description,
      thumbnail: {
        url: item.thumbnail?.url,
        id: item.thumbnail?.id
      },
      company: {
        name: item.companyName
      }
    }
  }
}

export class WorkerItem {
  static toModel(item: t.WorkerItem): t.Worker {
    return {
      id: item.id,
      name: item.name,
      desiredRole: item.desiredRole,
      createdAt: item.createdAt,
      description: item.description,
      thumbnail: {
        url: item.thumbnail?.url,
        id: item.thumbnail?.id
      }
    }
  }
}