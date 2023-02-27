import { JokesFileRepo } from './jokes.file.repo';
import fs from 'fs/promises';
import { Joke } from '../entities/jokes';

jest.mock('fs/promises');

describe('Given ThingsFileRepo', () => {
  const repo = new JokesFileRepo();
  test('Then it could be instantiated', () => {
    expect(repo).toBeInstanceOf(JokesFileRepo);
  });
  describe('When I use query', () => {
    test('Then should return the data', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');
      const result = await repo.query();
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When I use queryId', () => {
    test('Then it should return an object if it has a valid id', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "1"}]');
      const id = '1';
      const result = await repo.queryId(id);
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
    test('Then it should throw an error if it has an invalid id', () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[{"id": "2"}]');
      const id = '1';
      expect(async () => repo.queryId(id)).rejects.toThrow();
      expect(fs.readFile).toHaveBeenCalled();
    });
  });

  describe('When we use create', () => {
    test('Then it should return an object if we give a valid id', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('[]');
      const newJoke: Joke = {
        id: '8',
        joke: 'jeje',
        isFunny: false,
        alreadyKnewIt: false,
      };
      const result = await repo.create(newJoke);
      expect(result).toEqual(newJoke);
    });
  });

  describe('When we use update', () => {
    test('Then it should return an updated object if we give a valid id', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(
        '[{ "id": "1", "joke": "patata" }]'
      );
      const result = await repo.update({ id: '1', joke: 'jiji' });
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', joke: 'jiji' });
    });
    test('Then it should throw an error if it has an invalid id', () => {
      (fs.readFile as jest.Mock).mockResolvedValue(
        '[{ "id": "1", "joke": "patata" }]'
      );
      expect(async () =>
        repo.update({ id: '3', joke: 'jiji' })
      ).rejects.toThrow();
      expect(fs.readFile).toHaveBeenCalled();
    });
  });

  describe('When we use destroy', () => {
    test('Then it should return the data without the selected by id item ', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(
        '[{ "id": "1", "joke": "patata" },{ "id": "2", "joke": "jiji" }]'
      );
      const result = await repo.destroy('2');
      expect(fs.readFile).toHaveBeenCalled();
      expect(result).toBe(undefined);
    });
    test('Then it should throw an error if it has an invalid id', () => {
      (fs.readFile as jest.Mock).mockResolvedValue(
        '[{ "id": "1", "joke": "patata" }]'
      );
      expect(async () => repo.destroy('5')).rejects.toThrow();
      expect(fs.readFile).toHaveBeenCalled();
    });
  });
});
