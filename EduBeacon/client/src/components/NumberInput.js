import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const NumberInput = ({ value, onChange, min, max, step = 1, placeholder, className = '' }) => {
  const handleIncrement = (e) => {
    e.preventDefault();
    // Use Number() to correctly add step (e.g. 2.5 + 0.1)
    const val = Number(value) || 0;
    let newVal = val + Number(step);
    // Fix floating point precision
    newVal = Math.round(newVal * 100) / 100;
    if (max !== undefined && newVal > Number(max)) return;
    onChange({ target: { value: newVal } });
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    const val = Number(value) || 0;
    let newVal = val - Number(step);
    newVal = Math.round(newVal * 100) / 100;
    if (min !== undefined && newVal < Number(min)) return;
    onChange({ target: { value: newVal } });
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="input-field w-full !pr-10 number-input-hide-spinners"
      />
      <div className="absolute right-2 flex flex-col items-center justify-center -space-y-1">
        <button
          type="button"
          onClick={handleIncrement}
          className="text-slate-400 hover:text-[rgb(51,116,253)] transition-colors p-0.5 rounded-md hover:bg-white/5"
          aria-label="Increase value"
        >
          <ChevronUp size={14} strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          className="text-slate-400 hover:text-[rgb(51,116,253)] transition-colors p-0.5 rounded-md hover:bg-white/5"
          aria-label="Decrease value"
        >
          <ChevronDown size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
