# The Harvest Game: A Prisoner's Dilemma Tournament

This is a classroom-friendly simulation of Robert Axelrod's Prisoner's Dilemma tournament. Players become village neighbors deciding whether to SHARE or HOG resources across multiple rounds, and the app visualizes outcomes, rankings, and match-by-match dynamics.

I made this game primarily using Google AI Studio with minor manual changes. The artwork of the game is is inspired by Stardew Valley.

## How The Simulation Works

Each neighbor (participant) has a strategy with four decision points:

- First round behavior
- Response if opponent HOGS
- Response if opponent SHARES
- Final round behavior

Students can choose one of the following options for each decision point:

- SHARE (cooperate)
- HOG (defect)
- RANDOM

Matches are played as a round-robin tournament. Every pair of participants plays for a set number of rounds. Scores are computed using a scoring matrix (defaults below), and totals are aggregated into a final ranking.

Default scoring matrix:

| Your move | Opponent move | You get | Opponent gets |
| --- | --- | --- | --- |
| SHARE | SHARE | 3 | 3 |
| SHARE | HOG | 0 | 5 |
| HOG | SHARE | 5 | 0 |
| HOG | HOG | 1 | 1 |

## Getting Started

**Prerequisites:** Node.js (18+ recommended)

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`
3. Open the URL printed by Vite.

## Usage Guide

### 1. Create Neighbors

- Enter a name.
- Pick an avatar.
- Choose four strategy settings (start, reaction to HOG, reaction to SHARE, final move).
- Click the add button to place them into the village.

### 2. Configure Tournament

- Choose number of rounds per match.
- Adjust the scoring matrix if you want to explore alternate incentives.

### 3. Run The Tournament

- Start the simulation to see match-by-match animations.
- Review the final leaderboard and per-round averages.
- Open any match details to see per-round outcomes.

### 4. Save And Load Presets

- Save the current village as a preset for future classes.
- Load presets to instantly restore participants, rounds, and scoring.

## Data Persistence

The app stores participants, presets, rounds, and scoring in local storage, so refreshes and restarts keep classroom state intact.