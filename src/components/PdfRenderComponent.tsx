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
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { svgToDataURI } from "@/helpers/svgHelper";

const options: Highcharts.Options = {
  title: {
    text: "Pie chart",
  },
  plotOptions: {
    series: {
      shadow: true,
    },
  },
  series: [
    {
      type: "pie",
      data: [1, 2, 3],
    },
  ],
};
const lineOptions: Highcharts.Options = {
  title: {
    text: "Line chart",
  },
  plotOptions: {
    series: {
      shadow: true,
    },
  },
  series: [
    {
      type: "line",
      data: [1, 2, 3],
    },
  ],
};

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
    marginHorizontal: 100,
  },
});

interface Props {
  isPreview: boolean;
}

const PdfRenderComponent = ({ isPreview }: Props) => {
  exporting(Highcharts);
  exportData(Highcharts);
  const pieChartComponentRef = useRef<{
    chart: Highcharts.Chart;
    container: React.RefObject<HTMLDivElement>;
  }>(null);
  const lineChartComponentRef = useRef<{
    chart: Highcharts.Chart;
    container: React.RefObject<HTMLDivElement>;
  }>(null);
  const [svg, setSvg] = useState<any[]>([]);

  useEffect(() => {
    if (!!pieChartComponentRef?.current && !!lineChartComponentRef?.current) {
      const pieStringSvg = pieChartComponentRef?.current?.chart.getSVG();
      const lineStringSvg = lineChartComponentRef?.current?.chart.getSVG();
      const width = pieChartComponentRef?.current?.chart?.chartWidth ?? 0;
      const height = pieChartComponentRef?.current?.chart?.chartHeight ?? 0;

      Promise.all([
        svgToDataURI(pieStringSvg, width, height),
        svgToDataURI(lineStringSvg, width, height),
      ]).then((res: any) => {
        setSvg(res);
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
            {svg.map((chart, id) => {
              return <Image style={styles.image} key={id} src={chart} />;
            })}
          </View>
        </Page>
      </Document>
    );
  };

  return !isPreview ? (
    <div className="flex gap-3 min-h-96 justify-between">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={pieChartComponentRef}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={lineOptions}
        ref={lineChartComponentRef}
      />{" "}
    </div>
  ) : (
    <PDFViewer className="h-[500px] w-full">
      <ChartsDocument />
    </PDFViewer>
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
