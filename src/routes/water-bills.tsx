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

export default function WaterBills() {
  const { user, isLoaded } = useUser();
  const [waterBills, setWaterBills] = useState<any[] | null>([]);

  const getWaterBills = async () => {
    if (isLoaded) {
      let { data: bills } = await supabase
        .from("bills")
        .select("*")
        .eq("user_id", user?.id)
        .eq("type", "WATER");

      setWaterBills(bills);
    }
  };

  const handleDeleteWaterBill = async (id: any) => {
    try {
      await supabase
        .from("bills")
        .delete()
        .eq("id", id)
        .then(() => {
          getWaterBills();
        });
    } catch (e) {}
  };

  useEffect(() => {
    getWaterBills();
  }, [isLoaded, user]);

  return (
    <Card className="border-solid border-2 border-muted m-10">
      <CardHeader className="px-7">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Water Bill Tracker</CardTitle>
            <CardDescription>Track your water bills here.</CardDescription>
          </div>
          <AddWaterBillDialog
            user_id={user?.id}
            refetchBills={getWaterBills}
            type="WATER"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Litres</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waterBills &&
              waterBills.length > 0 &&
              waterBills.map((bill, i) => {
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
                              onClick={() => handleDeleteWaterBill(bill.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <EditBillDetails
                          billData={bill}
                          user_id={user?.id}
                          refetchBills={getWaterBills}
                          type={"WATER"}
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
