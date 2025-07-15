# 🔥 FIRE IT UP! - A Monte Carlo Retirement Simulator

Welcome to **FIRE IT UP!**, a web-based application designed to help you plan for Financial Independence, Retire Early (FIRE) by calculating a sustainable, inflation-adjusted annual withdrawal from your investment portfolio.

Project URL: https://fire-it-up.netlify.app/

---

## 🚀 About The Project

This tool goes beyond simple retirement calculators that use a fixed annual return. Instead, **FIRE IT UP!** uses **Monte Carlo simulations** to model market volatility and provide a probability-based forecast for your portfolio's longevity.

The primary goal is to calculate the **maximum safe annual withdrawal amount** that your portfolio can sustain, ensuring the funds last until your specified life expectancy with a high degree of confidence (e.g., a 90% success rate).

### How It Works

1.  **Input Your Data**: Define your investment assets (principal, expected return, risk level) and global settings (retirement age, life expectancy, estimated inflation).
2.  **Run the Simulation**: The app runs thousands of unique retirement simulations. In each run, annual market returns for your assets are randomized based on their specified risk profiles.
3.  **Analyze the Outcomes**: It calculates the highest possible annual withdrawal that doesn't deplete your portfolio before your target age in at least 90% of all simulated scenarios.
4.  **Visualize the Future**: The results are displayed as an interactive chart showing the median (50th percentile), best-case (90th percentile), and worst-case (10th percentile) portfolio projections over time.

---

## ✨ Features

- **Dynamic Portfolio Management**: Add, edit, and delete multiple assets.
- **Customizable Assets**: Set principal, expected annual growth rate, and a risk profile (Low, Medium, High) for each asset.
- **Global Settings**: Configure your retirement age, life expectancy, and long-term inflation rate.
- **Powerful Monte Carlo Engine**: Runs 1,000+ simulations to account for market volatility.
- **Safe Withdrawal Calculation**: Determines your sustainable, inflation-adjusted annual spending amount.
- **Interactive Projections**: Visualize your portfolio's potential future value in an easy-to-understand chart.
- **Real vs. Nominal Dollars**: Toggle the chart view between the value in "Today's Dollars" (real) and future inflated dollars (nominal).
- **Persistent State**: All your data is automatically saved to your browser's `localStorage`.
- **Responsive Design**: Fully usable on desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

This project was built using modern web technologies with a focus on a clean, maintainable, and performant frontend.

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charting**: [Recharts](https://recharts.org/)
- **State Management**: React Hooks (`useState`, `useEffect`, and custom hooks)
- **Storage**: Browser `localStorage` API

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You only need a modern web browser. No complex setup is required.

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/jawadshuaib/fire-it-up.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd fire-it-up
    ```
3.  Open the `index.html` file in your browser. For the best development experience, use a live server extension (like "Live Server" in VS Code).

---

## Structure

The project is organized into a modular component structure:

```
/
├── components/         # Reusable React components (Forms, Charts, UI elements)
├── hooks/              # Custom React hooks (e.g., usePortfolio for state management)
├── services/           # Core business logic (e.g., simulation.ts)
├── types.ts            # Shared TypeScript types and interfaces
├── constants.ts        # Global constants
├── App.tsx             # Main application component
└── index.html          # The single HTML entry point
```

---

## 👤 Author

**Jawad Shuaib**

- Website: [j4wad.com](https://j4wad.com)
- GitHub: [@jawadshuaib](https://github.com/jawadshuaib)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
