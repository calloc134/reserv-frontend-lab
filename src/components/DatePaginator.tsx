import { Button } from "./ui/button";

export const DatePaginator = ({
  PreviousLink,
  NextLink,
}: {
  PreviousLink: React.ComponentType<{ children: React.ReactNode }>;
  NextLink: React.ComponentType<{ children: React.ReactNode }>;
}) => {
  return (
    <>
      <PreviousLink>
        <Button variant={"secondary"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-caret-left"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#2c3e50"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 6l-6 6l6 6v-12" />
          </svg>
        </Button>
      </PreviousLink>
      <h1 className="text-3xl font-bold text-gray-800">予約一覧(週)</h1>
      <NextLink>
        <Button variant={"secondary"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-caret-right"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#2c3e50"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 18l6 -6l-6 -6v12" />
          </svg>
        </Button>
      </NextLink>
    </>
  );
};
