import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LeaveObj, LeaveType } from "../../types";
import dayjs from "dayjs";

const initialState: Array<LeaveObj> = [
  {
    id: 1,
    user: { id: 1, FirstName: "Beau", LastName: "Morse" },
    LeaveType: LeaveType.Personal,
    StartDate: dayjs(),
    EndDate: dayjs().add(4, "days"),
    Reason: "Doctors appointment",
  },
  {
    id: 2,
    user: { id: 2, FirstName: "Karyn", LastName: "Mcknight" },
    LeaveType: LeaveType.Sick,
    StartDate: dayjs(),
    EndDate: dayjs().add(1, "days"),
    Reason: "Sick day",
  },
];

export function newLeaveId(leave: Array<LeaveObj>) {
  const maxId = leave.reduce((maxId, leave) => Math.max(leave.id, maxId), -1);
  return maxId + 1;
}

export const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    create: (state, action: PayloadAction<LeaveObj>) => [
      ...state,
      action.payload,
    ],
    remove: (state, action: PayloadAction<number>) =>
      [...state].filter((leave) => leave.id !== action.payload),
    update: (state, action: PayloadAction<LeaveObj>) =>
      [...state].map((leave) =>
        leave.id === action.payload.id ? { ...leave, ...action.payload } : leave
      ),
  },
});

export const { create, update, remove } = leaveSlice.actions;

export default leaveSlice.reducer;
