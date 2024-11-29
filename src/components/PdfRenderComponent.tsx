"use client";
import React, { useEffect, useRef, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import exporting from "highcharts/modules/exporting.js";
import exportData from "highcharts/modules/export-data.js";
import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },

  image: {
    marginVertical: 15,
    paddingHorizontal: 5,
    width: "50%",
  },

  view: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});

interface Props {
  isPreview: boolean;
}

const PdfRenderComponent = ({ isPreview }: Props) => {
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

  const ChartsDocument = () => {
    // Use DOMParser to parse new svg element from svgString
    return (
      <Document>
        <Page style={styles.body}>
          <View>
            <Text style={styles.title}> This is a Pdf sample </Text>
            <View style={styles.view}>
              {svgList.map((chart, id) => {
                return <Image style={styles.image} key={id} src={chart} />;
              })}
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  return !isPreview ? (
    <div className="grid md:grid-cols-2 grid-cols-1  gap-4">
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
    <>
      <PDFDownloadLink
        className="w-fit p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md"
        target="_blank"
        download={false}
        document={<ChartsDocument />}
      >
        Download
      </PDFDownloadLink>
      <div className="h-screen">
        <PDFViewer width={"100%"} height={"100%"}>
          <ChartsDocument />
        </PDFViewer>
      </div>
    </>
  );
};

{
  /*      <PDFDownloadLink
    document={<ChartsDocument />}
    className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md w-fit"
  >
    download PDF
  </PDFDownloadLink> */
}
export default PdfRenderComponent;
