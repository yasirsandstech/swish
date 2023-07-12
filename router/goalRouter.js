import express from 'express';
import * as goalController from '../controller/goalController.js';
export const goalRouter=express.Router();

import auth from '../middleware/auth.js';



goalRouter.post('/creategoal',auth,goalController.createGoals);

goalRouter.get('/getgoal',auth,goalController.getGoals);

goalRouter.get('/getanalytics',auth,goalController.getAnalytics);

goalRouter.put('/updateGoals/:id',auth,goalController.updateGoals);