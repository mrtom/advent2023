import { keys, map, sum, values, without } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

const digitsMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 0,
};

function justDigits(line: string) {
  return line.replace(/[^0-9]/g, '');
}

function calibrationValue(line: string) {
  const digits = justDigits(line);
  const characters = digits.split('');
  return parseInt(`${characters[0]}${characters.at(-1)}`, 10);
}

function part1(_input: string[]) {
  return sum(map(_input, calibrationValue));
}

const regex2 = `(one|two|three|four|five|six|seven|eight|nine|\\d)`;

function toDigit(value: string): number {
  switch (value) {
    case 'one':
      return 1;
    case 'two':
      return 2;
    case 'three':
      return 3;
    case 'four':
      return 4;
    case 'five':
      return 5;
    case 'six':
      return 6;
    case 'seven':
      return 7;
    case 'eight':
      return 8;
    case 'nine':
      return 9;
    default: {
      return parseInt(value, 10);
    }
  }
}

function part2Line(line: string) {
  const first = toDigit(line.match(new RegExp(regex2))[1]);
  const last = toDigit(line.match(new RegExp(`.*${regex2}`))[1]);
  return parseInt(`${first}${last}`, 10);
}

function part2(_input: string[]) {
  return sum(map(_input, part2Line));
}

solve({
  part1,
  test1: 142,
  part2,
  test2: 281,
  parser: parseLines(),
});
