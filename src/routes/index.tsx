import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import EmptyDataImg from "../assets/empty_data.svg";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { constructChartData } from "@/lib/utils";

export default function IndexPage() {
  const { userId, isLoaded } = useAuth();
  const [bills, setBills] = useState<any>([]);
  const [chartData, setChartData] = useState<any>({});

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded]);

  const getAllBills = async () => {
    let { data: billData } = await supabase
      .from("bills")
      .select("*")
      .eq("user_id", userId);

    setBills(billData);
    setChartData(constructChartData(billData || []));
  };

  useEffect(() => {
    if (isLoaded && userId) {
      getAllBills();
    }
  }, [userId]);

  const EmptyData = () => {
    return (
      <div className="h-screen w-screen bg-muted flex flex-col items-center justify-center">
        {!userId && (
          <p className=" text-center text-primary font-bold text-3xl">
            EnergyWise
          </p>
        )}
        <div className="flex grow flex-col items-center justify-center">
          <div className="w-[500px] h-[500px] flex justify-center items-center">
            <img src={EmptyDataImg} alt="no-data" />
          </div>
          <div className="flex gap-4 items-center">
            <Button className="w-fit">
              <Link to="/water-bills"> Add Water Bill</Link>
            </Button>
            <Button className="w-fit">
              <Link to="/electricity-bills"> Add Electricity Bill</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const chartConfig = {
    water: {
      label: "Water",
      color: "hsl(var(--chart-1))",
    },
    electricity: {
      label: "Electricty",
      color: "hsl(var(--chart-2))",
    },
  };

  const Chart = () => {
    return (
      <Card className="m-10 h-fit">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>January - Dec 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[500px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: any) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="water" fill="var(--color-water)" radius={4} />
              <Bar
                dataKey="electricity"
                fill="var(--color-electricity)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="w-full flex items-center justify-center  gap-4 ">
          <Button className="w-fit">
            <Link to="/water-bills"> Add Water Bill</Link>
          </Button>
          <Button className="w-fit">
            <Link to="/electricity-bills"> Add Electricity Bill</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return <div>{bills && bills.length > 0 ? <Chart /> : <EmptyData />}</div>;
}
