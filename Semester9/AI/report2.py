graph = {"A": ["F", "B"],
         "B": ["C"],
         "C": ["D"],
         "D": ["E"],
         "F": ["G"]
}

def dfs(graph, start_node, end, max_depth):
    visited = []
    depth = {}
    stack = []
   
    stack.append(start_node)
    depth[start_node] = 0
   
    while(len(stack)>0):
        current_node = stack.pop()

        if current_node not in visited:
            visited.append(current_node)
            if current_node in graph.keys():
                adj_nodes = graph[current_node]
           
                for adj_node in adj_nodes:
                    if adj_node not in visited:
                        if depth[current_node] < max_depth:
                            depth[adj_node] = depth[current_node] + 1
                            stack.append(adj_node)
   
    print(f"Depth: {max_depth} -> {visited}")
    if end in visited:
        return 1
    else:
        return 0


depth_length = 4
start = "A"
end = "E"
not_found = 1
for i in range(depth_length):
    found = dfs(graph, start, end, i)
    if found:
        not_found = 0
        print(f"{end} node is found in depth {i}")
        break

if not_found:
    print(f"{end} node is not found in depth limit {depth_length-1}")
