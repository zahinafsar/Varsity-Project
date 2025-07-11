from typing import List, Tuple
from functools import reduce
from itertools import product

def is_possible(graph: List[List[int]], colors: List[int], vertex: int, color: int) -> bool:
    """Check if it's valid to assign the given color to the vertex."""
    return all(graph[vertex][i] == 0 or colors[i] != color for i in range(len(graph)))

def solve(graph: List[List[int]], num_colors: int, colors: List[int], vertex: int) -> List[int]:
    """Recursively solve the graph coloring problem."""
    if vertex == len(graph):
        return colors
    
    for color in range(1, num_colors + 1):
        if is_possible(graph, colors, vertex, color):
            colors[vertex] = color
            result = solve(graph, num_colors, colors.copy(), vertex + 1)
            if result:
                return result
            colors[vertex] = 0
    
    return []

def graph_color(graph: List[List[int]], num_colors: int) -> Tuple[bool, List[int]]:
    """Main function to solve the graph coloring problem."""
    colors = [0] * len(graph)
    result = solve(graph, num_colors, colors, 0)
    return bool(result), result

def display_solution(colors: List[int]) -> None:
    """Display the coloring solution."""
    text_colors = ["", "RED", "GREEN", "BLUE", "YELLOW", "ORANGE", "PINK",
                  "BLACK", "BROWN", "WHITE", "PURPLE", "VIOLET"]
    print("\nColors:", " ".join(text_colors[color] for color in colors))

def main():
    print("Graph Coloring Algorithm Test\n")
    
    # Get number of vertices
    V = int(input("Enter number of vertices\n"))
    
    # Get graph matrix
    print("\nEnter matrix\n")
    graph = [[int(x) for x in input().split()] for _ in range(V)]
    
    # Get number of colors
    num_colors = int(input("\nEnter number of colors\n"))
    
    # Solve the graph coloring problem
    success, solution = graph_color(graph, num_colors)
    
    if success:
        print("\nSolution exists")
        display_solution(solution)
    else:
        print("No solution")

if __name__ == "__main__":
    main()
