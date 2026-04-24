import { Router, type IRouter } from 'express'

import documentRoute from './document.route'

const documentResourcesV1: IRouter = Router()

documentResourcesV1.use('/documents', documentRoute)

export default documentResourcesV1
