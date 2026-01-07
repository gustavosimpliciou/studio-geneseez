import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

const steps = ["Character", "Storyboard", "Animation", "Export"];

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-16">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-900 -translate-y-1/2 rounded-full" />
        
        {/* Active Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-white -translate-y-1/2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((label, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={label} className="flex flex-col items-center gap-3">
                <motion.div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-black
                    ${isActive ? "border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" : ""}
                    ${isCompleted ? "border-white bg-white text-black" : ""}
                    ${!isActive && !isCompleted ? "border-zinc-800 text-zinc-600" : ""}
                  `}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold text-sm">{stepNum}</span>
                  )}
                </motion.div>
                <span className={`
                  text-xs font-medium uppercase tracking-wider
                  ${isActive ? "text-white" : "text-zinc-600"}
                `}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
