import { create } from 'zustand';

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
}

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

type AlgorithmType = 'sorting' | 'graph' | 'tree';

interface AlgorithmState {
  currentAlgorithm: string | null;
  algorithmType: AlgorithmType | null;
  array: number[];
  graph: {
    nodes: Node[];
    edges: Edge[];
    visited: string[];
    queue: string[];
    current: string | null;
  };
  tree: {
    root: TreeNode | null;
    visited: number[];
    current: number | null;
  };
  steps: any[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  setAlgorithm: (algorithm: string) => void;
  generateNewData: () => void;
  nextStep: () => void;
  previousStep: () => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
}

const generateRandomArray = (length: number = 15) => 
  Array.from({ length }, () => Math.floor(Math.random() * 80) + 10);

const generateRandomBST = (depth: number = 3): TreeNode | null => {
  if (depth === 0) return null;
  const value = Math.floor(Math.random() * 100);
  return {
    value,
    left: generateRandomBST(depth - 1),
    right: generateRandomBST(depth - 1),
  };
};

const generateRandomGraph = () => ({
  nodes: [
    { id: 'A', x: 400, y: 100 },
    { id: 'B', x: 200, y: 200 },
    { id: 'C', x: 600, y: 200 },
    { id: 'D', x: 300, y: 300 },
    { id: 'E', x: 500, y: 300 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'C', to: 'E', weight: 5 },
    { from: 'D', to: 'E', weight: 2 },
  ],
});

const generateBubbleSortSteps = (arr: number[]) => {
  const steps = [{ array: [...arr], comparing: [], swapping: [] }];
  const n = arr.length;
  const array = [...arr];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: [...array], comparing: [j, j + 1], swapping: [] });
      
      if (array[j] > array[j + 1]) {
        steps.push({ array: [...array], comparing: [j, j + 1], swapping: [j, j + 1] });
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({ array: [...array], comparing: [], swapping: [] });
      }
    }
  }
  
  return steps;
};

const generateBFSSteps = (graph: { nodes: Node[], edges: Edge[] }) => {
  const steps = [];
  const visited = new Set<string>();
  const queue = ['A'];
  const adjacencyList = new Map<string, string[]>();

  // Build adjacency list
  graph.edges.forEach(({ from, to }) => {
    if (!adjacencyList.has(from)) adjacencyList.set(from, []);
    if (!adjacencyList.has(to)) adjacencyList.set(to, []);
    adjacencyList.get(from)!.push(to);
    adjacencyList.get(to)!.push(from);
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (!visited.has(current)) {
      visited.add(current);
      steps.push({
        visited: Array.from(visited),
        queue: [...queue],
        current,
      });

      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }

  return steps;
};

export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  currentAlgorithm: null,
  algorithmType: null,
  array: [],
  graph: {
    nodes: [],
    edges: [],
    visited: [],
    queue: [],
    current: null,
  },
  tree: {
    root: null,
    visited: [],
    current: null,
  },
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500,

  setAlgorithm: (algorithm) => {
    let type: AlgorithmType;
    if (['Bubble Sort', 'Quick Sort', 'Merge Sort'].includes(algorithm)) {
      type = 'sorting';
    } else if (['BFS', 'DFS', "Dijkstra's Algorithm"].includes(algorithm)) {
      type = 'graph';
    } else {
      type = 'tree';
    }

    set({ 
      currentAlgorithm: algorithm,
      algorithmType: type,
      currentStep: 0,
      isPlaying: false,
    });
    get().generateNewData();
  },

  generateNewData: () => {
    const { currentAlgorithm, algorithmType } = get();
    
    if (algorithmType === 'sorting') {
      const newArray = generateRandomArray();
      const steps = generateBubbleSortSteps(newArray);
      set({ array: newArray, steps, currentStep: 0 });
    }
    else if (algorithmType === 'graph') {
      const graph = generateRandomGraph();
      const steps = generateBFSSteps(graph);
      set({ 
        graph: { ...graph, visited: [], queue: [], current: null },
        steps,
        currentStep: 0
      });
    }
    else if (algorithmType === 'tree') {
      const root = generateRandomBST();
      set({ 
        tree: { root, visited: [], current: null },
        currentStep: 0
      });
    }
  },

  nextStep: () => {
    const { currentStep, steps, isPlaying } = get();
    if (currentStep < steps.length - 1) {
      const nextStep = steps[currentStep + 1];
      set((state) => ({ 
        currentStep: state.currentStep + 1,
        ...nextStep
      }));
    } else if (isPlaying) {
      set({ isPlaying: false });
    }
  },

  previousStep: () => {
    const { currentStep, steps } = get();
    if (currentStep > 0) {
      const prevStep = steps[currentStep - 1];
      set((state) => ({ 
        currentStep: state.currentStep - 1,
        ...prevStep
      }));
    }
  },

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSpeed: (speed) => set({ speed }),
}));