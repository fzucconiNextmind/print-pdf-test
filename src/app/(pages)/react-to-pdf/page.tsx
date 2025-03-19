import LineChartComponent from "@/components/LineChartComponent";
import PdfContainerComponet from "@/components/PdfContainerComponet";
import PieChartComponet from "@/components/PieChartComponent";
import Link from "next/link";

export default function ReactToPdf() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8 row-start-2 items-center ">
        <Link className="self-start" href={"/"}>
          Home
        </Link>
        <PdfContainerComponet>
          <LineChartComponent />
          <PieChartComponet />
        </PdfContainerComponet>
      </div>
    </div>
  );
}
