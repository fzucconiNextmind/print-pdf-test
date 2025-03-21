"use client";
import exporting from "highcharts/modules/exporting";
import { svgToDataURI } from "@/helpers/svgHelper";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import exportData from "highcharts/modules/export-data";
import { barOptions } from "@/utils/chartsOptions";
import { lineOptions } from "@/utils/chartsOptions";
import { options } from "@/utils/chartsOptions";

interface PdfPreviewProps {
  generatePdfHandler: (pdfTitle: string) => void;
}

const PdfPreview = ({ generatePdfHandler }: PdfPreviewProps) => {
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
  return (
    <div>
      <div className="sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col gap-8">
          <div className="flex justify-end w-100">
            <button
              onClick={() => {
                generatePdfHandler("test-pdf");
              }}
              className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md w-fit"
            >
              download PDF
            </button>
          </div>

          <div className="bg-white max-w-[800px] mx-auto shadow-lg rounded-lg transform scale-90 origin-top  min-h-[1123px] w-full aspect-[1/1.4142] ">
            <div>
              <div
                id="introduzione"
                className="p-8 text-center whitespace-pre-wrap tracking-tight"
              >
                <h1 className="text-2xl font-bold mb-4">
                  Chart Analysis Report
                </h1>
                <p className="text-gray-700 mb-6">
                  {
                    "This report presents a comprehensive visualization of data using various chart types including pie charts, line charts, and bar charts. Each visualization offers unique insights into the underlying data patterns and trends."
                  }
                </p>
              </div>

              <div id="report-grafici" className="grid grid-cols-2  gap-8 p-8 ">
                {svgList.map((svg, index) => (
                  <div
                    key={index}
                    className="w-full h-auto aspect-square object-contain"
                  >
                    <img
                      className="w-full h-full"
                      key={index}
                      src={svg}
                      alt="svg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden">
            <div className="grid grid-cols-2  gap-8 p-8 bg-white max-w-[800px] mx-auto shadow-lg rounded-lg transform scale-90 origin-top border border-gray-200 min-h-[1123px] w-full aspect-[1/1.4142]">
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
      </div>
    </div>
  );
};

export default PdfPreview;
