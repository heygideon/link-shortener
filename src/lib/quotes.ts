export const quotes = [
  "does what it says on the tin.",
  "a radically simple link shortener.",
  "smaller links for bigger smiles",
  "shortens links. what more could you want?",
  "does one job, and does it well. kinda.",
];

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};
