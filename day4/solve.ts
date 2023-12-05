import { intersection, range, sum, uniq } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

type Card = {
  number: number;
  winningNums: number[];
  ourNums: number[];
  matchingNums: number[];
  score: number;
};

function parseCard(input: string): Card {
  const [rawNumber, rawNums] = input.split(':').map((l) => l.trim());
  const [rawWinning, rawOur] = rawNums.split('|').map((l) => l.trim());
  const winningNums = uniq(
    rawWinning.split(/\s+/).map((raw) => Number(raw.trim())),
  );
  const ourNums = uniq(rawOur.split(/\s+/).map((raw) => Number(raw.trim())));

  const winners = intersection(winningNums, ourNums);

  return {
    number: Number(rawNumber.split(/\s+/)[1]),
    winningNums,
    ourNums,
    matchingNums: winners,
    score: winners.length > 0 ? Math.pow(2, winners.length - 1) : 0,
  };
}

function part1(_input: string[]) {
  const cards = _input.map((line) => parseCard(line));
  const points = sum(cards.map((c) => c.score));
  return points;
}

function part2(_input: string[]) {
  const cards = _input.map((line) => parseCard(line));
  const cardVault = new Map<number, number>();

  for (const card of cards.values()) {
    cardVault.set(card.number, 1);
  }

  for (const card of cards.values()) {
    const numCards = cardVault.get(card.number);
    if (card.matchingNums.length > 0) {
      const start = card.number + 1;
      const end = start + card.matchingNums.length;
      for (const cardNumber of range(start, end)) {
        const existing = cardVault.get(cardNumber) ?? 0;
        cardVault.set(cardNumber, existing + numCards);
      }
    }
  }

  const total = sum(Array.from(cardVault.values()));
  return total;
}

solve({ part1, test1: 13, part2, test2: 30, parser: parseLines() });
