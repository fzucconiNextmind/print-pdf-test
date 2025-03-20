"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import Link from "next/link";
//import html2pdf from "html2pdf.js";
import { barOptions, lineOptions, options } from "@/utils/chartsOptions";

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
      margin: 10,
      html2canvas: {
        windowWidth: 1000,
        scale: 2,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },

      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        before: ".page-break",
      },
    };

    //html2pdf().set(options).from(pdfRef.current).save();

    html2pdf()
      .set(options)
      .from(pdfRef.current)
      .toPdf()
      .get("pdf")
      .then(function (pdf: any) {
        const pageTitles = ["", "Cover Page", "Index", "Charts"];
        pdf.insertPage(1);
        pdf.setFontSize(22);
        pdf.text("Cover Page", pdf.internal.pageSize.getWidth() / 2.5, 10);
        var imgData =
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCsRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgExAAIAAAAgAAAAWodpAAQAAAABAAAAegAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgV2luZG93cwAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAAD/4QruaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYyOERCQkYzMjQwODExRTc5QkZEOUI0RUIwREJBOUQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYyOERCQkY0MjQwODExRTc5QkZEOUI0RUIwREJBOUQ1IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE0IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0iN0M1QzRFNEY2RTlDOTBBNjlBRjYxRUEwQzg4OTE4NzIiIHN0UmVmOmRvY3VtZW50SUQ9IjdDNUM0RTRGNkU5QzkwQTY5QUY2MUVBMEM4ODkxODcyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz4A/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIADAAMAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDABALCwsMCxAMDBAXDw0PFxsUEBAUGx8XFxcXFx8eFxoaGhoXHh4jJSclIx4vLzMzLy9AQEBAQEBAQEBAQEBAQED/2wBDAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/3QAEAAP/2gAMAwEAAhEDEQA/AO/oJA6nFQXt5HZ27TSHpwo9Segrk3li1K4aS9nxHuwqs+0H/ZVc4x71nOqoyUd5Ppe2h1YfCyqqU23CEeqXM2+yWh2eRjNQWcssyPLJtEbuTAACD5YwFLEk5JwT9CK5mS125FpezwAjbt3l0IPs+f0rEk8QaxZM9r9obdEdquOOF6HBBBBHtQ6lt0/kXHAud+SpF26STT/U9Ipa5Xw34ta/mWxvwBO/+qmXgOeu1l7H0xwfaupq4yTV0c1WlOlJwmrNfc13R//Q0vGl48dzZ24Py4dyB3PCj9M1y13dAqVU54A/rXWeMLbdNBNjjaVz6HP/ANeuOljCucCuWrR5qnNfse5gayjh4xS1Sf5sE1W7jTYj/KOmeT+pqr57s7SMd0jclj1qUxrj0FNCKF6DmqUH32NW0tUtXuS2srNMkij97CVeMj1Rgw/lXriNuRW9QD+fNeZ6HZCe6RUXlmC59ief0r00AAADoOK2irI8rHSTml2TP//R7PVbEXto0YGXX5k+vp+NedarF5EhBGDnp0r1E5xx1rmNb8KXeqT+ctxFGT1yjcn1+VhUyV9tzrwmIVNtT+Hf5nCs+eneotx3Y/Supb4f6pxtuoGx6hx/U1JbeAL1ZVknuYSoOSoVzn8S1Qoz8vvO2WOoW05vuNTwhpflWy3sg5cfu/x6t/hXS1m2elz25XNyxC4+UdMDtzWlWtrHlVZuc3J9T//Z";
        pdf.addImage(
          imgData,
          "JPEG",
          pdf.internal.pageSize.getWidth() / 2,
          pdf.internal.pageSize.getHeight() / 2,
          12.5,
          12.5
        );
        pdf.insertPage(2);
        pdf.setPage(2);
        pdf.setFontSize(22);
        pdf.text("Index", pdf.internal.pageSize.getWidth() / 2.3, 10);

        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(2);
          pdf.setFontSize(12);
          pdf.text(`Page ${i} - ${pageTitles[i]}`, 20, 20 + i * 10);
        }
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(100);
          pdf.text(
            "Page " + i + " of " + totalPages,
            pdf.internal.pageSize.getWidth() / 2.3,
            pdf.internal.pageSize.getHeight() - 10
          );
          pdf.line(
            10,
            pdf.internal.pageSize.getHeight() - 20,
            pdf.internal.pageSize.getWidth() - 10,
            pdf.internal.pageSize.getHeight() - 20
          );
          /*   pdf.createAnnotation({
            type: "text",
            title: "note",
            bounds: {
              x: 10,
              y: 10,
              w: 200,
              h: 80,
            },
            contents: "This is text annotation (closed by default)",
            open: false,
          }); */
        }
      })
      .save();
  };

  return (
    <div className="sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8">
        <h3 className="text-2xl font-bolt self-center">
          Highcharts Pdf Generator Demo with: Html2Pdf
        </h3>
        <div className="flex justify-between">
          <Link className="self-start" href={"/"}>
            Home
          </Link>
          <button
            onClick={() => convertToPdf("test")}
            className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md w-fit"
          >
            download PDF
          </button>
        </div>

        <div className="bg-white max-w-[800px] mx-auto shadow-lg rounded-lg transform scale-90 origin-top  min-h-[1123px] w-full aspect-[1/1.4142] ">
          <div ref={pdfRef}>
            <div className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Chart Analysis Report</h1>
              <p className="text-gray-700 mb-6">
                This report presents a comprehensive visualization of data using
                various chart types including pie charts, line charts, and bar
                charts. Each visualization offers unique insights into the
                underlying data patterns and trends.
              </p>
            </div>

            <div className="grid grid-cols-2  gap-8 p-8 ">
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
  );
}
