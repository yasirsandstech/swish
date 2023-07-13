import express from 'express';
import * as goalController from '../controller/goalController.js';
export const goalRouter=express.Router();

import auth from '../middleware/auth.js';



goalRouter.post('/createGoal',auth,goalController.createGoals);

goalRouter.get('/getAllGoal',auth,goalController.getAllGoals);

goalRouter.get('/getAnalytics',auth,goalController.getAnalytics);

goalRouter.put('/updateGoals/:id',auth,goalController.updateGoals);