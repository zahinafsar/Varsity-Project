// Function to perform depth-limited search
const depthLimitedSearch = (graph, source, goal, maxDepth) => {
    const visited = new Set();
    const stack = [[source, 0]]; // [node, depth]
    
    while (stack.length > 0) {
        const [current, depth] = stack.pop();
        
        if (current === goal) {
            return true;
        }
        
        if (depth < maxDepth) {
            // Get neighbors and reverse them to maintain DFS order
            const neighbors = graph[current]
                .map((isConnected, index) => isConnected ? index : -1)
                .filter(node => node !== -1 && !visited.has(node))
                .reverse();
            
            for (const neighbor of neighbors) {
                visited.add(neighbor);
                stack.push([neighbor, depth + 1]);
            }
        }
    }
    return false;
};

// Main IDDFS function
const iterativeDeepening = (graph, source, goal) => {
    let maxDepth = 0;
    
    while (true) {
        console.log(`\nSearching at depth ${maxDepth}`);
        if (depthLimitedSearch(graph, source, goal, maxDepth)) {
            console.log(`\nGoal found at depth ${maxDepth}`);
            return true;
        }
        maxDepth++;
    }
};

// Example usage
const createGraph = (size) => {
    const graph = Array(size).fill().map(() => Array(size).fill(0));
    return graph;
};

// Test the implementation
const main = () => {
    // Example graph (5x5 adjacency matrix)
    const graph = [
        [0, 1, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 1, 0],
        [0, 1, 1, 0, 1],
        [0, 0, 0, 1, 0]
    ];
    
    const source = 0;
    const goal = 4;
    
    console.log("Starting IDDFS search...");
    iterativeDeepening(graph, source, goal);
};

// Run the example
main();
