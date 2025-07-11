// Graph Coloring Algorithm Implementation
const COLORS = {
    1: "RED",
    2: "GREEN",
    3: "BLUE",
    4: "YELLOW",
    5: "ORANGE",
    6: "PINK",
    7: "BLACK",
    8: "BROWN",
    9: "WHITE",
    10: "PURPLE",
    11: "VIOLET"
};

// Pure function to check if a color can be assigned to a vertex
const isColorPossible = (graph, colors, vertex, color) => {
    return !graph[vertex].some((edge, i) => edge === 1 && colors[i] === color);
};

// Pure function to display the solution
const displaySolution = (colors) => {
    console.log("\nColors:", colors.map(c => COLORS[c]).join(" "));
};

// Main graph coloring function using functional approach
const graphColor = (graph, numColors) => {
    const V = graph.length;
    const colors = new Array(V).fill(0);

    // Recursive function to solve the coloring problem
    const solve = (vertex) => {
        // Base case: all vertices are colored
        if (vertex === V) {
            return true;
        }

        // Try all colors for current vertex
        for (let color = 1; color <= numColors; color++) {
            if (isColorPossible(graph, colors, vertex, color)) {
                colors[vertex] = color;
                
                // Recursively color remaining vertices
                if (solve(vertex + 1)) {
                    return true;
                }
                
                // Backtrack
                colors[vertex] = 0;
            }
        }
        
        return false;
    };

    // Attempt to solve the coloring problem
    const hasSolution = solve(0);
    
    if (hasSolution) {
        console.log("\nSolution exists");
        displaySolution(colors);
    } else {
        console.log("No solution");
    }
};

// Example usage:
const exampleGraph = [
    [0, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 1, 0]
];

// Test the algorithm
console.log("Graph Coloring Algorithm Test\n");
console.log("Example graph:");
console.log(exampleGraph.map(row => row.join(" ")).join("\n"));
console.log("\nAttempting to color with 3 colors:");
graphColor(exampleGraph, 3);
