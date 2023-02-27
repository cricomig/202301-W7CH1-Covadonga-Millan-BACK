import { Router } from 'express';
import { JokesController } from '../controllers/controller.js';
import { JokesFileRepo } from '../repository/jokes.file.repo.js';

// eslint-disable-next-line new-cap
export const jokesRouter = Router();
const repo = new JokesFileRepo();
const controller = new JokesController(repo);

jokesRouter.get('/', controller.getAll.bind(controller));
jokesRouter.get('/:id', controller.getById.bind(controller));
jokesRouter.post('/', controller.write.bind(controller));
jokesRouter.patch('/:id', controller.patch.bind(controller));
jokesRouter.delete('/:id', controller.delete.bind(controller));
