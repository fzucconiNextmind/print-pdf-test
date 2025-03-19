"use client";
import React, { useEffect, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting.js";
import exportData from "highcharts/modules/export-data.js";
import { Document, Page, pdfjs } from "react-pdf";
import { svgToDataURI } from "@/helpers/svgHelper";
import { barOptions, lineOptions, options } from "@/utils/chartsOptions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartsDocument from "./ChartsDocument";
import { BlobProvider } from "@react-pdf/renderer";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  isPreview: boolean;
}

const PdfRenderJsPdf = ({ isPreview }: Props) => {
  useEffect(() => {
    // Initialize PDF.js worker only on client side
    if (typeof window !== "undefined") {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }
  }, []);

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

  const chartJSRef = useRef<any>();
  const [svgList, setSvgList] = useState<any[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const chartsContainerRef = useRef<HTMLDivElement>(null);

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [-12, -19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    if (
      !!pieChartComponentRef?.current &&
      !!barChartComponentRef?.current &&
      !!lineChartComponentRef?.current &&
      !!chartJSRef?.current
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
        const chartjsSvg = chartJSRef.current?.toBase64Image();
        setSvgList([...res, chartjsSvg]);
      });
    }
  }, [pieChartComponentRef, lineChartComponentRef]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return !isPreview ? (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={pieChartComponentRef}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={lineOptions}
        ref={lineChartComponentRef}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={barOptions}
        ref={barChartComponentRef}
      />
      <div className="bg-white">
        <Bar
          ref={chartJSRef}
          options={{
            indexAxis: "y",
            scales: {
              y: {
                beginAtZero: true,
              },
              x: {
                min: -30,
                max: 30,
              },
            },
          }}
          data={data}
        />
      </div>
    </div>
  ) : (
    <div className="w-full flex justify-center">
      <BlobProvider document={<ChartsDocument svgList={svgList} />}>
        {({ blob, url, loading, error }) => (
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
            {[...Array(numPages)].map((_, index) => (
              <Page
                key={index}
                pageNumber={index + 1}
                className="bg-white max-w-[800px] mx-auto shadow-lg rounded-lg transform scale-90 origin-top border border-gray-200 min-h-[1123px] w-full aspect-[1/1.4142] "
              />
            ))}
          </Document>
        )}
      </BlobProvider>
    </div>
  );
};

export default PdfRenderJsPdf;
