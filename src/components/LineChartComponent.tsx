"use client";
import React, { useRef } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LineChartComponent = (props: HighchartsReact.Props) => {
  const options: Highcharts.Options = {
    title: {
      text: "Line chart",
    },
    series: [
      {
        type: "line",
        data: [1, 2, 3],
      },
    ],
  };
  const chartComponentRef = useRef<{
    chart: Highcharts.Chart;
    container: React.RefObject<HTMLDivElement>;
  }>(null);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
    />
  );
};

export default LineChartComponent;
