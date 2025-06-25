import express from 'express';
import UserController from '../controller/UserController.js';
const userRoutes = express.Router();


userRoutes.post('/users', UserController.createUser);
userRoutes.get('/users', UserController.listUsers);
userRoutes.get('/users/search', UserController.searchUsers);
userRoutes.get('/users/:id', UserController.getUser);
userRoutes.put('/users/:id', UserController.updateUser);
userRoutes.delete('/users/:id', UserController.deleteUser);

export default userRoutes;
