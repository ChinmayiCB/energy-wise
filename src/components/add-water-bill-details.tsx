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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MONTH_MAP } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export const AddWaterBillDialog = ({ user_id, refetchBills, type }: any) => {
  const [addBillDetails, setAddBillDetails] = useState<any>({});

  const handleBillSubmit = async () => {
    try {
      const { data } = await supabase
        .from("bills")
        .insert([
          {
            type: type,
            user_id,
            amount: parseFloat(addBillDetails.amount),
            status: addBillDetails.status,
            month: parseInt(addBillDetails.month),
            units: parseFloat(addBillDetails.units),
          },
        ])
        .select();

      if (data) {
        setAddBillDetails({});
        refetchBills();
      }
    } catch (e) {}
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add new {type === "WATER" ? "water" : "electricity"} bill
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="email">Month</Label>
            <Select
              onValueChange={(value) =>
                setAddBillDetails({
                  ...addBillDetails,
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
            <Label htmlFor="units">
              {type === "WATER" ? "Litres" : "Kwh"}{" "}
            </Label>
            <Input
              type="number"
              id="units"
              placeholder="Ex: 20"
              value={addBillDetails?.units}
              onChange={(e) =>
                setAddBillDetails({
                  ...addBillDetails,
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
              onChange={(e) =>
                setAddBillDetails({
                  ...addBillDetails,
                  amount: e.target.value,
                })
              }
            />
          </div>
          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) =>
                setAddBillDetails({
                  ...addBillDetails,
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
    </Dialog>
  );
};
