// フェッチするための関数

const BASE_URL = "https://reserv-keion.calloc134personal.workers.dev";

export const reservFetch = async (path: string, ...args: RequestInit[]) => {
  const response = await fetch(`${BASE_URL}${path}`, ...args);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
