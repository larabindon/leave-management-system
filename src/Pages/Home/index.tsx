import { useState } from "react";
import { LeaveTable } from "./LeaveTable";
import { NewLeaveRequest } from "./NewLeaveRequest";
import { Button } from "../../Components/Button";

export const Home = () => {
  const [newLeaveModalOpen, setNewLeaveModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-12">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-grey-900 py-8">
          Leave portal
        </h1>
        <div>
          <Button
            text="Add Leave Request"
            styleType="default"
            onClick={() => setNewLeaveModalOpen(true)}
          />
        </div>
      </header>

      <LeaveTable />
      <NewLeaveRequest
        newLeaveModalOpen={newLeaveModalOpen}
        setNewLeaveModalOpen={setNewLeaveModalOpen}
      />
    </div>
  );
};
