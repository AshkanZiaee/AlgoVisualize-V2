'use client';

import { useAlgorithmStore } from '@/store/algorithmStore';
import SortingVisualizer from './visualizations/SortingVisualizer';
import GraphVisualizer from './visualizations/GraphVisualizer';
import TreeVisualizer from './visualizations/TreeVisualizer';

export default function VisualizationArea() {
  const { currentAlgorithm, algorithmType } = useAlgorithmStore();

  const renderVisualization = () => {
    if (!currentAlgorithm) {
      return (
        <div className="text-center text-gray-500">
          Please select an algorithm from the menu to begin visualization
        </div>
      );
    }

    switch (algorithmType) {
      case 'sorting':
        return <SortingVisualizer />;
      case 'graph':
        return <GraphVisualizer />;
      case 'tree':
        return <TreeVisualizer />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[60vh] bg-gray-50 rounded-lg border-2 border-gray-200 mb-6">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">{currentAlgorithm || 'Select an Algorithm'}</h2>
        <div className="flex items-center justify-center h-[calc(60vh-8rem)]">
          {renderVisualization()}
        </div>
      </div>
    </div>
  );
}