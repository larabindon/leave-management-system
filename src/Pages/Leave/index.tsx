import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

import { ErrorObj, LeaveObj, LeaveType } from "../../types";
import { useAppDispatch, useAppSelector, Users } from "../../redux";
import { leaveSlice } from "../../redux/leave";
import { getNDays, validateForm } from "../../functions";
import { Button } from "../../Components/Button";

export const Leave = () => {
  const navigate = useNavigate();
  const { leaveid } = useParams();

  //Get the selected leave object
  const leave = useAppSelector((state) =>
    state.leave.find((leave) => leave.id === parseInt(leaveid!))
  );
  const dispatch = useAppDispatch();

  //Create new data object for edited leave
  const [data, setData] = useState<
    { StartDate: Dayjs; EndDate: Dayjs } | undefined
  >(undefined);

  //State error object, when form is submitted if there are errors they are added to this state value.
  const [error, setError] = useState<ErrorObj[] | undefined>(undefined);

  useEffect(() => {
    if (leave) setData({ StartDate: leave.StartDate, EndDate: leave.EndDate });
  }, [leave]);

  //Number of leave days variable, this is updated when data is updated in a useEffect.
  const [nDays, setNDays] = useState(0);

  useEffect(() => {
    //If start date and end date values are not null, set the number of leave days.
    if (data && data.StartDate && data.EndDate) {
      setNDays(getNDays(data.StartDate, data.EndDate));
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="px-6 py-4 bg-white rounded-lg shadow-sm mt-12 w-3/4">
        <div className="py-5">
          <h3>#{leave?.id} Leave detail</h3>
          <h5>Edit the leave request below.</h5>
        </div>
        <form
          className="grid grid-cols-3 gap-2 gap-y-5 mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (leave) {
              const formData: LeaveObj = { ...leave };
              // Get all inputs in the form
              const inputs = event.currentTarget.getElementsByTagName("input");

              Array.from(inputs).forEach((input) => {
                if (formData)
                  switch (input.name) {
                    case "user": {
                      // Need to manually parseInt for user value. This is because material ui has
                      // issues with input types and defaults to string. Here I want to save the user id
                      formData.user = Users.find(
                        (user) => user.id === parseInt(input.value)
                      )!;
                      break;
                    }
                    case "StartDate": {
                      // When getting input value from start and end date, material ui input type is a string. When
                      // passed to dayjs this is an invalid date object. Need to pass the state data dates rather than input
                      // dates to formData.
                      if (data) formData.StartDate = data.StartDate;
                      break;
                    }
                    case "EndDate": {
                      if (data) formData.EndDate = data.EndDate;
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
              });

              //If form is valid, dispatch create leave action then handle close
              if (
                formData &&
                validateForm(formData, nDays, setError, "update")
              ) {
                dispatch(leaveSlice.actions.update(formData));
              }
            }
          }}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb"
          >
            <DateTimePicker
              name="StartDate"
              label="Leave start date"
              defaultValue={leave?.StartDate}
              onChange={(value) => {
                if (value !== null && data !== undefined)
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
              defaultValue={leave?.EndDate}
              onChange={(value) => {
                if (value !== null && data !== undefined)
                  setData({ ...data, EndDate: value });
              }}
              slotProps={{
                textField: {
                  error: error?.some((error) => error.field === "EndDate"),
                  helperText: error?.find((error) => error.field === "EndDate")
                    ?.message,
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
            select
            label="Leave Type"
            defaultValue={leave?.LeaveType}
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
            select
            label="Employee"
            defaultValue={leave?.user.id}
            error={error?.some((error) => error.field === "user")}
            helperText={error?.find((error) => error.field === "user")?.message}
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
            label="Reason"
            multiline
            inputProps={{ maxLength: 50 }}
            defaultValue={leave?.Reason}
            error={error?.some((error) => error.field === "Reason")}
            helperText={
              error?.find((error) => error.field === "Reason")?.message
            }
          />
          <div className="flex gap-4 pb-4 mt-4">
            <Button
              text={"Back to leave list"}
              styleType="alt"
              functionality="back"
              onClick={() => navigate(`../`)}
            />
            <Button text="Save" styleType="default" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};
