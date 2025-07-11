def bfs_graph(graph, start_node):
    queue = []
    visited = []
    
    queue.append(start_node)
    
    while len(queue) > 0:
        current_node = queue.pop(0)
        
        if current_node not in visited:
            visited.append(current_node)
            adjacent_nodes = graph[current_node]
            
            for i in range(len(adjacent_nodes)):
                if adjacent_nodes[i] == 1 and i not in visited:
                    queue.append(i)
    
    return visited

def bfs_grid(grid, start, target=None):
    rows = len(grid)
    cols = len(grid[0])
    
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
    
    queue = [(start[0], start[1])]
    visited = set()
    visited.add((start[0], start[1]))
    
    parent = {(start[0], start[1]): None}
    
    while queue:
        current = queue.pop(0)
        row, col = current
        
        if target and (row, col) == target:
            path = []
            while current:
                path.append(current)
                current = parent[current]
            return path[::-1]
        
        for dx, dy in directions:
            new_row, new_col = row + dx, col + dy
            
            if (0 <= new_row < rows and 
                0 <= new_col < cols and 
                grid[new_row][new_col] != 1 and
                (new_row, new_col) not in visited):
                
                queue.append((new_row, new_col))
                visited.add((new_row, new_col))
                parent[(new_row, new_col)] = current
    
    return list(visited) if not target else None

graph = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 0, 1],
    [0, 0, 1, 1, 0]
]
starting_node = 4
print("Graph BFS path:", bfs_graph(graph, starting_node))

grid = [
    [0, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 0, 0, 0],
    [0, 1, 1, 0]
]
start = (0, 0)
target = (3, 3)
path = bfs_grid(grid, start, target)
print("Grid BFS path:", path)
