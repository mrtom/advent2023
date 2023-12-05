import { sum } from 'lodash';
import { parseLines, solve } from '../utils/typescript';

type PartNumber = {
  row: number;
  startCol: number;
  endCol: number;
  length: number;
  value: number;
};

type CellPos = {
  col: number;
  row: number;
};

type Cell = {
  type: 'Number' | 'Space' | 'Symbol';
  isStar: boolean;
  value?: number;
  pos: CellPos;
};

function cellPosToKey(cell: CellPos) {
  return `col:${cell.col},row:${cell.row}`;
}

function parseMap(x: string, rowIdx: number): Cell[] {
  return x.split('').map((c, colIdx) => {
    if (c.match(/[^0-9]/)) {
      return {
        type: c === '.' ? 'Space' : 'Symbol',
        isStar: c === '*',
        value: undefined,
        pos: {
          col: colIdx,
          row: rowIdx,
        },
      };
    } else {
      return {
        type: 'Number',
        isStar: false,
        value: Number(c),
        pos: {
          col: colIdx,
          row: rowIdx,
        },
      };
    }
  });
}

function findNeighbours(pos: CellPos, grid: Cell[][]): CellPos[] {
  const rowIdx = pos.row;
  const colIdx = pos.col;

  const row = grid[rowIdx];

  let result: CellPos[] = [];

  for (
    let y = Math.max(0, rowIdx - 1);
    y <= Math.min(rowIdx + 1, grid.length - 1);
    y++
  ) {
    for (
      let x = Math.max(0, colIdx - 1);
      x <= Math.min(colIdx + 1, row.length - 1);
      x++
    ) {
      if (!(x === colIdx && y === rowIdx)) {
        result.push({
          col: x,
          row: y,
        });
      }
    }
  }

  return result;
}

function isAdjacent(partNumber: PartNumber, neighbours: CellPos[]): boolean {
  for (const neighbour of neighbours.values()) {
    if (
      partNumber.row === neighbour.row &&
      partNumber.startCol <= neighbour.col &&
      partNumber.endCol >= neighbour.col
    ) {
      return true;
    }
  }
  return false;
}

function generateNumbersAndValidLocations(
  grid: Cell[][],
): [Set<string>, Set<PartNumber>] {
  // Iterate over the grid, find all the symbols and build a set of
  // cell locations that a number must be in to be a part number
  // Also build a list of all numbers at the same time

  let validLocations = new Set<string>();
  let numbers = new Set<PartNumber>();

  grid.map((row, rowIdx) => {
    let numberBuilder = '';
    let numberStartCol: number | undefined = undefined;

    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cell = grid[rowIdx][colIdx];
      const type = cell.type;
      if (type === 'Symbol') {
        // First, if we were iterating over a number, store it
        if (numberStartCol !== undefined) {
          numbers.add({
            row: rowIdx,
            startCol: numberStartCol,
            endCol: colIdx - 1,
            length: colIdx - numberStartCol,
            value: Number(numberBuilder),
          });
          numberStartCol = undefined;
          numberBuilder = '';
        }

        const neighbours = findNeighbours(cell.pos, grid);
        for (const neighbour of neighbours.values()) {
          validLocations.add(
            cellPosToKey({
              col: neighbour.col,
              row: neighbour.row,
            }),
          );
        }
      } else if (type === 'Number') {
        if (numberStartCol === undefined) {
          numberStartCol = colIdx;
        }
        numberBuilder = numberBuilder.concat(`${cell.value}`);

        // If number ends on last column, catch it
        if (colIdx === row.length - 1) {
          numbers.add({
            row: rowIdx,
            startCol: numberStartCol,
            endCol: colIdx - 1,
            length: colIdx - numberStartCol,
            value: Number(numberBuilder),
          });
        }
      } else if (type === 'Space') {
        // If we were iterating over a number, store it
        if (numberStartCol !== undefined) {
          numbers.add({
            row: rowIdx,
            startCol: numberStartCol,
            endCol: colIdx - 1,
            length: colIdx - numberStartCol,
            value: Number(numberBuilder),
          });
          numberStartCol = undefined;
          numberBuilder = '';
        }
      }
    }
  });

  return [validLocations, numbers];
}

function part1(grid: Cell[][]) {
  const [validLocations, numbers] = generateNumbersAndValidLocations(grid);

  // Filter numbers to only include those that fall over the valid locations
  const goodNumbers = Array.from(numbers).filter((partNumber) => {
    let isValid = false;
    for (let i = partNumber.startCol; i <= partNumber.endCol; i++) {
      if (validLocations.has(cellPosToKey({ col: i, row: partNumber.row }))) {
        isValid = true;
        break;
      }
    }
    return isValid;
  });

  const answer = goodNumbers.reduce(
    (acc, partNumber) => acc + partNumber.value,
    0,
  );

  return answer;
}

function part2(grid: Cell[][]) {
  const [_, numbers] = generateNumbersAndValidLocations(grid);
  const stars = grid.flat().filter((cell) => {
    return cell.isStar;
  });

  const gearRatios = stars.map((star) => {
    const neighbours = findNeighbours(star.pos, grid);
    const adjacentPartNumbers = Array.from(numbers).filter((partNumber) => {
      return isAdjacent(partNumber, neighbours);
    });

    if (adjacentPartNumbers.length === 2) {
      return adjacentPartNumbers[0].value * adjacentPartNumbers[1].value;
    }

    return 0;
  });

  return sum(gearRatios);
}

solve({
  part1,
  test1: 4361,
  part2,
  test2: 467835,
  parser: parseLines({ mapFn: parseMap }),
});
