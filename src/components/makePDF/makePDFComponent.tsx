"use client";
import React, { useState, useRef, useEffect } from "react";
import PdfPreview from "../pdfPreview.tsx/PdfPreview";
import pdfMake from "pdfmake/build/pdfmake";
import htmlToPdfMake from "html-to-pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions, Content } from "pdfmake/interfaces";
import blobStream from "blob-stream";

const MakePDFComponent = () => {
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [tocEntries, setTocEntries] = useState<
    { title: string; page: number }[]
  >([]);
  const tocEntriesRef = useRef<{ title: string; page: number }[]>([]);

  useEffect(() => {
    tocEntriesRef.current = tocEntries;
  }, [tocEntries]);

  const generatePdfHandler = () => {
    // Initialize pdfMake with fonts
    (pdfMake as any).vfs = pdfFonts.vfs;

    const html = document.getElementById("introduzione");
    const highchartsSvgs = document.querySelectorAll(
      'svg[class^="highcharts"]'
    );
    const highchartsSvgsArray = Array.from(highchartsSvgs);
    const converted = htmlToPdfMake(html?.outerHTML!);

    const mappedConverted = (converted as any[]).map((a: any) => {
      a.stack[0].tocItem = true;
      return { ...a, pageBreak: "after" };
    });

    console.log(mappedConverted);

    const convertedCharts = highchartsSvgsArray.map((svg) => ({
      svg: svg.outerHTML,
      width: 150,
    }));

    const charsContent = [
      {
        text: "Chars Report",
        style: "header",
        tocItem: true,
      },
      {
        alignment: "justify",
        columns: [...convertedCharts],
        tocItem: true,
      },
    ];

    // Create content array with dynamic index
    const content = [
      {
        toc: {
          title: { text: "INDEX", style: "header" },
        },
        pageBreak: "after",
      },
      {
        text: "This is a header",
        style: "header",
        tocItem: true,
        pageBreak: "after",
      },
      // Main content
      ...mappedConverted,
      ...charsContent,
    ];

    const docDefinition: TDocumentDefinitions = {
      content: content as Content[],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
      footer: function (currentPage, pageCount) {
        return {
          text: currentPage.toString() + " of " + pageCount,
          alignment: "center",
        };
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
      <h4 className="text-xl">@pdfMake Generator</h4>
      <div className="flex flex-col gap-2">
        <PdfPreview generatePdfHandler={generatePdfHandler} />
      </div>
    </div>
  );
};

export default MakePDFComponent;
