class NQueen {
    constructor(n) {
        this.N = n;
    }

    // Utility function to print the solution
    printSolution(board) {
        for (let i = 0; i < this.N; i++) {
            let row = '';
            for (let j = 0; j < this.N; j++) {
                row += ` ${board[i][j]} `;
            }
            console.log(row);
        }
    }

    // Check if a queen can be placed safely
    isSafe(grid, row, col) {
        // Check this row on left side
        for (let i = 0; i < col; i++) {
            if (grid[row][i] === 1) {
                return false;
            }
        }

        // Check upper diagonal on left side
        for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (grid[i][j] === 1) {
                return false;
            }
        }

        // Check lower diagonal on left side
        for (let i = row, j = col; j >= 0 && i < this.N; i++, j--) {
            if (grid[i][j] === 1) {
                return false;
            }
        }

        return true;
    }

    // Recursive utility function to solve N Queen problem
    solveNQUtil(grid, col) {
        // Base case: If all queens are placed then return true
        if (col >= this.N) {
            return true;
        }

        // Consider this column and try placing this queen in all rows one by one
        for (let i = 0; i < this.N; i++) {
            // Check if the queen can be placed on board[i][col]
            if (this.isSafe(grid, i, col)) {
                // Place this queen in board[i][col]
                grid[i][col] = 1;

                // Recur to place rest of the queens
                if (this.solveNQUtil(grid, col + 1)) {
                    return true;
                }

                // If placing queen in board[i][col] doesn't lead to a solution
                // then remove queen from board[i][col]
                grid[i][col] = 0; // BACKTRACK
            }
        }

        // If the queen can't be placed in any row in this column col, return false
        return false;
    }

    solveNQ() {
        // Create N*N grid and initialize to 0
        const grid = Array(this.N).fill().map(() => Array(this.N).fill(0));

        if (!this.solveNQUtil(grid, 0)) {
            console.log(`Solution does not exist for ${this.N} queens`);
            return false;
        }

        console.log(`Solution found for ${this.N} queens`);
        this.printSolution(grid);
        return true;
    }
}

// Example usage
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Number of queens to place: ', (n) => {
    const queen = new NQueen(parseInt(n));
    queen.solveNQ();
    readline.close();
});
