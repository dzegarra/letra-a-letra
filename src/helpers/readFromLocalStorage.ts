export const readFromLocalStorage = () => {
  const savedCards = localStorage.getItem("cards");
  if (savedCards) {
    return JSON.parse(savedCards);
  }
  return undefined;
};
