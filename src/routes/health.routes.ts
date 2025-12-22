import { Router } from 'express'
import {self, health} from '../controllers/health.controller.js'

const healthRouter = Router()

healthRouter.route('/').get(self)
healthRouter.route('/health').get(health)

export default healthRouter;
