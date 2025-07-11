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

// DFS function using explicit stack
const dfsWithStack = (maze, startX, startY, goalX, goalY) => {
    // Initialize stack with starting position and depth
    const stack = [{ x: startX, y: startY, depth: 0 }];
    const visited = new Set();
    
    while (stack.length > 0) {
        // Pop the top element from stack
        const { x: currentX, y: currentY, depth } = stack.pop();
        const positionKey = `${currentX},${currentY}`;
        
        // If we've reached the goal
        if (currentX === goalX && currentY === goalY) {
            return { found: true, depth };
        }
        
        // Skip if already visited
        if (visited.has(positionKey)) {
            continue;
        }
        
        // Mark current position as visited
        visited.add(positionKey);
        
        // Try each direction
        for (const dir of DIRECTIONS) {
            const newX = currentX + dir.x;
            const newY = currentY + dir.y;
            
            if (isValidPosition(newX, newY, maze) && !visited.has(`${newX},${newY}`)) {
                console.log(`Moving ${dir.name} (${newX}, ${newY})`);
                stack.push({ x: newX, y: newY, depth: depth + 1 });
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
    
    const result = dfsWithStack(maze, startX, startY, goalX, goalY);
    
    if (result.found) {
        console.log("Goal found");
        console.log(`Number of moves required = ${result.depth}`);
    } else {
        console.log("Goal cannot be reached from starting block");
    }
};

// Run the DFS
runDFS(); 