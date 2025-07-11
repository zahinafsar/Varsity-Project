const adjacencyMatrix = [
    [0, 1, 1, 0, 0, 0],
    [1, 0, 1, 1, 0, 0],
    [1, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 0, 1],
    [0, 0, 0, 1, 1, 0]
];

// Stack-based Depth-Limited DFS
function depthLimitedSearch(startNode, targetNode, maxDepth) {
    const searchStack = [[startNode, maxDepth]]; // [currentNode, remainingDepth]
    const visitedNodes = new Set();

    while (searchStack.length > 0) {
        const [currentNode, currentDepth] = searchStack.pop();

        if (currentNode === targetNode) return true;
        if (currentDepth === 0) continue;

        if (!visitedNodes.has(currentNode)) {
            visitedNodes.add(currentNode);
            
            // Push neighbors in reverse order to maintain DFS order
            for (let neighborIndex = adjacencyMatrix[currentNode].length - 1; neighborIndex >= 0; neighborIndex--) {
                if (adjacencyMatrix[currentNode][neighborIndex] === 1 && !visitedNodes.has(neighborIndex)) {
                    searchStack.push([neighborIndex, currentDepth - 1]);
                }
            }
        }
    }

    return false;
}

// Iterative Deepening Depth-First Search
function iterativeDeepeningDFS(startNode, targetNode, maxDepth) {
    for (let currentDepth = 0; currentDepth <= maxDepth; currentDepth++) {
        if (depthLimitedSearch(startNode, targetNode, currentDepth)) {
            console.log(`Found target node ${targetNode} at depth ${currentDepth}`);
            return true;
        }
    }
    console.log(`Target node ${targetNode} not found up to depth ${maxDepth}`);
    return false;
}

// Example usage
const startNode = 0;
const targetNode = 5;
const maxDepth = 5;

iterativeDeepeningDFS(startNode, targetNode, maxDepth); 