import { ReactNode } from "react";
import * as html2pdf from "html2pdf.js";

const convertToPdf = async (content: ReactNode, title: string) => {
  // Dynamically load libraries
  // const html2pdf = (await import("html2pdf.js")).default;

  const options = {
    filename: `${title}.pdf`,
    margin: 3,
    html2canvas: {
      windowWidth: 1000,
    },
  };

  html2pdf().set(options).from(content).save();
};

export default convertToPdf;
