"use client";
import React, { useEffect, useState } from "react";
import PdfPreview from "../pdfPreview.tsx/PdfPreview";
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfMake from "html-to-pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import blobStream from "blob-stream";
import { MorningstarLogo } from "@/assets/Morningstar";
import {
  //import default style
  formStyles,
  //import layout helpers
  Section,
  Row,
  //import element helpers
  TextInput,
} from "pdfmake-form-elements";

const MakePDFComponent = () => {
  const generatePdfHandler = () => {
    // Initialize pdfMake with fonts
    (pdfMake as any).vfs = pdfFonts.vfs;

    const html = document.getElementById("introduzione");
    const reportGrafici = document.getElementById("report-grafici");
    const converted = htmlToPdfMake(html?.outerHTML!);
    const convertedReportGrafici = htmlToPdfMake(reportGrafici?.innerHTML!);

    //fix svg width
    const fixSVGWidth = (nodes: any) => {
      nodes?.stack?.map((node: any) => {
        if (node.svg) {
          node.width = 150;
          // node.heigth = 0;
        }
        fixSVGWidth(node);
      });
    };

    const mapContent = (content: any) => {
      const mappedContent = (content as any[]).map((node: any, id: number) => {
        node.stack[0].tocItem = true;
        fixSVGWidth(node);
        return content.length === 1
          ? { ...node, pageBreak: "after" }
          : { ...node };
      });

      if (content.length === 1) {
        return mappedContent[0];
      } else {
        return {
          width: "*",
          alignment: "justify",
          columns: [...mappedContent],
        };
      }
    };

    const mappedConverted = mapContent(converted);
    const mappedconvertedReportGrafici = mapContent(convertedReportGrafici);

    const charsContent = [
      {
        stack: [
          {
            text: "Report Grafici",
            style: "header",
            alignment: "center",
            tocItem: true,
          },
          mappedconvertedReportGrafici,
        ],
      },
    ];

    // Create content array with dynamic index
    const content = [
      {
        stack: [
          {
            text: "Sample",
            style: "header",
            margin: [0, 100, 0, 0],
          },
          {
            text: new Date().toLocaleDateString(),
            fontSize: 12,
            color: "#ADADAD",
            margin: [0, 10, 0, 50],
          },
        ],
      },
      {
        pageBreak: "after",
        stack: [
          Section([
            Row([
              TextInput("Prepared for", "Insert name here"),
              TextInput("Prepared by", "Insert name here"),
            ]),
          ]),
        ],
      },
      {
        toc: {
          title: { text: "INDEX", style: "header" },
        },
        pageBreak: "after",
      },

      {
        text: "This is a header",
        style: "header",
        pageBreak: "after",
        tocItem: true,
      },

      // Main content
      mappedConverted,
      charsContent,
    ];

    const docDefinition: TDocumentDefinitions = {
      pageMargins: [40, 60, 40, 100],
      header: function (currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element

        return [
          {
            text: `Report as of ${new Date().toLocaleDateString()}`,
            alignment: "left",
            margin: [40, 10, 0, 0],
            style: "pageHeader",
          },

          {
            canvas: [
              {
                type: "line",
                x1: 40,
                y1: 10,
                x2: pageSize.width - 40,
                y2: 10,
                lineWidth: 0.5,
              },
            ],
          },
        ];
      },
      footer: function (currentPage, pageCount, pageSize) {
        return [
          {
            canvas: [
              {
                type: "line",
                x1: 40,
                y1: 10,
                x2: pageSize.width - 40,
                y2: 10,
                lineWidth: 0.5,
              },
            ],
          },
          {
            height: 200,
            margin: [40, 10, 40, 10],
            fontSize: 5,
            columnGap: 8,
            columns: [
              {
                text: "Morningstar UK Limited. All Rights Reserved. Legal Information: The information, data, analyses and opinions contained herein (1) include the confidential and proprietary information of Morningstar UK Limited (2) may not be copied or redistributed, (3) do not constitute investment advice offered by Morningstar UK Limited, (4) are provided solely for informational purposes (5) are not warranted to be correct, complete, accurate or timely and the date of data published may vary from fund to fund . Morningstar UK Limited shall not be responsible for any trading decisions, damages or other losses resulting from, or related to, this information, data, analyses or opinions or their use and that the information must not be relied upon by you the user without appropriate verification. Morningstar UK Limited informs you as follows: (i) no investment decision should be made in relation to any of the information provided other than on the advice of a professional financial advisor; (ii) past performance is no guarantee of future results; and (iii) the value and income derived from investments can go down as well as up.",
                alignment: "justify",
                width: "80%",
              },
              {
                width: "20%",
                stack: [
                  {
                    svg: MorningstarLogo,
                    width: 100,
                    height: 0,
                  },
                  {
                    text: `${currentPage}`,
                    alignment: "right",
                    fontSize: 8,
                    margin: [0, 10, 0, 0],
                    color: "#ADADAD",
                  },
                ],
              },
            ],
          },
        ];
      },
      content: content as Content[],
      styles: {
        ...formStyles,
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        pageHeader: {
          fontSize: 10,
          color: "#DEDEDE",
        },
      },
    };
    const tableLayouts = {
      exampleLayout: {
        hLineWidth: function (i: number, node: any) {
          return 1;
        },
        vLineWidth: function (i: number) {
          return 0;
        },
        hLineColor: function (i: number) {
          return "red";
        },
      },
    };
    // Use client-side PDF generation
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    const doc = pdfDocGenerator.getStream();
    const stream = doc.pipe(blobStream());

    doc.end();
    stream.on("finish", function () {
      window.open(stream.toBlobURL("application/pdf"));
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-xl">@pdfmake Generator</h4>
      <div className="flex flex-col gap-2">
        <PdfPreview generatePdfHandler={generatePdfHandler} />
      </div>
    </div>
  );
};

export default MakePDFComponent;
