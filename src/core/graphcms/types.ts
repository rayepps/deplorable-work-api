
//
//  LEGEND
//
//  _ = private, should not be deliverd to client, ever, internal
//  $ = nosql non-normal duplication of source record, compressed
//
//  This convention helps us easily identify internal fields that
//  should never be exposed to the user -- namely in the mappers.
//


export type TrainingType = 'tactical' | 'medical' | 'survival'


//
//  INTERNAL GraphCMS Types
//

/**
 * All GraphCMS collection items get these fields
 * generated and managed by GraphCMS
 */
interface BaseEntity {
    __typename: string
    id: string
    createdAt: string
    createdBy: Author
    updatedAt: string
    updatedBy: Author
    publishedAt: string
    publishedBy: Author
    stage: 'DRAFT' | 'PUBLISHED'
}

export interface Author {
    id: string
    name: string
}

export interface Location {
    longitude: number
    latitude: number
}

export interface Asset extends BaseEntity {
    url: string
    size: number
    fileName: string
    width: number
    height: number
}

export interface RichText {
    html: string
}


//
//  MODELS a.k.a items
//

export interface JobItem extends BaseEntity {
    title: string
    location: string
    description: string
    link: string
    companyName: string
    thumbnail: Asset
    createdAt: string
}

export interface WorkerItem extends BaseEntity {
    name: string
    desiredRole: string
    description: string
    thumbnail: Asset
}