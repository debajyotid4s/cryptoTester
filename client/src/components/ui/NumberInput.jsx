import { ChevronUp, ChevronDown } from "lucide-react";

export default function NumberInput({
  value,
  onChange,
  min = 1,
  max = 25,
  className = "",
  theme,
}) {
  const handleIncrement = () => {
    const newVal = Math.min(parseInt(value || 0) + 1, max);
    onChange(newVal);
  };

  const handleDecrement = () => {
    const newVal = Math.max(parseInt(value || 0) - 1, min);
    onChange(newVal);
  };

  const handleChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    if (val >= min && val <= max) {
      onChange(val);
    }
  };

  return (
    <div
      className={`flex items-center border border-realm-border rounded-lg overflow-hidden transition-all duration-300 group hover:shadow-lg ${className}`}
      style={{
        backgroundColor: "rgba(13, 17, 23, 0.9)",
        boxShadow: theme?.color ? `inset 0 0 15px ${theme.color}10` : "none",
      }}
    >
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="p-2 hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed duration-200"
        title="Decrease value"
      >
        <ChevronDown
          size={16}
          className="text-realm-muted group-hover:text-realm-text transition-colors"
        />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        className="w-14 text-center font-cinzel font-bold text-realm-text bg-transparent outline-none border-l border-r border-realm-border/40"
        style={{ "--tw-ring-color": theme?.color || "#e05252" }}
      />
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="p-2 hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed duration-200"
        title="Increase value"
      >
        <ChevronUp
          size={16}
          className="text-realm-muted group-hover:text-realm-text transition-colors"
        />
      </button>
    </div>
  );
}
