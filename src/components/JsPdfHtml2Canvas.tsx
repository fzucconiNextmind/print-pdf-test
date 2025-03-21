"use client";
import React from "react";
import PdfPreview from "./pdfPreview.tsx/PdfPreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const JsPdfHtml2Canvas = () => {
  const doc = new jsPDF("p", "mm", "a4");
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
      };

      await html2canvas(element as HTMLElement, options).then((canvas) => {
        // document.body.appendChild(canvas);
        const imgData = canvas.toDataURL("image/png");
        doc.addPage();
        doc.setPage(pageIndex);
        doc.addImage(imgData, "PNG", 10, 20, 180, 0);
        //if (pageIndex > 1) doc.addPage();
      });
    }
  };

  const generatePdfHandler = async (pdfTitle: string) => {
    // **AGGIUNGI LE SEZIONI**
    await addSection("Introduzione", "#introduzione");
    await addSection("Report Grafici", "#report-grafici");

    // Then insert index at the beginning
    doc.setPage(1);
    doc.text("Indice", 10, 20);
    // **3. TORNA ALLA PRIMA PAGINA PER COMPILARE L'INDICE**
    doc.setPage(1);
    tocEntries.forEach((entry, i) => {
      doc.text(
        `${entry.title} ........................ ${entry.page}`,
        10,
        30 + i * 10
      );
    });

    // **4. SALVA IL PDF**
    doc.save(`${pdfTitle}.pdf`);
  };

  return (
    <div>
      <PdfPreview generatePdfHandler={generatePdfHandler} />
    </div>
  );
};

export default JsPdfHtml2Canvas;
