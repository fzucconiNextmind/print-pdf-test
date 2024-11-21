"use client";
import { usePDF } from "react-to-pdf";

import React, { ReactNode } from "react";
import GeneratePdfButton from "./GeneratePdfButton";

interface Props {
  readonly children: ReactNode;
}

const PdfContainerComponet = ({ children }: Props) => {
  const { toPDF, targetRef } = usePDF({ filename: "test.pdf" });

  return (
    <>
      <GeneratePdfButton onClick={() => toPDF()} />
      <div ref={targetRef}>{children}</div>
    </>
  );
};

export default PdfContainerComponet;
