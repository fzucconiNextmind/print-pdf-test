"use client";
import React, { useState } from "react";
import PdfRenderJsPdf from "@/components/PdfRenderJsPdf";
import Link from "next/link";

export default function JsPdf() {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8">
        <h3 className="text-2xl font-bolt self-center">
          Highcharts Pdf Generator Demo with: jsPDF
        </h3>
        <div className="flex justify-between">
          <Link className="self-start" href={"/"}>
            Home
          </Link>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md w-fit"
          >
            {isPreview ? "Back" : "Generate Pdf"}
          </button>
        </div>
        <PdfRenderJsPdf isPreview={isPreview} />
      </div>
    </div>
  );
}
