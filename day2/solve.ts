import { parseLines, solve } from '../utils/typescript';

type Set = {
  blue: number;
  red: number;
  green: number;
};

type Game = {
  value: number;
  sets: Set[];
};

const Part1Max: Set = {
  blue: 14,
  green: 13,
  red: 12,
};

function parseSets(str: string): Set {
  let set: Set = {
    blue: 0,
    red: 0,
    green: 0,
  };

  const rawTuples = str.split(',').map((l) => l.trim());
  rawTuples.map((tuple) => {
    const [value, name] = tuple.split(' ');
    set[name] = Number.parseInt(value);
  });

  return set;
}

function parseGame(line: string): Game {
  const [game, rest] = line.split(':').map((l) => l.trim());
  const [_, rawValue] = game.split(' ');

  const value = Number.parseInt(rawValue);
  const rawSets = rest.split(';').map((l) => l.trim());
  const sets = rawSets.map((str) => parseSets(str));

  return {
    value,
    sets,
  };
}

function parseGames(lines: string[]): Game[] {
  return lines.map((line) => parseGame(line));
}

function part1(_input: string[]) {
  const games = parseGames(_input);

  return games
    .filter((game) => {
      const badSets = game.sets.filter((set) => {
        return (
          set.blue > Part1Max.blue ||
          set.green > Part1Max.green ||
          set.red > Part1Max.red
        );
      });
      return badSets.length === 0;
    })
    .reduce((acc, curGame) => acc + curGame.value, 0);
}

function part2(_input: string[]) {
  const games = parseGames(_input);

  const mins = games.map((game) => {
    return {
      blue: Math.max(...game.sets.map((set) => set.blue)),
      green: Math.max(...game.sets.map((set) => set.green)),
      red: Math.max(...game.sets.map((set) => set.red)),
    } as Set;
  });

  const powers = mins.map((min) => min.blue * min.red * min.green);
  return powers.reduce((acc, cur) => acc + cur, 0);
}

solve({ part1, test1: 8, part2, test2: 2286, parser: parseLines() });
