import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  completed: boolean;
  current: boolean;
}

interface ProgressStepperProps {
  steps: Step[];
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                step.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : step.current
                  ? "bg-gray-900 border-gray-900 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              )}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span className="mt-2 text-sm text-gray-600">{step.title}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-24 h-0.5 bg-gray-300 mx-4 mt-5" />
          )}
        </div>
      ))}
    </div>
  );
};
