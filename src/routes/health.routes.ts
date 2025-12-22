import { Router } from 'express';
import { self, health } from '../controllers/index.js';

export const healthRouter = Router();

healthRouter.route('/').get(self);
healthRouter.route('/health').get(health);
