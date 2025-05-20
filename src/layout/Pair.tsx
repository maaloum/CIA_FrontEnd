import { useState } from "react";

function TogglePairButton() {
  const [isPaired, setIsPaired] = useState(false);

  const togglePairing = () => {
    setIsPaired((prev) => !prev);
  };

  return (
    <button
      onClick={togglePairing}
      className={`px-4 py-2 rounded text-white font-semibold ${
        isPaired ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {isPaired ? "Paired" : "Unpaired"}
    </button>
  );
}

export default TogglePairButton;
