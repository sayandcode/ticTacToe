# ticTacToe
Minimalist Tic Tac Toe game built using Vanilla Javascript.

## Note from the developer
I built this game before I had any knowledge of bundlers and JS frameworks. It was a good excercise in DOM Manipulation, and using SCSS to style.

One interesting thing that came out of this is that when I was looking into ways to determine a game win state, I started thinking how wasteful it was to run multiple loops to check each cell, for every move, in order to determine whether the previous move resulted in a win.

That's when I came across [this answer](https://stackoverflow.com/a/66405791/18620006) in stack overflow. It stored the state of the board in an (N+1)^2-bit variable, where N represents the number of positions in any row of the tic-tac-toe board. With inspiration from this answer, and help from [an answer to a subsequent post of my own](https://stackoverflow.com/a/71982802/18620006), I have implemented such a strategy in this web game.

Instead of running multiple loops, this app simply runs two bitwise shift operators, in order to determine whether the current board position is a win. I find that the solution suggested in [this answer](https://stackoverflow.com/a/71982802/18620006) is quite ingenious and [Trentium](https://stackoverflow.com/users/7696162/trentium) deserves the full credit to this. I had run into some trouble with storing the numbers in an ordinary JS number type(bitwise shifts were altering the 2s complelement representation, resulting in data loss), but that was solved by using BigInts, albeit at a slight performance drop at higher board sizes.

Overall I am very happy with my results, given the level of knowledge I had at that point. If I had to redo it, I would probably segment the code into separate files, move debugging tools into a need-to-use basis file, and work on improving performance at higher board sizes.

Onward and Upward.
