
//
//  LEGEND
//
//  _ = private, should not be deliverd to client, ever. Internal
//  $ = nosql non-normal duplication of source record, compressed
//
//  This convention helps us easily identify internal fields that
//  should never be exposed to the user -- namely in the mappers.
//

export type Job = {
  id: string
  title: string
  location: string
  link: string
  createdAt: string
  description: string
  company: {
    name: string
  }
  thumbnail: {
    id: string
    url: string
  }
}

export type Worker = {
  id: string
  name: string
  desiredRole: string
  description: string
  createdAt: string
  thumbnail: {
    id: string
    url: string
  }
}