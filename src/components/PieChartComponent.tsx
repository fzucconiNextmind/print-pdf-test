"use client";

import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import React, { useRef } from "react";

const PieChartComponet = (props: HighchartsReact.Props) => {
  const options: Highcharts.Options = {
    title: {
      text: "Pie chart",
    },
    series: [
      {
        type: "pie",
        data: [1, 2, 3],
      },
    ],
  };
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
    />
  );
};

export default PieChartComponet;
