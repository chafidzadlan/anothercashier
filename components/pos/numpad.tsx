import { Button } from "@/components/ui/button";
import { X, Delete } from "lucide-react";

interface NumpadProps {
  onInput: (value: string) => void;
}

export default function Numpad({ onInput }: NumpadProps) {
  const handleButtonClick = (value: string) => {
    onInput(value);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("1")}
      >
        1
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("2")}
      >
        2
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("3")}
      >
        3
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("4")}
      >
        4
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("5")}
      >
        5
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("6")}
      >
        6
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("7")}
      >
        7
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("8")}
      >
        8
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("9")}
      >
        9
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("clear")}
      >
        <X size={20} />
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("0")}
      >
        0
      </Button>
      <Button
        variant="outline"
        className="p-4 text-center h-16 text-xl font-medium"
        onClick={() => handleButtonClick("backspace")}
      >
        <Delete size={20} />
      </Button>
    </div>
  );
}