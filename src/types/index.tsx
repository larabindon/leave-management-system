import { Dayjs } from "dayjs";

export enum LeaveType {
  Personal = "Personal",
  Sick = "Sick",
  Vacation = "Vacation",
  Bereavement = "Bereavement",
}

export type CreateLeaveObj = {
  user: number | null;
  StartDate: Dayjs | null;
  EndDate: Dayjs | null;
  LeaveType: LeaveType | "";
  Reason: string | null;
}

export type LeaveObj = {
  id: number;
  user: UserObj;
  StartDate: Dayjs;
  EndDate: Dayjs;
  LeaveType: LeaveType;
  Reason: string;
};

export type ErrorObj = {
  field: "StartDate" | "EndDate" | "LeaveType" | "user" | "Reason";
  message: string;
}

export type UserObj = {
  id: number;
  FirstName: string;
  LastName: string;
};

export type ButtonType = "default" | "alt";
