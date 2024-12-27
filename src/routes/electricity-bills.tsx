import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { supabase } from "@/lib/supabase";
import { MONTH_MAP } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import moment from "moment";
import { AddWaterBillDialog } from "@/components/add-water-bill-details";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditBillDetails } from "@/components/edit-water-bill-details";

export default function ElectricityBills() {
  const { user, isLoaded } = useUser();
  const [electricityBills, setElectricityBills] = useState<any[] | null>([]);

  const getElectricityBills = async () => {
    if (isLoaded) {
      let { data: bills } = await supabase
        .from("bills")
        .select("*")
        .eq("user_id", user?.id)
        .eq("type", "ELECTRICITY");

      setElectricityBills(bills);
    }
  };

  const handleDeleteElectricityBill = async (id: any) => {
    try {
      await supabase
        .from("bills")
        .delete()
        .eq("id", id)
        .then(() => {
          getElectricityBills();
        });
    } catch (e) {}
  };

  useEffect(() => {
    getElectricityBills();
  }, [isLoaded, user]);

  return (
    <Card className="border-solid border-2 border-muted m-10">
      <CardHeader className="px-7">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Electricity Bill Tracker</CardTitle>
            <CardDescription>
              Track your electricity bills here.
            </CardDescription>
          </div>
          <AddWaterBillDialog
            user_id={user?.id}
            refetchBills={getElectricityBills}
            type="ELECTRICITY"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>KWh</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {electricityBills &&
              electricityBills.length > 0 &&
              electricityBills.map((bill, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell>
                      {moment(bill?.created_at).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell>{bill?.units}</TableCell>
                    <TableCell>{bill?.amount}</TableCell>
                    <TableCell>{MONTH_MAP[bill?.month]}</TableCell>
                    <TableCell>
                      <Badge variant={bill?.status?.toLowerCase()}>
                        {bill?.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DialogTrigger asChild>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteElectricityBill(bill.id)
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <EditBillDetails
                          billData={bill}
                          user_id={user?.id}
                          refetchBills={getElectricityBills}
                          type={"ELECTRICITY"}
                        />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
