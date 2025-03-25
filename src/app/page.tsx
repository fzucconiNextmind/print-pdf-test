import HeaderComponent from "@/components/pdfPreview.tsx/HeaderComponent";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center ">
        <HeaderComponent />
        <Link className="self-start" href={"/react-to-pdf"}>
          try with @react-to-pdf
        </Link>
        <Link className="self-start" href={"/pdf-render"}>
          try with @react-pdf/render
        </Link>
        <Link className="self-start" href={"/html2pdf"}>
          try with @html2pdf.js
        </Link>
        <Link className="self-start" href={"/jsPdf"}>
          try with jsPDF and html2canvas
        </Link>
        <Link className="self-start" href={"/makePdf"}>
          try with @makePdf
        </Link>
      </main>
    </div>
  );
}
