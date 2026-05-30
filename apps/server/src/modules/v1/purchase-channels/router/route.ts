import { Router, type IRouter } from 'express'

import purchaseLocationGroupRoute from './purchase-location-group.route'
import purchaseLocationRoute from './purchase-location.route'

const purchaseChannelsResourcesV1: IRouter = Router()

purchaseChannelsResourcesV1.use('/purchase-location-groups', purchaseLocationGroupRoute)
purchaseChannelsResourcesV1.use('/purchase-locations', purchaseLocationRoute)

export default purchaseChannelsResourcesV1
