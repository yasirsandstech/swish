import express from 'express';
import * as shootingController from '../controller/shootingController.js';
export const shootingRouter=express.Router();

import auth from '../middleware/auth.js';


shootingRouter.post('/playshooting',auth,shootingController.playShootingGame);

shootingRouter.get('/getshooting',auth,shootingController.getShootingGame);

shootingRouter.put('/updateshooting/:id',auth,shootingController.updateShootingGame);



