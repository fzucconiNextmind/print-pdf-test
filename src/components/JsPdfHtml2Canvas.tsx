"use client";
import React from "react";
import PdfPreview from "./pdfPreview.tsx/PdfPreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const JsPdfHtml2Canvas = () => {
  let doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });
  let pageIndex = 1; // Contatore delle pagine
  let tocEntries: any[] = []; // Array per salvare i riferimenti all'indice

  const addSection = async (title: string, contentSelector: string) => {
    pageIndex++; // Incrementa il numero di pagina
    // Salva il titolo con la pagina corrispondente
    tocEntries.push({ title, page: pageIndex });

    // Converte il contenuto HTML in immagine e lo aggiunge
    const element = document.querySelector(contentSelector);
    if (!!element) {
      const options = {
        windowWidth: 1000,
        scale: 2,
        margin: 0,
      };

      await html2canvas(element as HTMLElement, options).then((canvas) => {
        doc.addPage();
        // document.body.appendChild(canvas);
        const imgData = canvas.toDataURL("image/png");
        doc.setPage(pageIndex);
        doc.addImage(imgData, "PNG", 0, 0, doc.internal.pageSize.getWidth(), 0);
        doc.text(
          `${pageIndex}`,
          doc.internal.pageSize.getWidth() - 10,
          doc.internal.pageSize.getHeight() - 10
        );
      });
    }
  };

  const generatePdfIndex = async () => {
    doc.setPage(1);
    doc.text(
      `1`,
      doc.internal.pageSize.getWidth() - 10,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.setFontSize(20);
    doc.setTextColor("#000");
    doc.text("Indice", 10, 20);
    // **3. TORNA ALLA PRIMA PAGINA PER COMPILARE L'INDICE**
    tocEntries.forEach((entry, i) => {
      doc.text(
        `${entry.title} ........................ ${entry.page}`,
        10,
        30 + i * 10
      );
    });
  };

  const generatePdfHandler = async (pdfTitle: string) => {
    // **AGGIUNGI LE SEZIONI**

    doc.setFontSize(10);
    doc.setTextColor("#D3D3D3");
    await addSection("Introduzione", "#introduzione");
    await addSection("Report Grafici", "#report-grafici");
    // Then insert index at the beginning
    await generatePdfIndex();

    // **4. SALVA IL PDF**
    doc.save(`${pdfTitle}.pdf`);
    // **5. RIPRISTINA IL CONTATORE DELLE PAGINE E L'ARRAY PER L'INDICE**
    pageIndex = 1;
    tocEntries = [];
    doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });
  };

  return (
    <div>
      <PdfPreview generatePdfHandler={generatePdfHandler} />
    </div>
  );
};

export default JsPdfHtml2Canvas;
