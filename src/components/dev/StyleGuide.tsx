import React from "react";

export default function StyleGuide() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Aesthetic Style Guide & Validation</h1>
      <div className="card-base mb-4">
        <h2 className="text-xl font-semibold mb-2">Card Base</h2>
        <p>This card uses the <code>card-base</code> class for deep surface, teal border, and hover glow.</p>
      </div>
      <div className="card-inner mb-4">
        <h2 className="text-lg font-semibold mb-2">Card Inner</h2>
        <p>This card uses the <code>card-inner</code> class for dense data display.</p>
      </div>
      <div className="mb-4">
        <label htmlFor="slider-teal" className="block mb-2 font-medium">Teal Slider Thumb</label>
        <input type="range" id="slider-teal" className="slider-thumb-teal w-full" min="0" max="100" />
      </div>
      <div className="mb-4">
        <label htmlFor="slider-pink" className="block mb-2 font-medium">Pink Slider Thumb</label>
        <input type="range" id="slider-pink" className="slider-thumb-pink w-full" min="0" max="100" />
      </div>
      <div className="mb-4 h-32 overflow-y-scroll card-base">
        <h2 className="text-lg font-semibold mb-2">Custom Scrollbar</h2>
        <p>Scroll this area to see the custom scrollbar styling in action.</p>
        <div style={{height: '100px'}}></div>
      </div>
      <button className="btn-primary">Primary Button</button>
    </div>
  );
}
