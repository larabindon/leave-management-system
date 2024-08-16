// import { LeaveObj } from "../../types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "../../../Components/Button";
import dayjs from "dayjs";
import { useAppSelector } from "../../../redux";
import { useNavigate } from "react-router-dom";

export const LeaveTable = () => {
  const leave = useAppSelector(state => state.leave)
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "FirstName",
      headerName: "Employee",
      width: 240,
      valueGetter: (_, row) => {
        return row.user.FirstName + " " + row.user.LastName;
      },
    },
    { field: "LeaveType", headerName: "Leave Type", width: 160 },

    {
      field: "StartDate",
      headerName: "Start date",
      type: "custom",
      width: 240,
      valueGetter: (_, row) => {
        return dayjs(row.StartDate).format("DD/MM/YYYY hh:mm");
      },
    },
    {
      field: "EndDate",
      headerName: "End date",
      type: "custom",
      width: 240,
      valueGetter: (_, row) => {
        return dayjs(row.EndDate).format("DD/MM/YYYY hh:mm");
      },
    },
    {
      field: "Days",
      headerName: "Days",
      type: "number",
      width: 120,
      valueGetter: (_, row) => {
        let hours = dayjs(row.EndDate).diff(dayjs(row.StartDate), "hours");
        const days = Math.floor(hours / 24);
        hours = hours - days * 24;
        return Math.round((days + hours / 10 + Number.EPSILON) * 100) / 100;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Edit",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Button
            text="Edit"
            styleType="default"
            onClick={() => navigate(`../leave/ID/${id}`)}
          />,
        ];
      },
    },
  ];

  return (
    <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
      <div className="py-5">
        <h1 className="text-base font-semibold leading-6 text-left text-gray-800">
          Leave requests
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of all the leave requests including the employees name, leave
          type, start date, end date, number of days and edit button.
        </p>
      </div>
      <DataGrid
        rows={leave}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
};
