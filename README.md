# PokéGuesser (Pokedle)

PokéGuesser is a fun, competitive Pokémon guessing game inspired by Wordle, built with Angular. Challenge yourself or your friends to guess Pokémon based on clues, play daily or endless modes, and climb the leaderboard!

## Features

- **Daily Challenge:** Guess the Pokémon of the day and compare your results with others.
- **Endless Mode:** Keep guessing Pokémon for as long as you can!
- **Challenge User:** Challenge other players, set stakes, and select generations.
- **Leaderboard:** See the top 50 players and their coin balances.
- **Account System:** Register, login, and manage your profile.
- **Real-Time Matches:** Play head-to-head matches with other users.
- **Responsive Design:** Optimized for desktop and mobile screens.

## Screenshots

![Home Screen](screenshots/home.png)
![Daily Challenge](screenshots/daily-challenge.png)
![Leaderboard](screenshots/leaderboard.png)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Angular CLI](https://angular.io/cli)
- A running backend server with WebSocket support

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/pokeguesser-frontend.git
   cd pokeguesser-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure backend endpoints:**
   - Update WebSocket and API URLs in `src/app/connection.service.ts` to match your backend deployment.

4. **Run the development server:**
   ```bash
   ng serve
   ```
   The app will be available at `http://localhost:4200`.

## Usage

- **Register/Login:** Create an account or log in to start playing.
- **Daily Challenge:** Try to guess the daily Pokémon.
- **Endless Mode:** Play unlimited guessing rounds.
- **Challenge User:** Enter a username, select generations, and set a bet to challenge another player.
- **Leaderboard:** View the top players and your ranking.

## Technologies Used

- Angular
- TypeScript
- RxJS
- Angular Material (for UI components)
- WebSockets (for real-time matches)
- Custom CSS for Pokémon-inspired styling

## Project Structure

```
src/
  app/
    home/                # Home and main menu
    daily-challenge/     # Daily challenge logic
    endless-mode/        # Endless mode logic
    leaderboard/         # Leaderboard display
    match/               # Match gameplay
    connection.service.ts# API/WebSocket service
    ...
  assets/                # Images, icons, etc.
  styles.css             # Global styles
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Credits

- Pokémon images and data © Nintendo, Game Freak, The Pokémon Company.
- Inspired by [Wordle](https://www.nytimes.com/games/wordle/index.html).

---

Enjoy playing PokéGuesser and challenge your friends to see who’s the ultimate Pokémon master!