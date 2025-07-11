// Simple BFS implementation
const bfs = (graph, startX, startY, goalX, goalY) => {
    const N = graph.length;
    const queue = [{ x: startX, y: startY, level: 0 }];
    const visited = graph.map(row => [...row]);

    while (queue.length > 0) {
        const { x, y, level } = queue.shift();

        // Check if goal reached
        if (x === goalX && y === goalY) {
            return level;
        }

        // Try all four directions
        const moves = [
            [x + 1, y], [x - 1, y],
            [x, y + 1], [x, y - 1]
        ];

        // Process each move
        for (const [newX, newY] of moves) {
            if (newX >= 0 && newX < N &&
                newY >= 0 && newY < N &&
                visited[newX][newY] === 1) {
                visited[newX][newY] = 0;
                queue.push({ x: newX, y: newY, level: level + 1 });
            }
        }
    }
    return null;
};

// Initialize and run BFS
const initBFS = () => {
    const graph = [
        [0, 0, 1, 0, 1],
        [0, 1, 1, 1, 1],
        [0, 1, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1]
    ];

    const result = bfs(graph, 0, 2, 4, 4);

    if (result !== null) {
        console.log("Goal found");
        console.log("Number of moves required =", result);
    } else {
        console.log("Goal cannot be reached from starting block");
    }
};

// Run the BFS
initBFS();
