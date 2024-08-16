import dayjs, { Dayjs } from "dayjs";
import { CreateLeaveObj, ErrorObj, LeaveObj } from "../types";

export function getNDays(StartDate: Dayjs, EndDate: Dayjs) {
  let hours = EndDate.diff(StartDate, "hours");
  const days = Math.floor(hours / 24);
  hours = hours - days * 24;
  return Math.round((days + hours / 10 + Number.EPSILON) * 100) / 100;
}

//Validate form, this function is used on submit
export function validateForm(
  formData: CreateLeaveObj | LeaveObj,
  nDays: number,
  setError: React.Dispatch<React.SetStateAction<ErrorObj[] | undefined>>,
  type: "create" | "update"
) {
  const errors: ErrorObj[] = [];

  //Start date validation, add error if start date does not exist or if start date is before todays date
  if (!dayjs(formData.StartDate).isValid()) {
    errors.push({
      field: "StartDate",
      message: "Please enter a start date.",
    });
  } else if (type === "create" && dayjs(formData.StartDate).isBefore(dayjs())) {
    errors.push({
      field: "StartDate",
      message: "Please enter a start date after todays date.",
    });
  }

  //End date validation, add error if end date does not exist or if end date is before start date
  if (!dayjs(formData.EndDate).isValid()) {
    errors.push({
      field: "EndDate",
      message: "Please enter an end date.",
    });
  } else if (dayjs(formData.EndDate).isBefore(dayjs(formData.StartDate))) {
    errors.push({
      field: "EndDate",
      message: "Please enter an end date after the start date.",
    });
  }

  //Reason validation, add error if reason is undefined
  if (!formData.Reason) {
    errors.push({
      field: "Reason",
      message: "Please enter a reason.",
    });
  }

  //Number of days validation, add error if number of days equals 0
  if (formData.StartDate && formData.EndDate && nDays === 0) {
    errors.push({
      field: "StartDate",
      message: "Number of days cannot be 0",
    });
    errors.push({
      field: "EndDate",
      message: "Number of days cannot be 0",
    });
  }

  if (!formData.LeaveType) {
    errors.push({
      field: "LeaveType",
      message: "Please enter a leave type.",
    });
  }

  if (!formData.user) {
    errors.push({
      field: "user",
      message: "Please assign a user.",
    });
  }

  setError(errors);

  if (errors.length > 0) {
    return false;
  } else {
    return true;
  }
}
