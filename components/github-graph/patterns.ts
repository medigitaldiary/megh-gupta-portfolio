// Pixel masks for the contribution pill. 7 rows x 15 columns, the grid
// measured off the reference clip. "#" is ink (GitHub level 4). "." is empty.
// Hello sits in the middle five rows. The heart fills the grid.

export const GRID_ROWS = 7;
export const GRID_COLS = 15;

export type Scene = "graph" | "hello" | "heart";

const HELLO_ROWS = [
  "...............",
  "#...###.#.#..#.",
  "#...#...#.#.#.#",
  "###.##..#.#.#.#",
  "#.#.#...#.#.#.#",
  "#.#.###.#.#..#.",
  "...............",
] as const;

const HEART_ROWS = [
  "....###.###....",
  "...#########...",
  "...#########...",
  "....#######....",
  ".....#####.....",
  "......###......",
  ".......#.......",
] as const;

function mask(rows: readonly string[]): readonly (readonly (0 | 1)[])[] {
  return rows.map((row) => {
    if (row.length !== GRID_COLS) {
      throw new Error(`github graph mask row must be ${GRID_COLS} wide`);
    }
    return [...row].map((cell) => (cell === "#" ? 1 : 0));
  });
}

const HELLO = mask(HELLO_ROWS);
const HEART = mask(HEART_ROWS);

export function maskAt(
  scene: Exclude<Scene, "graph">,
  row: number,
  col: number,
): 0 | 1 {
  const grid = scene === "hello" ? HELLO : HEART;
  return grid[row]?.[col] ?? 0;
}
