import React from "react";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const GeneratePdfButton = ({ onClick }: Props) => {
  return (
    <>
      <button
        onClick={onClick}
        className="p-3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md"
      >
        Generate pdf
      </button>
    </>
  );
};

export default GeneratePdfButton;
