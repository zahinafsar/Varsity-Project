// Directions: down, up, right, left
const DIRECTIONS = [
    { x: 1, y: 0, name: 'Down' },
    { x: -1, y: 0, name: 'Up' },
    { x: 0, y: 1, name: 'Right' },
    { x: 0, y: -1, name: 'Left' }
];

// Create the maze
const createMaze = () => [
    [0, 0, 1, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 1, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1]
];

// Check if position is valid
const isValidPosition = (x, y, maze) => {
    const size = maze.length;
    return x >= 0 && x < size && y >= 0 && y < size && maze[x][y] === 1;
};

// DFS function
const dfs = (maze, currentX, currentY, goalX, goalY, depth = 0, visited = new Set()) => {
    // Create a unique key for the current position
    const positionKey = `${currentX},${currentY}`;
    
    // If we've reached the goal
    if (currentX === goalX && currentY === goalY) {
        return { found: true, depth };
    }
    
    // Mark current position as visited
    visited.add(positionKey);
    
    // Try each direction
    for (const dir of DIRECTIONS) {
        const newX = currentX + dir.x;
        const newY = currentY + dir.y;
        
        if (isValidPosition(newX, newY, maze) && !visited.has(`${newX},${newY}`)) {
            console.log(`Moving ${dir.name} (${newX}, ${newY})`);
            
            const result = dfs(maze, newX, newY, goalX, goalY, depth + 1, visited);
            if (result.found) {
                return result;
            }
        }
    }
    
    return { found: false, depth: 0 };
};

// Main function to run the DFS
const runDFS = () => {
    const maze = createMaze();
    const startX = 0;
    const startY = 2;
    const goalX = 4;
    const goalY = 4;
    
    const result = dfs(maze, startX, startY, goalX, goalY);
    
    if (result.found) {
        console.log("Goal found");
        console.log(`Number of moves required = ${result.depth}`);
    } else {
        console.log("Goal cannot be reached from starting block");
    }
};

// Run the DFS
runDFS();
