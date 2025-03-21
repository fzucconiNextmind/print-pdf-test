const HeaderComponent = () => {
  return (
    <div
      id="pdf-header"
      className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear tracking-wide shadow-[0_24px_32px_-10px_rgba(0,255,0,0.4),0_-10px_0px_0px_rgba(0,255,0,0)]"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">Highcharts Pdf Generator Demo</h1>
      </div>
    </div>
  );
};

export default HeaderComponent;
