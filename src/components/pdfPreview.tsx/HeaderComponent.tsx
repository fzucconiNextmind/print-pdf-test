const HeaderComponent = () => {
  return (
    <div
      id="pdf-header"
      className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear tracking-wide"
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium text-blue-500">NextMind</h1>
      </div>
    </div>
  );
};

export default HeaderComponent;
