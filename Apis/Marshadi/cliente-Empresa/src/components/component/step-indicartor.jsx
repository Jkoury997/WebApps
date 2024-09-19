import React from 'react';

export function StepIndicator({ activeStep, steps }) {
  return (
    <div className="flex items-center gap-4">
      {Array.from({ length: steps }, (_, index) => index + 1).map((step) => (
        <div
          key={step}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${
            activeStep === step
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <span className="text-lg font-semibold">{step}</span>
        </div>
      ))}
    </div>
  );
}
