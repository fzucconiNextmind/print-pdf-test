"use client";
import exporting from "highcharts/modules/exporting";
import React, { useEffect, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import exportData from "highcharts/modules/export-data";
import { barOptions } from "@/utils/chartsOptions";
import { lineOptions } from "@/utils/chartsOptions";
import { options } from "@/utils/chartsOptions";
import { svgToDataURI } from "@/helpers/svgHelper";

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
          pieChartComponentRef?.current?.container?.current?.offsetWidth!,
          pieChartComponentRef?.current?.container?.current?.offsetHeight!
        ),
        svgToDataURI(
          lineStringSvg,
          lineChartComponentRef?.current?.container?.current?.offsetWidth!,
          lineChartComponentRef?.current?.container?.current?.offsetHeight!
        ),
        svgToDataURI(
          barStringSvg,
          barChartComponentRef?.current?.container?.current?.offsetWidth!,
          barChartComponentRef?.current?.container?.current?.offsetHeight!
        ),
      ]).then((res: any) => {
        setSvgList([...res]);
      });
    }
  }, [pieChartComponentRef, lineChartComponentRef]);
  return (
    <div>
      <div className="sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col ">
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

          <div className="bg-white max-w-[1000px] mx-auto shadow-lg rounded-lg transform scale-90 origin-top  min-h-[1123px] w-full">
            <div>
              <div
                id="introduzione"
                className="p-8 text-center whitespace-pre-wrap tracking-tight pdf-type-html"
              >
                <h1 className="text-2xl font-bold mb-4">
                  Chart Analysis Report
                </h1>
                <p className="text-gray-700 mb-6">
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                  This report presents a comprehensive visualization of data
                  using various chart types including pie charts, line charts,
                  and bar charts. Each visualization offers unique insights into
                  the underlying data patterns and trends. This report presents
                  a comprehensive visualization of data using various chart
                  types including pie charts, line charts, and bar charts. Each
                  visualization offers unique insights into the underlying data
                  patterns and trends. This report presents a comprehensive
                  visualization of data using various chart types including pie
                  charts, line charts, and bar charts. Each visualization offers
                  unique insights into the underlying data patterns and trends.
                </p>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={options}
                  containerProps={{
                    className: "w-full",
                  }}
                />
              </div>

              {/*   <div  className="grid grid-cols-2 ">
                {svgList.map((chart, id) => (
                  <div key={id} className="w-full">
                    <img src={chart} alt={`Chart ${id + 1}`} className="" />
                  </div>
                ))}
              </div> */}

              <div
                id="report-grafici"
                className="grid grid-cols-2 px-6 pdf-type-image"
              >
                <HighchartsReact
                  ref={pieChartComponentRef}
                  highcharts={Highcharts}
                  options={options}
                  containerProps={{
                    className: "w-full",
                  }}
                />
                <HighchartsReact
                  ref={lineChartComponentRef}
                  highcharts={Highcharts}
                  options={lineOptions}
                  containerProps={{
                    className: "w-full ",
                  }}
                />
                <HighchartsReact
                  ref={barChartComponentRef}
                  highcharts={Highcharts}
                  options={barOptions}
                  containerProps={{
                    className: "w-full ",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
