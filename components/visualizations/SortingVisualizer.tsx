'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAlgorithmStore } from '@/store/algorithmStore';

export default function SortingVisualizer() {
  const { array, currentStep, steps } = useAlgorithmStore();
  const currentState = steps[currentStep] || { array, comparing: [], swapping: [] };
  const maxValue = Math.max(...array);

  return (
    <div className="flex items-end justify-center space-x-1 h-full">
      <AnimatePresence mode="popLayout">
        {currentState.array.map((value: number, index: number) => (
          <motion.div
            key={`${index}-${value}`}
            className="flex flex-col items-center"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: currentState.comparing.includes(index) ? 1.1 : 1,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20
              }
            }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.div
              className={`w-8 rounded-t transition-colors ${
                currentState.swapping.includes(index)
                  ? 'bg-green-500'
                  : currentState.comparing.includes(index)
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              }`}
              style={{
                height: `${(value / maxValue) * 300}px`,
              }}
              layout
            />
            <span className="text-sm mt-2">{value}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}