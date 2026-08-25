# Connect 4: Minimax AI

A browser based Connect 4 game where you play against an AI opponent powered by the minimax algorithm.

## Features

* Classic 6 row by 7 column Connect 4 board
* Play against an AI that uses minimax with a scoring heuristic
* Three difficulty levels (Easy, Medium, Hard) that change how many moves ahead the AI searches
* Score tracking across games, with a reset option
* Win detection for horizontal, vertical, and both diagonal directions
* Winning pieces are highlighted when a game ends
* Dark theme UI with an active player indicator

## Tech Stack

* HTML for page structure
* CSS for styling, layout, and animations
* JavaScript for game logic and the minimax AI
* Google Fonts (Roboto)

## Getting Started

No setup or dependencies are needed.

1. Clone the repo

```bash
git clone https://github.com/EliasMarteCortes/Connect-4.git
cd Connect-4
```

2. Open index.html in your browser to play

## Project Files

```
Connect-4/
  index.html    page structure
  connect4.css  styling
  connect4.js   game logic and minimax AI
  README.md
```

## How It Works

* The board is stored as a 6 by 7 grid, where 0 means empty, 1 means a player piece, and 2 means an AI piece
* checkWinner scans the board for four in a row in any direction to detect a win
* scoreBoard rates a board position for the AI by checking windows of four cells at a time and giving points for pieces that are grouped together, with extra weight for the center column
* minimax looks ahead a set number of moves (based on the chosen difficulty) to pick the AI move that leads to the best outcome, assuming the player also plays to win
* Difficulty is controlled by search depth. Easy searches 3 moves ahead, Medium searches 5, and Hard searches 7

## Ideas for Later

* Add alpha beta pruning to speed up the AI at higher depths
* Add a way to play against another person instead of the AI
* Animate pieces dropping into place instead of fading in
* Save scores with localStorage so they stay after a refresh

## License

This project uses the MIT License.
