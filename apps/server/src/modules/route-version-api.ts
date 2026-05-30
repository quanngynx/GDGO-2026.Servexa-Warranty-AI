import { VERSION_API } from "@/core/constants/common.constant";
import { Router, type IRouter } from "express";
import routeIdentityV1 from "./v1/identity/router/route";
import routeHumanResourcesV1 from './v1/human-resources/router/route'
import routeProductCatalogV1 from './v1/product-catalog/router/route'
import routePurchaseChannelsV1 from './v1/purchase-channels/router/route'
import routeAscCenterV1 from './v1/asc-center/router/route'
import routeAiV1 from './v1/ai/router/route'
import routeDocumentV1 from './v1/document/router/route'

const routeVersionApi: IRouter = Router();

routeVersionApi.use(`/${VERSION_API.V1}/identity`, routeIdentityV1);
routeVersionApi.use(`/${VERSION_API.V1}/human-resources`, routeHumanResourcesV1)
routeVersionApi.use(`/${VERSION_API.V1}/product-catalog`, routeProductCatalogV1)
routeVersionApi.use(`/${VERSION_API.V1}/purchase-channels`, routePurchaseChannelsV1)
routeVersionApi.use(`/${VERSION_API.V1}/asc-center`, routeAscCenterV1)
routeVersionApi.use(`/${VERSION_API.V1}/ai`, routeAiV1)
routeVersionApi.use(`/${VERSION_API.V1}/document`, routeDocumentV1)

export default routeVersionApi;