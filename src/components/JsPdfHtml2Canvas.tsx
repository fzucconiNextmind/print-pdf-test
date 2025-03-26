"use client";
import React, { useEffect, useRef, useState } from "react";
import PdfPreview from "./pdfPreview.tsx/PdfPreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "svg2pdf.js";
import { applyPlugin } from "jspdf-autotable";

const JsPdfHtml2Canvas = () => {
  applyPlugin(jsPDF);
  const [doc, setDoc] = useState<jsPDF>(
    new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    })
  );

  const [tocEntries, setTocEntries] = useState<any[]>([]); // Array per salvare i riferimenti all'indice
  const tocEntriesRef = useRef<any[]>([]);
  useEffect(() => {
    tocEntriesRef.current = tocEntries;
  }, [tocEntries]);

  const addSection = async (title: string, contentSelector: string) => {
    // Converte il contenuto HTML in immagine e lo aggiunge
    const element = document.querySelector(contentSelector);
    if (!!element) {
      const options = {
        windowWidth: 1000,
        scale: 2,
        margin: 0,
      };

      await html2canvas(element as HTMLElement, options).then((canvas) => {
        doc?.addPage();
        const pageIndex = doc?.getCurrentPageInfo()?.pageNumber;
        // Salva il titolo con la pagina corrispondente
        setTocEntries([...tocEntriesRef.current, { title, page: pageIndex }]);
        const imgData = canvas.toDataURL("image/png");
        // doc?.setPage(pageIndex);
        doc?.addImage(
          imgData,
          "PNG",
          0,
          0,
          doc.internal.pageSize.getWidth(),
          0
        );
      });
    }
  };

  const addHtmlContent = async (contentSelector: string) => {
    // Get all elements with class names starting with 'pdf-type-'
    const pdfTypeElements = document.querySelectorAll('[class*="pdf-type-"]');
    const pdfTypeElementsArray = Array.from(pdfTypeElements);

    console.log("pdfTypeElementsArray", pdfTypeElementsArray);
    const element = document.getElementById(contentSelector) as HTMLElement;
    (doc as any)?.autoTable({
      body: [{ html: element }],
    });
    // Get the current page height in mm
    const pageHeight = doc?.internal.pageSize.height;
    // Get the current page number
    const currentPage = doc?.getNumberOfPages()!;
    // Calculate starting Y position
    const startY = currentPage === 1 ? 0 : pageHeight! * currentPage! + 10;

    doc?.addPage();
    const pageIndex = doc?.getCurrentPageInfo()?.pageNumber;
    // Salva il titolo con la pagina corrispondente
    setTocEntries([
      ...tocEntriesRef.current,
      { title: contentSelector, page: pageIndex },
    ]);
    doc?.html(element, {
      callback: async function (pdf) {
        // Get the final Y position after HTML content
        const finalY = (pdf as any).lastAutoTable?.finalY; // Add default offset if lastAutoTable is not available

        const highchartsSvgs = document.querySelectorAll(
          'svg[class^="highcharts"]'
        );
        const highchartsSvgsArray = Array.from(highchartsSvgs);

        // Get current page height and remaining space
        const pageHeight = pdf.internal.pageSize.height;
        const remainingSpace = pageHeight - finalY;
        // Check if there's enough space on current page
        if (remainingSpace >= 100) {
          // Add SVG right after the HTML content
          await pdf.svg(highchartsSvgsArray[0], {
            x: 0,
            y: finalY + 10, // Add small gap
            width: 100,
            height: 100,
          });
        } else {
          // Add new page if not enough space
          pdf.addPage();
          await pdf.svg(highchartsSvgsArray[0], {
            x: 0,
            y: 10, // Small top margin on new page
            width: 100,
            height: 100,
          });
        }

        const charts = document.getElementsByClassName("highcharts-container");
        Array.from(charts).forEach((chart) => {
          chart.removeAttribute("style");
        });
        window.open(pdf.output("bloburl"));
      },
      x: 0,
      y: startY,
      margin: [10, 0, 20, 0],
      width: 208,
      windowWidth: 786,
      autoPaging: "text",
      html2canvas: {
        logging: false,
        windowWidth: 786,
      },
    });
  };

  const generatePdfIndex = async () => {
    doc?.insertPage(1);
    doc?.setPage(1);

    doc?.setFontSize(20);
    doc?.setTextColor("#000");
    doc?.text("Indice", 10, 20);
    // **3. TORNA ALLA PRIMA PAGINA PER COMPILARE L'INDICE**

    tocEntriesRef?.current?.forEach((entry, i) => {
      doc?.text(
        `${entry.title} ........................ ${entry.page}`,
        10,
        30 + i * 10
      );
    });
    const totalPages = doc?.getNumberOfPages();
    doc?.setFontSize(10);
    doc?.setTextColor("#D3D3D3");
    for (let i = 1; i <= totalPages; i++) {
      doc?.setPage(i);
      doc?.text(
        `${i}`,
        doc?.internal.pageSize.getWidth() - 10,
        doc?.internal.pageSize.getHeight() - 10
      );
    }
  };

  const generatePdfHandler = async (pdfTitle: string) => {
    // **AGGIUNGI LE SEZIONI**

    await addHtmlContent("introduzione");

    //await generatePdfIndex();
    // **4. SALVA IL PDF**

    //doc.save(`${pdfTitle}.pdf`);

    setTocEntries([]);
    setDoc(
      new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      })
    );
    // **5. RIPRISTINA IL CONTATORE DELLE PAGINE E L'ARRAY PER L'INDICE**
  };

  return (
    <div>
      <PdfPreview generatePdfHandler={generatePdfHandler} />
    </div>
  );
};

export default JsPdfHtml2Canvas;
