"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "./ui/stepper";

const steps = [1, 2, 3, 4];
const stepsNamed = [
  {
    step: 1,
    title: "Edit",
  },
  {
    step: 2,
    title: "Preview",
  },
  {
    step: 3,
    title: "Publish",
  },
];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="mx-auto max-w-xl space-y-2 pb-2 text-center">
      <div className="space-y-3">
        {/*

        <Stepper value={currentStep} onValueChange={setCurrentStep}>
          {steps.map((step) => (
            <StepperItem key={step} step={step} className="not-last:flex-1">
              <StepperTrigger>
                <StepperIndicator className="data-[state=active]:border-primary size-4 data-[state=active]:border-2 data-[state=active]:bg-transparent [&_span]:sr-only [&_svg]:size-3" />
              </StepperTrigger>
              {step < steps.length && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
*/}
        {/*

        <Stepper value={currentStep} onValueChange={setCurrentStep} className="gap-1">
          {steps.map((step) => (
            <StepperItem key={step} step={step} className="flex-1">
              <StepperTrigger className="w-full flex-col items-start gap-2" asChild>
                <StepperIndicator asChild className="bg-border h-1 w-full">
                  <span className="sr-only">{step}</span>
                </StepperIndicator>
              </StepperTrigger>
            </StepperItem>
          ))}
        </Stepper>
        */}

        <Stepper value={currentStep} onValueChange={setCurrentStep} className="items-start gap-4">
          {stepsNamed.map(({ step, title }) => (
            <StepperItem key={step} step={step} className="flex-1">
              <StepperTrigger className="w-full flex-col items-center gap-2 rounded">
                <StepperIndicator asChild className="bg-border h-1 w-full">
                  <span className="sr-only">{step}</span>
                </StepperIndicator>
                <div className="space-y-0.5">
                  <StepperTitle>{title}</StepperTitle>
                </div>
              </StepperTrigger>
            </StepperItem>
          ))}
        </Stepper>
      </div>
      {/*

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          className="w-32"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          Prev step
        </Button>
        <Button
          variant="outline"
          className="w-32"
          onClick={() => setCurrentStep((prev) => prev + 1)}
          disabled={currentStep >= steps.length}
        >
          Next step
        </Button>
      </div>
      */}
    </div>
  );
}
