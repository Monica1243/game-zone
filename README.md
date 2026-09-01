<p align="center">
  <img src="assets/icon/game_zone_logo.svg" alt="Game Zone — Play Without Limits" width="320">
</p>

# Game Zone

Game Zone is a responsive browser-game hub built with HTML, CSS, and vanilla JavaScript. The game presents seven classic games through a searchable, filterable catalog.


## Getting Started

No package installation or build command is required.

### 1. Download or clone the project

```bash
git clone <repository-url>
cd game-zone
```

### 2. Start a local web server
Use a VS Code-compatible Live Server extension or any other static HTTP server.

## Adding or Implementing a Game

1. Create or open its directory under `games/`.
2. Build the game in:
   - `index.html` for structure
   - `styles.css` for game-specific styling
   - `game.js` for game logic
3. Add a thumbnail under `assets/images/`.
4. Add or update the corresponding object in `data/games.json`.
5. Set `url` to the implemented game page.
6. Test the game and homepage through a local HTTP server.

Cards are generated automatically; you do not need to add card markup to the root `index.html`.
