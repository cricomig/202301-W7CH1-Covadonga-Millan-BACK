import fs from 'fs/promises';
import { Repo } from './repo.interface';
import { Joke } from '../entities/jokes';

const file = './data/jokes.json';

export class JokesFileRepo implements Repo<Joke> {
  async query(): Promise<Joke[]> {
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    return JSON.parse(initialData);
  }

  async queryId(id: string): Promise<Joke> {
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    const data: Joke[] = JSON.parse(initialData);
    const finalData = data.find((item) => item.id === id);
    if (!finalData) throw new Error('Id not found');
    return finalData;
  }

  async create(info: Partial<Joke>): Promise<Joke> {
    // Future if (!validateInfo(info)) throw new Error('Not valid data');
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    const data: Joke[] = JSON.parse(initialData);
    info.id = String(Math.floor(Math.random() * 1000_000));
    const finalData = [...data, info];
    await fs.writeFile(file, JSON.stringify(finalData), 'utf-8');
    return info as Joke;
  }

  async update(info: Partial<Joke>): Promise<Joke> {
    if (!info.id) throw new Error('Not valid data');
    const initialData: string = await fs.readFile(file, { encoding: 'utf-8' });
    const data: Joke[] = JSON.parse(initialData);
    let updatedItem: Joke = {} as Joke;
    const finalData = data.map((item) => {
      if (item.id === info.id) {
        updatedItem = { ...item, ...info };
        return updatedItem;
      }

      return item;
    });

    if (!updatedItem.id) throw new Error('Id not found');
    await fs.writeFile(file, JSON.stringify(finalData), 'utf-8');
    return updatedItem as Joke;
  }

  async destroy(id: string): Promise<void> {
    const initialData: string = await fs.readFile(file, {
      encoding: 'utf-8',
    });
    const data: Joke[] = JSON.parse(initialData);
    const index = data.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Id not found');
    data.slice(index, 1);
    await fs.writeFile(file, JSON.stringify(data), 'utf-8');
  }
}
