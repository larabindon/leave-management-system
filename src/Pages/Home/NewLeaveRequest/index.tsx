import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";

import { leaveSlice, newLeaveId } from "../../../redux/leave";
import { useAppDispatch, useAppSelector, Users } from "../../../redux";
import { CreateLeaveObj, ErrorObj, LeaveObj, LeaveType } from "../../../types";
import { getNDays, validateForm } from "../../../functions";
import { Button } from "../../../Components/Button";

import dayjs from "dayjs";
import "dayjs/locale/en-gb";

interface NewLeaveRequestProps {
  newLeaveModalOpen: boolean;
  setNewLeaveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewLeaveRequest = ({
  newLeaveModalOpen,
  setNewLeaveModalOpen,
}: NewLeaveRequestProps) => {
  const leave = useAppSelector((state) => state.leave);
  const dispatch = useAppDispatch();
  //Handle modal close, sets modal open to false, resets data state object and ndays state variable.
  const handleClose = () => {
    setNewLeaveModalOpen(false);
    setData({
      StartDate: null,
      EndDate: null,
      LeaveType: "",
      user: null,
      Reason: null,
    });
    setNDays(0);
    setError(undefined);
  };

  //State data object, this is updated as the user completes the form
  const [data, setData] = useState<CreateLeaveObj>({
    StartDate: null,
    EndDate: null,
    LeaveType: "",
    user: null,
    Reason: null,
  });

  //State error object, when form is submitted if there are errors they are added to this state value.
  const [error, setError] = useState<ErrorObj[] | undefined>(undefined);

  //Number of leave days variable, this is updated when data is updated in a useEffect.
  const [nDays, setNDays] = useState(0);

  useEffect(() => {
    //If start date and end date values are not null, set the number of leave days.
    if (data.StartDate && data.EndDate) {
      setNDays(getNDays(data.StartDate, data.EndDate));
    }
  }, [data]);

  return (
    <div>
      {/* MUI dialog */}
      <Dialog
        open={newLeaveModalOpen}
        onClose={handleClose}
        maxWidth={"md"}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            // Because we are using material ui, There are multiple targets other than inputs in the form (such as hidden inputs etc.)
            // I am unable to use new FormData(event.currentTarget) as current target returns null. Below is my work around
            const formData: CreateLeaveObj = { ...data };
            // Get all inputs in the form
            const inputs = event.currentTarget.getElementsByTagName("input");

            Array.from(inputs).forEach((input) => {
              switch (input.name) {
                case "user": {
                  // Need to manually parseInt for user value. This is because material ui has
                  // issues with input types and defaults to string. Here I want to save the user id
                  formData.user = parseInt(input.value);
                  break;
                }
                case "StartDate": {
                  // When getting input value from start and end date, material ui input type is a string. When
                  // passed to dayjs this is an invalid date object. Need to pass the state data dates rather than input
                  // dates to formData.
                  formData.StartDate = data.StartDate;
                  break;
                }
                case "EndDate": {
                  formData.EndDate = data.EndDate;
                  break;
                }
                case "LeaveType": {
                  formData.LeaveType = input.value as LeaveType;
                  break;
                }
                case "Reason": {
                  formData.Reason = input.value;
                  break;
                }
                default: {
                  break;
                }
              }
              //This was how I initially tried to set the formData object, unable to do this as input.name is throwing type errors
              // formData[input.name as keyof CreateLeaveObj] = value;
            });

            //If form is valid, dispatch create leave action then handle close
            if (validateForm(formData, nDays, setError, "create")) {
              // Create new leave object
              const newLeave: LeaveObj = {
                id: newLeaveId(leave),
                user: Users.find((user) => user.id === formData.user)!,
                StartDate: dayjs(formData.StartDate),
                EndDate: dayjs(formData.EndDate),
                LeaveType: formData.LeaveType as LeaveType,
                Reason: formData.Reason!,
              };
              dispatch(
                leaveSlice.actions.create({
                  ...newLeave,
                })
              );
              handleClose();
            }
          },
        }}
      >
        <DialogTitle>New Leave Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out the form below to add a new leave request.
          </DialogContentText>
          <div className="grid grid-cols-3 gap-2 gap-y-5 mt-6">
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <DateTimePicker
                name="StartDate"
                label="Leave start date"
                onChange={(value) => {
                  setData({ ...data, StartDate: value });
                }}
                slotProps={{
                  textField: {
                    error: error?.some((error) => error.field === "StartDate"),
                    helperText: error?.find(
                      (error) => error.field === "StartDate"
                    )?.message,
                  },
                }}
              />
              <DateTimePicker
                name="EndDate"
                label="Leave end date"
                onChange={(value) => setData({ ...data, EndDate: value })}
                slotProps={{
                  textField: {
                    error: error?.some((error) => error.field === "EndDate"),
                    helperText: error?.find(
                      (error) => error.field === "EndDate"
                    )?.message,
                  },
                }}
              />
            </LocalizationProvider>
            <div className="flex items-center mb-4">
              <p>
                Number of days: <b>{nDays}</b>
              </p>
            </div>
            <TextField
              name="LeaveType"
              id="leave-type"
              select
              label="Leave Type"
              defaultValue={""}
              onChange={(event) =>
                setData({
                  ...data,
                  LeaveType: event.target.value as LeaveType,
                })
              }
              error={error?.some((error) => error.field === "LeaveType")}
              helperText={
                error?.find((error) => error.field === "LeaveType")?.message
              }
            >
              {Object.values(LeaveType).map((option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              name="user"
              id="user"
              select
              label="Employee"
              defaultValue={""}
              onChange={(event) =>
                setData({ ...data, user: parseInt(event.target.value) })
              }
              error={error?.some((error) => error.field === "user")}
              helperText={
                error?.find((error) => error.field === "user")?.message
              }
            >
              {Users.map((user) => {
                return (
                  <MenuItem key={user.id} value={user.id}>
                    {user.FirstName + " " + user.LastName}
                  </MenuItem>
                );
              })}
            </TextField>

            <TextField
              name="Reason"
              id="leave-reason"
              label="Reason"
              inputProps={{ maxLength: 50 }}
              onChange={(event) =>
                setData({ ...data, Reason: event.target.value })
              }
              error={error?.some((error) => error.field === "Reason")}
              helperText={
                error?.find((error) => error.field === "Reason")?.message
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex gap-4 pb-4">
            <Button text="Cancel" styleType="alt" onClick={handleClose} />
            <Button text="Submit" styleType="default" type="submit" />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};
