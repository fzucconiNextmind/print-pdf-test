"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import Link from "next/link";
//import html2pdf from "html2pdf.js";
import { barOptions, lineOptions, options } from "@/utils/chartsOptions";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import exporting from "highcharts/modules/exporting";
import exportData from "highcharts/modules/export-data";
import { svgToDataURI } from "@/helpers/svgHelper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function JsPdf() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [svgList, setSvgList] = useState<any[]>([]);

  if (typeof Highcharts === "object") {
    exporting(Highcharts);
    exportData(Highcharts);
  }
  const pieChartComponentRef = useRef<{
    chart: Highcharts.Chart;
    container: React.RefObject<HTMLDivElement>;
  }>(null);
  const lineChartComponentRef = useRef<{
    chart: Highcharts.Chart;
    container: React.RefObject<HTMLDivElement>;
  }>(null);
  const barChartComponentRef = useRef<{
    chart: Highcharts.Chart;
    container: React.RefObject<HTMLDivElement>;
  }>(null);

  useEffect(() => {
    if (
      !!pieChartComponentRef?.current &&
      !!barChartComponentRef?.current &&
      !!lineChartComponentRef?.current
    ) {
      const pieStringSvg = pieChartComponentRef?.current?.chart.getSVG();
      const lineStringSvg = lineChartComponentRef?.current?.chart.getSVG();
      const barStringSvg = barChartComponentRef?.current?.chart.getSVG();

      Promise.all([
        svgToDataURI(
          pieStringSvg,
          pieChartComponentRef?.current?.chart?.chartWidth,
          pieChartComponentRef?.current?.chart?.chartHeight
        ),
        svgToDataURI(
          lineStringSvg,
          lineChartComponentRef?.current?.chart?.chartWidth,
          lineChartComponentRef?.current?.chart?.chartHeight
        ),
        svgToDataURI(
          barStringSvg,
          barChartComponentRef?.current?.chart?.chartWidth,
          barChartComponentRef?.current?.chart?.chartHeight
        ),
      ]).then((res: any) => {
        setSvgList([...res]);
      });
    }
  }, [pieChartComponentRef, lineChartComponentRef]);

  const convertToPdf = async (title: string) => {
    // Dynamically load libraries
    const html2pdf = (await import("html2pdf.js")).default;

    const options = {
      filename: `${title}.pdf`,
      margin: 3,
      html2canvas: {
        windowWidth: 1000,
      },
    };

    html2pdf().set(options).from(pdfRef.current).save();
  };

  return (
    <div className="sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8">
        <h3 className="text-2xl font-bolt self-center">
          Highcharts Pdf Generator Demo with: jsPDF
        </h3>
        <div className="flex justify-between">
          <Link className="self-start" href={"/"}>
            try with react-to-pdf
          </Link>
          <button
            onClick={() => convertToPdf("test")}
            className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md w-fit"
          >
            download PDF
          </button>
        </div>

        <div ref={pdfRef} className="bg-white">
          <div className="p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Chart Analysis Report</h1>
            <p className="text-gray-700 mb-6">
              This report presents a comprehensive visualization of data using
              various chart types including pie charts, line charts, and bar
              charts. Each visualization offers unique insights into the
              underlying data patterns and trends.
            </p>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            {svgList.map((svg, index) => (
              <img className="aspect-square" key={index} src={svg} alt="svg" />
            ))}
          </div>
        </div>

        <div className="hidden">
          <HighchartsReact
            ref={pieChartComponentRef}
            highcharts={Highcharts}
            options={options}
          />
          <HighchartsReact
            ref={lineChartComponentRef}
            highcharts={Highcharts}
            options={lineOptions}
          />
          <HighchartsReact
            ref={barChartComponentRef}
            highcharts={Highcharts}
            options={barOptions}
          />
        </div>
      </div>
    </div>
  );
}
