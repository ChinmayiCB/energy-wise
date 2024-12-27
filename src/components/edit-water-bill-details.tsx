import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { MONTH_MAP } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export const EditBillDetails = ({
  billData,
  user_id,
  refetchBills,
  type,
}: any) => {
  const [editBillDetails, setBillDetails] = useState<any>(billData);

  const handleBillSubmit = async () => {
    try {
      const { data } = await supabase
        .from("bills")
        .update({
          type: type,
          user_id,
          amount: parseFloat(editBillDetails.amount),
          status: editBillDetails.status,
          month: parseInt(editBillDetails.month),
          units: parseFloat(editBillDetails.units),
        })
        .eq("id", billData?.id)
        .select();

      if (data) {
        setBillDetails({});
        refetchBills();
      }
    } catch (e) {}
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Edit {type === "WATER" ? "water" : "electricity"} bill
        </DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="email">Month</Label>
          <Select
            value={editBillDetails?.month?.toString()}
            onValueChange={(value) =>
              setBillDetails({
                ...editBillDetails,
                month: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>

            <SelectContent>
              {Object.values(MONTH_MAP).map((month: any, i) => {
                return (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {month}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="units">{type === "WATER" ? "Litres" : "Kwh"} </Label>
          <Input
            type="number"
            id="units"
            placeholder="Ex: 20"
            value={editBillDetails?.units}
            onChange={(e) =>
              setBillDetails({
                ...editBillDetails,
                units: e.target.value,
              })
            }
          />
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="amount">Amount</Label>
          <Input
            type="number"
            id="amount"
            placeholder="Ex: 250"
            value={editBillDetails?.amount}
            onChange={(e) =>
              setBillDetails({
                ...editBillDetails,
                amount: e.target.value,
              })
            }
          />
        </div>
        <div className="grid w-full  items-center gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            value={editBillDetails?.status?.toUpperCase()}
            onValueChange={(value) =>
              setBillDetails({
                ...editBillDetails,
                status: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Paid/Pending" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={"PAID"}>PAID</SelectItem>
              <SelectItem value={"PENDING"}>PENDING</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={handleBillSubmit}>Submit</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};
