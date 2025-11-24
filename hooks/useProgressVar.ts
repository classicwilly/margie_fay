import { useEffect } from "react";

export default function useProgressVar(
  ref: React.RefObject<HTMLElement>,
  value: string | number,
) {
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const val = typeof value === "number" ? `${value}%` : value;
    ref.current.style.setProperty("--progress", val);
  }, [ref, value]);
}
