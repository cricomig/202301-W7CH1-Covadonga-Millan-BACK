import fs from 'fs/promises';
import { Joke } from '../models/jokes';

const file = './data/jokes.json';

export class JokesFileRepo {
  read(): Promise<Joke[]> {
    return fs
      .readFile(file, { encoding: 'utf-8' })
      .then((data) => JSON.parse(data));
  }

  async readById(id: Joke['id']) {
    const initialData = await fs.readFile(file, {
      encoding: 'utf-8',
    });
    const data: Joke[] = JSON.parse(initialData);
    return data.filter((item) => item.id === id)[0];
  }

  async write(joke: Joke) {
    const initialData = await fs.readFile(file, {
      encoding: 'utf-8',
    });
    const data: Joke[] = JSON.parse(initialData);
    const newId: number =
      data.length > 0 ? Math.max(...data.map((item) => item.id)) : 0;
    joke.id = newId + 1;
    const newData = JSON.stringify([...data, joke]);
    await fs.writeFile(file, newData, {
      encoding: 'utf-8',
    });
  }

  async update(id: number, newData: any) {
    const data = await fs.readFile(file, 'utf-8');
    const parseJSON = JSON.parse(data);
    const updatedData = parseJSON.map((item: { id: number }) => {
      if (item.id === id) {
        return { ...item, ...newData };
      }

      return item;
    });
    const finalFile = JSON.stringify(updatedData);
    await fs.writeFile(file, finalFile, 'utf-8');
  }

  async delete(id: Joke['id']) {
    const initialData = await fs.readFile(file, {
      encoding: 'utf-8',
    });
    const data: Joke[] = JSON.parse(initialData);
    const dataFiltered = data.filter((item) => item.id !== id);
    const newData = JSON.stringify(dataFiltered);
    await fs.writeFile(file, newData, {
      encoding: 'utf-8',
    });
  }
}
