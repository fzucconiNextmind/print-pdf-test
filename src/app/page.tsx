import GeneratePdfButton from "@/components/GeneratePdfButton";
import LineChartComponent from "@/components/LineChartComponent";
import PdfContainerComponet from "@/components/PdfContainerComponet";
import PieChartComponet from "@/components/PieChartComponent";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center ">
        <h3 className="text-2xl font-bolt self-center">Using @react-to-pdf</h3>
        <Link className="self-start" href={"/pdf-render"}>
          try with react-pdf/render
        </Link>
        <PdfContainerComponet>
          <LineChartComponent />
          <PieChartComponet />
        </PdfContainerComponet>
      </main>
    </div>
  );
}
