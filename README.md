# HashCode2019

## hashcode.ts
First approach to solve the 2019 HashCode problem.
It's a simple NodeJs script that composes the slideshow picking photos randomically, maximizing the score.

| Input | Score |
| ----- | ----- |
|   A   |   2   |
|   B   |   33  |
|   C   |  153  |
|   D   |172689 |
|   E   |112813 |

Total score: 285.690



## hascodeGraph.ts
Another script that uses a graph.
Each Photo is a vertex of that graph. Every vertex is connected with each other one with an edge. The weight of that edge is calculated with the <code>calcPoint</code> function. In order to properly run Prim's algorithm, if the weight of an edge is 0, it will be changed with a constant value (the number of maximum common tags, incremented by one).

| Input | Score |
| ----- | ----- |
|   A   |   2   |
|   B   |   -   |
|   C   |  331  |
|   D   |   -   |
|   E   |   -   |

*Note: B,D,E tests were not run because of their complexity*

