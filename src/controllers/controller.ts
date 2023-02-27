import { Response, Request } from 'express';

import { JokesFileRepo } from '../repository/jokes.file.repo.js';

export class JokesController {
  // eslint-disable-next-line no-useless-constructor, no-unused-vars
  constructor(public repo: JokesFileRepo) {}

  getAll(_req: Request, resp: Response) {
    this.repo.read().then((data) => {
      resp.json(data);
    });
  }

  getById(req: Request, resp: Response) {
    const jokeNum = Number(req.params.id);

    this.repo
      .readById(jokeNum)
      .then((data) =>
        data === undefined
          ? resp.status(404).send(`<p>Error, joke num ${jokeNum} not found</p>`)
          : resp.status(200).json(data)
      );
  }

  async write(req: Request, resp: Response) {
    const newJoke = req.body;
    await this.repo.write(newJoke);
    resp.send(`A new joke has been added successfully`);
  }

  patch(req: Request, resp: Response) {
    const jokeNum = Number(req.params.id);
    this.repo
      .update(jokeNum, req.body)
      .then((data) =>
        data === undefined
          ? resp.status(404).send(`<p>Error, joke num ${jokeNum} not found</p>`)
          : resp.json(data)
      );
  }

  async delete(req: Request, resp: Response) {
    const jokeNum = Number(req.params.id);
    const data = await this.repo.readById(jokeNum);
    if (!data) return resp.send(`<p>Error, joke num ${jokeNum} not found</p>`);
    await this.repo.delete(jokeNum);
    resp.send(`<p>Joke num ${jokeNum} has been deleted</p`);
  }
}
