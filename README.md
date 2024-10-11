# 部室予約システム フロントエンド

## 概要

開発した部室予約システムのフロントエンドです。

詳細は以下からご確認ください。
[https://zenn.dev/calloc134/articles/c24167f2fb6921](https://zenn.dev/calloc134/articles/c24167f2fb6921)

## 利用技術

- React
- TypeScript
- TanStack Router
- TanStack Query
- Tailwind CSS
- shadcn ui
- react-hot-toast
- react-spinners

## ディレクトリ構成

src ディレクトリを以下の構成に分割しています。

```src
src
├── components  (コンポーネント)
├── hooks      (カスタムフック)
├── pages     (ページ)
├── routes   (ルーティング)
├── types   (型定義)
├── utils (ユーティリティ)
├── routes.tsx
└── main.tsx
```

詳細は以下のとおりです。

```
src
├── components
│   ├── CreateReservationModal.tsx (予約作成モーダル)
│   ├── DeleteReservationModal.tsx (予約削除モーダル)
│   ├── DisableReservationModal.tsx (利用禁止作成モーダル)
│   ├── DatePaginator.tsx (日付選択バー)
│   ├── HomeLayout.tsx (外枠)
│   ├── ReservationCard.tsx (予約カード)
│   ├── MyReservationCard.tsx (自分の予約カード)
│   ├── LoadingFallback.tsx (ローディング画面)
│   ├── NotFound.ts (404ページ)
│   └── ui
│       └── ... (shadcn ui のコンポーネント)
├── hooks
│   ├── react-query
│   │   └── ... (react-query のラッパー)
│   ├── useAuthAndFallback.tsx (認証状態とリダイレクト)
│   ├── useCreateReservationModal.tsx  (予約作成モーダルの状態管理)
│   └── useDeleteReservationModal.tsx (予約削除モーダルの状態管理)
│   ├── useCreateDisabledModal.tsx (利用禁止作成モーダルの状態管理)
├── pages
│   ├── AuthenticateLayoutPage.tsx (認証の外枠)
│   ├── LoginPage.tsx (ログインページ)
│   └── WeeklyReservations.tsx (週の予約一覧)
│   ├── WeeklyMyReservations.tsx (週の自分の予約一覧)
│   ├── AdminPanel.tsx (管理者ページ)
├── routes
│   ├── IndexRoute.tsx (トップのログインページ)
│   ├── HomeRoute.tsx (ホームのルート)
│   └── ReservationsRoute.tsx (予約一覧ページ)
│   ├── MyReservationsRoute.tsx (自分の予約一覧ページ)
│   ├── AdminRoute.tsx (管理者ページ)
│   ├── NotFoundRoute.tsx (404ページ)
├── types
│   └── dto (API 通信時のレスポンス型)
│       ├── ReservationResponse.ts
│       ├── ReservationResponseTransformed.ts
│       └── RoomResponse.ts
├── utils
│   ├── convert (日付と文字列の変換)
│   │   ├── convertFromDate.ts
│   │   └── convertToDate.ts
│   ├── createTables.ts
│   ├── fetch (API 通信)
│   │   ├── getAvailableRooms.ts (利用可能な部屋を取得)
│   │   └── reservFetch.ts (API通信クライアント)
│   ├── getAvailableRooms.ts (利用可能な部屋を取得)
│   ├── getMondayOfThisWeek.ts (直近の月曜日を取得)
│   ├── lengthOfUnion.ts (unionのキーの数を取得)
│   └── validateDateString.ts (日付の文字列を検証)
├── routes.tsx (ルーティング)
└── main.tsx (エントリーポイント)
```

## 気をつけている点

- ロジックと見た目の分離
  - フックにロジックを記述し  
    コンポーネントはフックの提供するデータとイベントハンドラを受け取るだけにする
- 積極的なメモ化の利用
  - 渡す関数には useCallback を利用し  
    イベントハンドラの再レンダリングを抑える
  - 同じ処理を行う場合は useMemo を利用し再計算を抑える
- ファイルの分割
  - コンポーネント、フック、ページ、ルーティング、型定義、ユーティリティなどを分割し  
     それぞれの責務を明確にする
- ページの遅延ローディング
  - TanStack Router の遅延ローディング機能を利用し  
    必要のないページをロードしないようにする
