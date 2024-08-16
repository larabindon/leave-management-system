import { configureStore } from "@reduxjs/toolkit";
import { UserObj } from "../types";
import { leaveSlice } from "./leave";
import { useDispatch, useSelector } from "react-redux";

export const Users: Array<UserObj> = [
  { id: 1, FirstName: "Beau", LastName: "Morse" },
  { id: 2, FirstName: "Karyn", LastName: "Mcknight" },
  { id: 3, FirstName: "Colt", LastName: "Weeks" },
  { id: 4, FirstName: "Garrett", LastName: "Campos" },
  { id: 5, FirstName: "Yael", LastName: "Ortiz" },
  { id: 6, FirstName: "Beatrice", LastName: "Kerr" },
  { id: 7, FirstName: "Bruce", LastName: "Austin" },
  { id: 8, FirstName: "Cheyenne", LastName: "Anderson" },
  { id: 9, FirstName: "Ursula", LastName: "Mcknight" },
  { id: 10, FirstName: "Laura", LastName: "Wright" },
];

export const reduxStore = configureStore({
  reducer: {
    leave: leaveSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
