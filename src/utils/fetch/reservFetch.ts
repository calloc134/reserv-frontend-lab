// フェッチするための関数

const BASE_URL = "https://reserv-keion.calloc134personal.workers.dev";

export const reservFetch = async (path: string, ...args: RequestInit[]) => {
  const response = await fetch(`${BASE_URL}${path}`, ...args);

  return {
    data: await response.json(),
    status: response.status,
  };
};
