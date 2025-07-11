function iddfs(graph, start, max, stop) {
    const stack = [[start, 0]];
    const visited = [];

    while (stack.length > 0) {
        const item = stack.pop();
        const node = item[0];
        const depth = item[1];

        if (depth > max) {
            continue;
        }

        if(visited.indexOf(node) === -1) {
            visited.push(node);
            if(node === stop) {
                break;
            }
        }

        let next = graph[node];
        for (var i = 0; i < next.length; i++) {
            let next = next[i];
            if (visited.indexOf(next) === -1) {
                stack.push([next, depth + 1]);
            }
        }
    }
}

iddfs({
    a: ['b', 'c'],
    b: ['d'],
    c: ['e'],
    d: [],
    e: []
})