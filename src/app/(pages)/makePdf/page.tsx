import React from "react";
import Link from "next/link";
import JsPdfHtml2Canvas from "@/components/JsPdfHtml2Canvas";
import MakePDFComponent from "@/components/makePDF/makePDFComponent";

export default function MakePdf() {
  return (
    <div className="sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8">
        <h3 className="text-2xl font-bolt self-center">
          Highcharts Pdf Generator Demo with: makePdf
        </h3>
        <div className="flex justify-between">
          <Link className="self-start" href={"/"}>
            Home
          </Link>
        </div>
        <MakePDFComponent />
      </div>
    </div>
  );
}
