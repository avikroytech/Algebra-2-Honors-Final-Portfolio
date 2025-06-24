"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calculator, 
  Code, 
  Database, 
  GitBranch, 
  HelpCircle, 
  Lightbulb, 
  Menu, 
  Search, 
  Settings, 
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Terminal,
  Binary,
  Activity
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
}

const Navigation = ({ 
  activeSection, 
  setActiveSection 
}: { 
  activeSection: string; 
  setActiveSection: (section: string) => void 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['algorithms', 'data-structures']));

  const sections: NavigationItem[] = [
    { id: 'landing', label: 'Home', icon: Terminal },
    { id: 'introduction', label: 'Introduction', icon: Binary },
    { id: 'why', label: 'Why', icon: HelpCircle },
    { id: 'brainstorming', label: 'Brainstorming', icon: Lightbulb },
    { id: 'planning', label: 'Planning', icon: Settings },
	{
      id: 'runtime-title',
      label: 'Runtime Complexity',
      icon: Activity,
      children: [
        { id: 'runtime-title', label: 'Header', icon: Activity },
        { id: 'definition', label: 'Definition', icon: Code },
    	{ id: 'gallery', label: 'Gallery', icon: Database },
      ]
    },
    {
      id: 'algorithms',
      label: 'Algorithms',
      icon: GitBranch,
      children: [
        { id: 'algorithms-title', label: 'Header', icon: GitBranch },
        { id: 'searching', label: 'Searching', icon: Search },
        { id: 'sorting', label: 'Sorting', icon: Menu },
      ]
    },
    {
      id: 'data-structures',
      label: 'Data Structures',
      icon: Database,
      children: [
        { id: 'data-structures-title', label: 'Header', icon: Database },
        { id: 'structures-def', label: 'Definition', icon: Code },
        { id: 'parallax-section', label: 'Examples', icon: Zap },
      ]
    },
    { id: 'work-log', label: 'Work Log', icon: Settings },
    { id: 'reflection', label: 'Reflection', icon: Lightbulb },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSectionClick = (section: NavigationItem) => {
    if (section.children) {
      // If it's a parent section, toggle expansion
      toggleSection(section.id);
      // Also scroll to the section if it has a corresponding DOM element
      scrollToSection(section.id);
    } else {
      // If it's a regular section, just scroll
      scrollToSection(section.id);
    }
  };

  const isParentActive = (section: NavigationItem): boolean => {
    if (activeSection === section.id) return true;
    if (section.children) {
      return section.children.some(child => activeSection === child.id);
    }
    return false;
  };

  const renderNavigationItem = (section: NavigationItem, isChild = false) => {
    const Icon = section.icon;
    const hasChildren = section.children && section.children.length > 0;
    const isExpanded = expandedSections.has(section.id);
    const isActive = activeSection === section.id;
    const isParentOfActive = isParentActive(section);

    return (
      <div key={section.id}>
        <Button
          variant="ghost"
          className={`w-full font-mono text-xs transition-all duration-200 ${
            isCollapsed ? 'justify-center px-0' : 'justify-start'
          } ${
            isChild && !isCollapsed ? 'ml-4 w-[calc(100%-1rem)]' : ''
          } ${
            isActive
              ? 'bg-green-500/20 text-green-300 border-l-2 border-green-400'
              : isParentOfActive && !isActive
              ? 'bg-green-500/10 text-green-400'
              : 'text-gray-300 hover:text-green-400 hover:bg-green-500/10'
          }`}
          onClick={() => handleSectionClick(section)}
          title={isCollapsed ? section.label : undefined}
        >
          <div className="flex items-center w-full">
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="ml-2 truncate flex-1 text-left">{section.label}</span>
                {hasChildren && (
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </>
            )}
          </div>
        </Button>

        {/* Render children if expanded and not collapsed */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {section.children!.map(child => renderNavigationItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-black/90 backdrop-blur-sm border-r border-green-500/30 transition-all duration-300 z-50 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Fixed header with collapse button */}
      <div className="flex-shrink-0 p-4 border-b border-green-500/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full font-mono transition-all duration-200 text-green-400 hover:text-green-300 hover:bg-green-500/10 ${
            isCollapsed ? 'justify-center px-0' : 'justify-start'
          }`}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-2">MENU</span>}
        </Button>
      </div>
      
      {/* Scrollable navigation area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <nav className="space-y-2 p-4">
          {sections.map(section => renderNavigationItem(section))}
        </nav>
      </div>
    </div>
  );
};

const ParallaxSection = ({ 
  children, 
  className = "", 
  offset = 0.5 
}: { 
  children: React.ReactNode; 
  className?: string; 
  offset?: number;
}) => {
  const [transform, setTransform] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Only apply parallax when element is in viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        // Calculate how much of the element is visible
        // Negative values when element is above viewport
        const elementTop = rect.top;
        const relativePos = elementTop - windowHeight;
        
        // Apply parallax offset
        setTransform(relativePos * offset);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    handleScroll();
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [offset]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${transform}px)`,
        willChange: 'transform', // Optimize for animations
      }}
    >
      {children}
    </div>
  );
};

const RuntimeCard = ({ title, notation, equation, description, codeExample, algebraEquations, graphs, dataTable }: {
  title: string;
  notation: string;
  equation: string;
  description: string;
  codeExample: string;
  algebraEquations: string[];
  graphs: any[];
  dataTable: any[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-black/60 border-green-500/30 hover:border-green-400/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
          <CardHeader>
            <CardTitle className="text-green-400 font-mono text-lg">{title}</CardTitle>
            <CardDescription className="text-green-300/70 font-mono text-sm">{notation}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 font-mono text-xs">{equation}</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-green-500/30 text-green-400 overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="font-mono text-xl">{title} - {notation}</DialogTitle>
          <DialogDescription className="text-green-300/70">
            Runtime Complexity Analysis
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-lg mb-2 text-green-400">Description</h3>
              <p className="text-gray-300 font-mono text-sm">{description}</p>
            </div>
            
            <div>
              <h3 className="font-mono text-lg mb-2 text-green-400">Code Example</h3>
              <pre className="bg-gray-900/50 p-4 rounded-lg border border-green-500/30 text-green-300 font-mono text-xs overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-mono text-lg mb-2 text-green-400">Mathematical Analysis</h3>
                {algebraEquations.map((eq, index) => (
                  <div key={index} className="bg-gray-900/50 p-3 rounded border border-green-500/30 mb-2">
                    <p className="text-green-300 font-mono text-sm">{eq}</p>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="font-mono text-lg mb-2 text-green-400">Visualization</h3>
                {graphs.map((graph, index) => (
                  <div key={index} className="bg-gray-900/50 p-8 rounded border border-green-500/30 mb-2 flex flex-col items-center justify-center">
                    <img className="m-4 rounded-lg border-2 border-green-300 transition-transform duration-300 hover:scale-105" src={graph[0]}/>
					<p className="text-green-300/70 font-mono text-xs" >{graph[1]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-lg mb-2 text-green-400">Performance Data</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-green-500/30">
                      <TableHead className="text-green-400 font-mono">Input Size (n)</TableHead>
                      <TableHead className="text-green-400 font-mono">Operations</TableHead>
                      <TableHead className="text-green-400 font-mono">Time (ms)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataTable.map((row, index) => (
                      <TableRow key={index} className="border-green-500/30">
                        <TableCell className="text-green-300 font-mono">{row.size}</TableCell>
                        <TableCell className="text-green-300 font-mono">{row.operations}</TableCell>
                        <TableCell className="text-green-300 font-mono">{row.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const AlgorithmCarousel = ({ algorithms, title }: { algorithms: any[]; title: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % algorithms.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [algorithms.length]);

  return (
    <div className="relative">
      <h3 className="text-2xl font-mono text-green-400 mb-6 text-center">{title}</h3>
      <div className="flex overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {algorithms.map((algorithm, index) => (
            <div key={index} className="min-w-full p-4">
              <RuntimeCard {...algorithm} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {algorithms.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
              index === currentIndex ? 'bg-green-400' : 'bg-green-400/30'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

const BrainstormingTopic = ({title, items}: {title: string; items: any[] }) => {
	return (
		<div className='flex flex-col items-center justify-center m-2 p-1'>
			<h4 className='text-2xl font-mono text-green-300 mb-3 text-center'>
					{title}
			</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((idea, index) => { 
				
				if (idea != "Computer Science") {
					return (
						<Card key={index} className="bg-black/60 border-green-500/30 hover:border-green-400/50 transition-all duration-300 cursor-pointer hover:scale-105">
						<CardContent className="p-4 text-center">
							<Lightbulb className="h-6 w-6 mx-auto mb-2 text-green-400" />
							<p className="text-green-300 font-mono text-sm">{idea}</p>
						</CardContent>
						</Card>
					)
				}
				else if (idea == "Computer Science") {
					return (
						<Card key={index} className="bg-green-300 border-green-300 hover:border-green-500 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-green-200 shadow-lg shadow-xl shadow-green-400/60">
							<CardContent className="p-4 text-center">
								<Lightbulb className="h-6 w-6 mx-auto mb-2 text-black hover:text-green-800 transition-colors duration-300" />
								<p className="text-black font-mono text-sm">{idea}</p>
							</CardContent>
						</Card>
					)
				}
				
			  })}
            </div>
		</div>
	)
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('landing');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const runtimeComplexities = [
    {
      title: 'Constant Time',
      notation: 'O(1)',
      equation: 'f(n) = c',
      description: 'Algorithm execution time remains constant regardless of input size.',
      codeExample: `def constant(n):
	return n`,
      algebraEquations: ['Parent Function: f(n) = c', 'Where c is a constant', 'Explicit Function: f(n) = 0.0000002', 'Domain: [1,10000]', 'Range: [0.0000002,0.0000003]'],
      graphs: [['./static/pictures/runtime/constant_parent.png', 'Parent Function Graph'], ['./static/pictures/runtime/constant_test.png', 'Test Results Graph']],
      dataTable: [
        { size: '1', operations: '1', time: '0.0000002' },
        { size: '2', operations: '1', time: '0.0000002' },
        { size: '3', operations: '1', time: '0.0000003' },
		{ size: '', operations:'...', time: ''},
		{ size: '9999', operations: '1', time: '0.0000002' },
		{ size: '10000', operations: '1', time: '0.0000002' },
      ]
    },
    {
      title: 'Linear Time',
      notation: 'O(n)',
      equation: 'f(n) = an + b',
      description: 'Algorithm execution time grows linearly with input size.',
      codeExample: `def linear(n):
	sum = 0
	for i in range(n):
		sum += 1
	return sum`,
      algebraEquations: ['Parent Function: f(n) = mx + b', 'Where m is a slope and b is y-intercept', 'Explicit Function: f(n) = 5.365 × 10⁻⁸n + 2.046 × 10⁻⁶', 'Domain: [1,10000]', 'Range: [0.0000002,0.0005386]'],
      graphs: [['./static/pictures/runtime/linear_parent.png', 'Parent Function Graph'], ['./static/pictures/runtime/linear_test.png', 'Test Results Graph']],
      dataTable: [
        { size: '1', operations: '1', time: '0.0000021' },
        { size: '2', operations: '2', time: '0.0000009' },
        { size: '3', operations: '3', time: '0.0000015' },
		{ size: '', operations:'...', time: ''},
		{ size: '9999', operations: '9999', time: '0.0005102' },
		{ size: '10000', operations: '10000', time: '0.0005386' },
      ]
    },
    {
      title: 'Quadratic Time',
      notation: 'O(n²)',
      equation: 'f(n) = an² + bn + c',
      description: 'Algorithm execution time grows quadratically with input size.',
      codeExample: `def quadratic(n):
	sum = 0
	for i in range(n):
		for j in range(n):
			sum += 1
	return sum`,
      algebraEquations: ['Parent Function: f(n) = an² + bn + c', 'Explicit Function: f(n) = 5 × 10⁻⁸ × n² - 3.5 × 10⁻⁷ × n + 3.45 × 10⁻⁶', 'Domain: [1,500]', 'Range: [0.0000028,0.0120266]'],
      graphs: [['./static/pictures/runtime/quadratic_parent.png', 'Parent Function Graph'], ['./static/pictures/runtime/quadratic_test.png', 'Test Results Graph']],
      dataTable: [
        { size: '1', operations: '1', time: '0.0000028' },
        { size: '2', operations: '4', time: '0.0000026' },
        { size: '3', operations: '9', time: '0.0000025' },
		{ size: '', operations:'...', time: ''},
		{ size: '499', operations: '499²', time: '0.0116332' },
		{ size: '500', operations: '500²', time: '0.0120266' },
      ]
    },
	{
      title: 'Cubic Time',
      notation: 'O(n³)',
      equation: 'f(n) = n³',
      description: 'Algorithm execution time grows cubically with input size.',
      codeExample: `def cubic(n):
	sum = 0
	for i in range(n):
		for j in range(n):
			for k in range(n):
				sum += 1
	return sum`,
      algebraEquations: ['Parent Function: f(n) = n³', 'Explicit Function: f(n) = 1.22 × 10⁻⁸ × n³ - 1.83 × 10⁻⁶ × n² + 1.87 × 10⁻⁵ × n - 1.63 × 10⁻⁵', 'Domain: [1,250]', 'Range: [0.0000029,0.7608478]'],
      graphs: [['./static/pictures/runtime/quadratic_parent.png', 'Parent Function Graph'], ['./static/pictures/runtime/quadratic_test.png', 'Test Results Graph']],
      dataTable: [
        { size: '1', operations: '1', time: '0.0000029' },
        { size: '2', operations: '8', time: '0.0000047' },
        { size: '3', operations: '27', time: '0.0000041' },
		{ size: '', operations:'...', time: ''},
		{ size: '249', operations: '249³', time: '0.7094321' },
		{ size: '250', operations: '250³', time: '0.7608478' },
      ]
    },
	{
      title: 'Exponential Time',
      notation: 'O(n^x) (base 2)',
      equation: 'f(n) = n^x',
      description: 'Algorithm execution time grows exponentially with input size.',
      codeExample: `def exponential(n):
	sum = 0
	for i in range(2 ** n):
		sum += 1
	return sum`,
      algebraEquations: ['Parent Function: f(n) = 2^n', 'Explicit Function: f(n) = 6.39 × 10⁻⁸ × 2^n + 1.82 × 10⁻⁶', 'Domain: [1,25]', 'Range: [0.0000031,2.1442168]'],
      graphs: [['./static/pictures/runtime/exp2_parent.png', 'Parent Function Graph'], ['./static/pictures/runtime/exp2_test.png', 'Test Results Graph']],
      dataTable: [
        { size: '1', operations: '1', time: '0.0000031' },
        { size: '2', operations: '4', time: '0.0000017' },
        { size: '3', operations: '8', time: '0.0000025' },
		{ size: '', operations:'...', time: ''},
		{ size: '24', operations: '2^24', time: '1.0630608' },
		{ size: '25', operations: '2^25', time: '2.1442168' },
      ]
    },
	{
      title: 'Exponential Time',
      notation: 'O(b^n) (base 3)',
      equation: 'f(n) = b^n',
      description: 'Algorithm execution time grows exponentially with input size.',
      codeExample: `def exponential(n):
	sum = 0
	for i in range(3 ** n):
		sum += 1
	return sum`,
      algebraEquations: ['Parent Function: f(n) = 3^n', 'Explicit Function: f(n) = 7.0 × 10^-8 × 3^n', 'Domain: [1,16]', 'Range: [0.0000047,3.0942885]'],
      graphs: [['./static/pictures/runtime/exp3_parent.png', 'Parent Function Graph'], ['./static/pictures/runtime/exp3_test.png', 'Test Results Graph']],
      dataTable: [
        { size: '1', operations: '1', time: '0.0000047' },
        { size: '2', operations: '9', time: '0.0000043' },
        { size: '3', operations: '27', time: '0.0000079' },
		{ size: '', operations:'...', time: ''},
		{ size: '15', operations: '3^15', time: '0.9778415' },
		{ size: '16', operations: '3^16', time: '3.0942885' },
      ]
    },
	{
      title: 'Logarithmic Time',
      notation: 'O(log(n))',
      equation: 'f(n) = log(n)',
      description: 'Algorithm execution time grows quadratically with input size.',
      codeExample: `def log(n):
	sum = 0
	while n > 1:
		n = n // 2
		sum += 1
	return sum`,
      algebraEquations: ['Parent Function: f(n) = log2(n)', 'Explicit Function: f(n) = 5.365 × 10⁻⁸n + 2.046 × 10⁻⁶', 'Domain: [1,100000]', 'Range: [0.0000008,0.0000014]'],
      graphs: [['./static/pictures/runtime/log_parent.png', 'Parent Function Graph'], ['./static/pictures/runtime/log_test.png', 'Test Results Graph']],
      dataTable: [
        { size: '1', operations: 'log2(1)', time: '0.0000008' },
        { size: '2', operations: '1', time: '0.0000011' },
        { size: '3', operations: 'log(3)', time: '0.0000005' },
		{ size: '', operations:'...', time: ''},
		{ size: '99999', operations: 'log2(99999)', time: '0.0000014' },
		{ size: '100000', operations: 'log2(100000)', time: '0.0000014' },
      ]
    },
  ];

  const searchingAlgorithms = [
    {
      title: 'Linear Search',
      notation: 'O(n)',
      equation: 'f(n) = n',
      description: 'Goes through list of values one by one till target is found.',
      codeExample: `def linear(arr, target):
	for i, val in enumerate(arr):
		if val == target:
			return i
	return -1`,
      algebraEquations: ['Parent Function: f(n) = n', 'Explicit Function: 2.5 × 10^-8 × n + 0.00005', 'Domain: [1,10000]', 'Range: [0.000002,0.00021]'],
      graphs: [['./static/pictures/search/linear_parent.png','Parent Function Graph'], ['./static/pictures/search/linear_graph.png','Test Results Graph']],
      dataTable: [
        { size: '1', operations: '1', time: '0.000002' },
        { size: '2', operations: '2', time: '0.000003' },
        { size: '3', operations: '3', time: '0.000002' },
		{ size: '', operations: '...', time: '' },
        { size: '9999', operations: '9999', time: '0.00023' },
        { size: '10000', operations: '10000', time: '0.00021' },
      ]
    },
	{
      title: 'Binary Search',
      notation: 'O(log n)',
      equation: 'f(n) = log₂(n)',
      description: 'Efficiently searches sorted arrays by repeatedly dividing search space in half.',
      codeExample: `def binary_search(arr, target, high, low):
	if high >= low:
		mid = (high + low) // 2
		if arr[mid] == target:
			return mid
		elif arr[mid] > target:
			return binary_search(arr, target, low, mid - 1)
		else:
			return binary_search(arr, target, high, mid + 1)
	else:
		return False`,
      algebraEquations: ['Parent Function: f(n) = log₂(n)', 'Explicit Function: 9.0 × 10⁻⁷ × log₂(n) + 5.0 × 10⁻⁶', 'Domain: [1,10000]', 'Range: [0.0000007,0.000002]'],
      graphs: [['./static/pictures/search/binary_parent.png','Parent Function Graph'], ['./static/pictures/search/binary_graph.png','Test Results Graph']],
      dataTable: [
        { size: '1', operations: 'log₂(1)', time: '0.0000007' },
        { size: '2', operations: '1', time: '0.0000006' },
        { size: '3', operations: 'log₂(3)', time: '0.0000008' },
		{ size: '', operations: '...', time: '' },
        { size: '9999', operations: 'log₂(9999)', time: '0.000002' },
        { size: '10000', operations: 'log₂(10000)', time: '0.000002' },
      ]
    },
	{
      title: 'Ternary Search',
      notation: 'O(log n)',
      equation: 'f(n) = log₃(n)',
      description: 'Efficiently searches sorted arrays by repeatedly eliminating one third of the search space.',
      codeExample: `def ternary_search(arr, target):
	low, high = 0, len(arr) - 1
	while low <= high:
		mid1 = low + (high - low) // 3
		mid2 = high - (high - low) // 3
		if arr[mid1] == target:
			return mid1
		if arr[mid2] == target:
			return mid2
		if target < arr[mid1]:
			high = mid1 - 1
		elif target > arr[mid2]:
			low = mid2 + 1
		else:
			low = mid1 + 1
			high = mid2 - 1
	return -1`,
      algebraEquations: ['Parent Function: f(n) = log₃(n)', 'Explicit Function: 3.3 × 10⁻⁶ × log₃(n) + 1.0 × 10⁻⁶', 'Domain: [1,1000]', 'Range: [0.0000001,0.000002]'],
      graphs: [['./static/pictures/search/ternary_parent.png','Parent Function Graph'], ['./static/pictures/search/ternary_graph.png','Test Results Graph']],
      dataTable: [
        { size: '1', operations: 'log₃(1)', time: '0.0000001' },
        { size: '2', operations: '1', time: '0.0000002' },
        { size: '3', operations: 'log₃(3)', time: '0.0000002' },
		{ size: '', operations: '...', time: '' },
        { size: '999', operations: 'log₃(999)', time: '0.000002' },
        { size: '1000', operations: 'log₃(1000)', time: '0.000002' },
      ]
    },
	{
      title: 'Jump Search',
      notation: 'O(√n)',
      equation: 'f(n) = √n',
      description: 'Divides search space into blocks, jumps from one block to another until block with target found. Then linearly searches block.',
      codeExample: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0

    while prev < n and arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1

    for i in range(prev, min(step, n)):
        if arr[i] == target:
            return i

    return -1`,
      algebraEquations: ['Parent Function: f(n) = √n', 'Explicit Function: 3.5 × 10⁻⁷ × √n + 2.5 × 10⁻⁶', 'Domain: [1,1000]', 'Range: [0.00000005,0.0000016]'],
      graphs: [['./static/pictures/search/jump_parent.png','Parent Function Graph'], ['./static/pictures/search/jump_graph.png','Test Results Graph']],
      dataTable: [
		{ size: '1', operations: '1', time: '0.00000005' },
        { size: '2', operations: '√2', time: '0.00000007' },
        { size: '3', operations: '√3', time: '0.00000008' },
		{ size: '', operations: '...', time: '' },
        { size: '999', operations: '√999', time: '0.0000015' },
        { size: '1000', operations: '√1000', time: '0.0000016' },
      ]
    },
  ];

  const sortingAlgorithms = [
    {
      title: 'Bubble Sort',
      notation: 'O(n²)',
      equation: 'f(n) = n²',
      description: 'Repeatedly steps through the list, "bubbling" up elements to sort them.',
      codeExample: `import random

def bubble_sort(arr):
	n = len(arr)
	
	for i in range(n):
		swapped = False

		for j in range(0, n-i-1):
			if arr[j] > arr[j+1]:
				arr[j], arr[j+1] = arr[j+1], arr[j]
				swapped = True
		if (swapped == False):
			break`,
      algebraEquations: ['Parent Function: f(n) = n²', 'Explicit Function: f(n) = 5 × 10⁻⁸ × n²', 'Domain: [1,500]', 'Range: [0.00000002,0.013]'],
      graphs: [['./static/pictures/sort/bubble_parent.png','Parent Function Graph'], ['./static/pictures/sort/bubble_graph.png','Test Results Graph']],
      dataTable: [
		{ size: '1', operations: '1', time: '0.00000002' },
        { size: '2', operations: '4', time: '0.00000003' },
        { size: '3', operations: '9', time: '0.00000004' },
		{ size: '', operations: '...', time: '' },
        { size: '499', operations: '499²', time: '0.012' },
        { size: '500', operations: '500²', time: '0.013' },
      ]
    },
	{
      title: 'Insertion Sort',
      notation: 'O(n²)',
      equation: 'f(n) = n²',
      description: 'Iteratively inserts each element into its correct position within a growing sorted list.',
      codeExample: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
      algebraEquations: ['Parent Function: f(n) = n²', 'Explicit Function: f(n) = 1.875 × 10⁻⁸ × n² + 1.25 × 10⁻⁶ × n', 'Domain: [1,500]', 'Range: [0.00000002,0.0054]'],
      graphs: [['./static/pictures/sort/insertion_parent.png','Parent Function Graph'], ['./static/pictures/sort/insertion_graph.png','Test Results Graph']],
      dataTable: [
		{ size: '1', operations: '1', time: '0.00000002' },
        { size: '2', operations: '4', time: '0.00000003' },
        { size: '3', operations: '9', time: '0.00000004' },
		{ size: '', operations: '...', time: '' },
        { size: '499', operations: '499²', time: '0.005' },
        { size: '500', operations: '500²', time: '0.0054' },
      ]
    },
	{
      title: 'Merge Sort',
      notation: 'O(n log n)',
      equation: 'f(n) = n log₂(n)',
      description: 'Recursively divides an unsorted list into smaller sublists, which are then merged back together to create a single sorted list.',
      codeExample: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    # Divide the list into two halves
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    # Merge the sorted halves
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    # Merge two sorted lists into result
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Append any remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      algebraEquations: ['Parent Function: f(n) = n log(n)', 'Explicit Function: f(n) = 3.1 × 10⁻⁷ × n × log₂(n) + 1.1 × 10⁻⁴', 'Domain: [1,1000]', 'Range: [0.00000002,0.0025]'],
      graphs: [['./static/pictures/sort/merge_parent.png','Parent Function Graph'], ['./static/pictures/sort/merge_graph.png','Test Results Graph']],
      dataTable: [
		{ size: '1', operations: '1×log(1)', time: '0.00000002' },
        { size: '2', operations: '2', time: '0.00000003' },
        { size: '3', operations: '3×log(3)', time: '0.00000004' },
		{ size: '', operations: '...', time: '' },
        { size: '999', operations: '999×log(999)', time: '0.0023' },
        { size: '1000', operations: '1000×log(1000)', time: '0.0025' },
      ]
    },
	{
      title: 'Quick Sort',
      notation: 'O(n²)',
      equation: 'f(n) = n²',
      description: 'Select a pivot element, then split the list around it. Then recursively keep sorting sublists until the entire list is sorted.',
      codeExample: `def quick_sort(arr, low, high):
    if low < high:
        
        pi = partition(arr, low, high)
        
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
        
def partition(arr, low, high):
    
    # Choose the pivot
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            swap(arr, i, j)
    
    swap(arr, i + 1, high)
    return i + 1

def swap(arr, i, j):
    arr[i], arr[j] = arr[j], arr[i]`,
      algebraEquations: ['Parent Function: f(n) = n²', 'Explicit Function: f(n) = 5 × 10⁻⁸ × n²', 'Domain: [1,1000]', 'Range: [0.00000002,0.013]'],
      graphs: [['./static/pictures/sort/quick_parent.png','Parent Function Graph'], ['./static/pictures/sort/quick_graph.png','Test Results Graph']],
      dataTable: [
		{ size: '1', operations: '1', time: '0.00000002' },
        { size: '2', operations: '4', time: '0.00000003' },
        { size: '3', operations: '9', time: '0.00000004' },
		{ size: '', operations: '...', time: '' },
        { size: '999', operations: '499²', time: '0.012' },
        { size: '1000', operations: '500²', time: '0.013' },
      ]
    },
  ];

  const workLogData = [
    { date: '6/16 Monday', task: 'Brainstormed ideas & Planned out schedule', hours: '2', status: 'Complete' },
    { date: '6/17 Tuesday', task: 'Layout decided and researched on runtime complexity', hours: '3', status: 'Complete' },
    { date: '6/18 Wednesday', task: 'Started implementation of runtimes and searching algorithms', hours: '4', status: 'Complete' },
    { date: '6/19 Thursday', task: 'Finished sorting algorithms and data structure implementation', hours: '3', status: 'Complete' },
    { date: '6/20 Friday', task: 'Tested and graphed all needed data', hours: '2', status: 'Complete' },
	{ date: '6/21 Saturday', task: 'Created presentation and started portfolio', hours: '4', status: 'Complete' },
	{ date: '6/22 Sunday', task: 'Finished portfolio and created runtime calculator', hours: '4', status: 'Complete' },
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-x-hidden selection:bg-green-300 selection:text-green-900">
      {/* Matrix background effect */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Mouse follower effect */}
      <div 
        className="fixed w-4 h-4 bg-green-400/20 rounded-full pointer-events-none z-10 transition-transform duration-100"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: 'scale(1)',
        }}
      />

      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="ml-16 lg:ml-64">
        {/* Landing Page */}
        <section id="landing" className="min-h-screen flex items-center justify-center relative">
          <ParallaxSection className="absolute h-full w-100 inset-0 flex items-center justify-center mb-0" offset={0.15}>
            <div className="select-none animate-pulse">
              <img className="absolute inset-0 w-full h-full object-cover" src="https://img.freepik.com/free-vector/matrix-style-binary-code-digital-falling-numbers-blue-background_1017-37387.jpg?semt=ais_hybrid&w=740" />
            </div>
          </ParallaxSection>
          
          <Card className="bg-black/60 backdrop-blur-sm border-green-500/30 shadow-2xl shadow-green-500/10 max-w-2xl mx-auto animate-float">
            <CardHeader className="text-center p-12">
              <CardTitle className="text-5xl font-mono mb-4 text-green-400 tracking-wider">
                MATH IN<br/>COMPUTER SCIENCE
              </CardTitle>
              <CardDescription className="text-xl text-green-300/70 font-mono">
                by Avik Roy
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Introduction */}
        <section id="introduction" className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg transform rotate-1"></div>
              <Card className="bg-black/80 border-green-500/30 relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <CardHeader>
                  <CardTitle className="text-4xl font-mono text-green-400 mb-4">INTRODUCTION</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-green-300 font-mono text-lg leading-relaxed">
					This website is a reflection and guide of the work I have done to explore and discover math within 
					computer science. It will go through the steps I took, to the products I have created and the data 
					I have collected. It focuses on 3 main sections: Runtime Complexity, Algorithms, and Data Structures, 
					which were my main focuses for this project.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="text-center p-4 border border-green-500/30 rounded">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-green-300">Runtime Complexity</p>
                    </div>
                    <div className="text-center p-4 border border-green-500/30 rounded">
                      <Terminal className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-green-300">Algorithms</p>
                    </div>
                    <div className="text-center p-4 border border-green-500/30 rounded">
                      <Database className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-green-300">Data Structures</p>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Section */}
        <section id="why" className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-green-500/20 to-green-400/10 rounded-full flex items-center justify-center animate-pulse">
                    <HelpCircle className="h-24 w-24 text-green-400" />
                  </div>
                  <div className="absolute inset-0 w-48 h-48 border-2 border-green-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                </div>
              </div>
              
              <Card className="bg-black/80 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-3xl font-mono text-green-400">WHY CHOOSE THIS?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-300 font-mono leading-relaxed mb-4">
					Why did I choose computer science? Why not something easy like a sport or game? 
					I chose this because I am really interested in computer science, and I knew that 
					I could definitely apply what I have learned from my Algebra 2 class into this subject. 
					It will also help me build skills for a career, as understanding the mathematics of 
					computer science is crucial for:
                  </p>
                  <ul className="space-y-2 text-green-300 font-mono text-sm">
                    <li className="flex items-center"><Binary className="h-4 w-4 mr-2" /> Algorithm analysis and optimization</li>
                    <li className="flex items-center"><Binary className="h-4 w-4 mr-2" /> Efficient problem-solving strategies</li>
                    <li className="flex items-center"><Binary className="h-4 w-4 mr-2" /> Performance prediction and scaling</li>
                    <li className="flex items-center"><Binary className="h-4 w-4 mr-2" /> System design and architecture</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Brainstorming */}
        <section id="brainstorming" className="min-h-screen flex items-center justify-center p-8">
          <div className="flex flex-col max-w-4xl mx-auto items-center">
            <h2 className="text-4xl font-mono text-green-400 mb-1 text-center">BRAINSTORMING</h2>
			<p className="text-green-300 font-mono text-lg leading-relaxed">
				This is a list of the brainstorming and ideation I did while doing this project. It includes the various topics and
				subjects I considered when I was deciding on what to pursue for the final.
			</p>
			<Button 
                  asChild
                  className="bg-green-500/20 hover:bg-green-500/30 border mb-6 border-green-500/50 text-green-400 font-mono"
                >
                  <a href="https://lwsd-my.sharepoint.com/:w:/g/personal/1104984_lwsd_org/ETsVm69NGWlNitOh3V7d8Z0BZFHn2BmmyiZahgtHH5TdLQ?e=tOUMri" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Word Document
                  </a>
			</Button>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
				<BrainstormingTopic title="Outdoor Activities" items={[
                'Soccer',
                'Basketball', 
                'Hiking',
                'Walking',
                'Badminton',
              ]} />
			<BrainstormingTopic title="Careers" items={[
                'Engineering',
                'Architecture', 
                'Medicine',
                'Chemistry',
                'Biology',
              ]} />
			<BrainstormingTopic title="Games" items={[
                'Monopoly',
                'Poker', 
                'Blackjack',
                'Uno',
                'Minecraft',
              ]} />
			<BrainstormingTopic title="Interests" items={[
                'Computer Science',
                'Nature', 
                'Paleontology',
              ]} />
			</div>
			
          </div>
        </section>

        {/* Planning */}
        <section id="planning" className="min-h-screen flex items-center justify-center p-8">
          <div className="flex flex-col max-w-6xl mx-auto justify-center items-center">
            <h2 className="text-4xl font-mono text-green-400 mb-3 text-center">PLANNING</h2>
			<Button 
				asChild
				className="bg-green-500/20 hover:bg-green-500/30 border mb-8 border-green-500/50 text-green-400 font-mono"
                >
                  <a href="https://lwsd-my.sharepoint.com/:w:/g/personal/1104984_lwsd_org/ERmXbslyDKROixKP0ZcogmgB5QE_3s7QvSwqevRKz6ccog?e=SlJ92h" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Word Document
                  </a>
			</Button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-mono text-green-400 mb-4">Projected Project Timeline</h3>
                <div className="space-y-3">
                  {[
						'Brainstorm ideas',
						'Research runtime complexities to test',
						'Implement complexities with python',
						'Run and graph tests of each complexity',
						'Research simple searching and sorting algorithms',
						'Run and graph tests of each algorithm',
						'Research data structures and analyze mathematics',
						'Create presentation',
						'Create portfolio',
						'(If time) Create runtime calculator',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-black/60 border border-green-500/30 rounded">
                      <Badge variant="outline" className="text-green-400 border-green-500/50 font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </Badge>
                      <p className="text-green-300 font-mono text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Card className="bg-black/80 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-xl font-mono text-green-400">THOUGHTS AND REFLECTION</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-300 font-mono text-sm leading-relaxed">
					This was the outline I gave myself to complete this project. Although I did not follow this 
					completely when working on the project, it definitely helped me organize and keep track of my tasks and duties.
					<br/>
					<br/>
					While this was helpful, I do think that I could have maybe organized it better rather than just a list.
					Future strategies could include having a calendar, more detailed steps/tasks, maybe goals for each day.
                  </p>
				  <img className='mt-4 rounded-lg border-2 border-green-300 transition-transform duration-300 hover:scale-105' src='https://www.bigtime.net/wp-content/uploads/2024/02/Schedule-Conflicts_-How-to-Deal-with-Them-and-Benefit-From-the-Challenge.png'/>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Runtime Complexity Title */}
        <section id="runtime-title" className="min-h-screen flex items-center justify-center relative">
          <ParallaxSection className="absolute inset-0 flex items-center justify-center" offset={0.2}>
            <div className="text-8xl font-mono text-green-500/5 select-none">
              O(n)
            </div>
          </ParallaxSection>
          
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-mono text-green-400 mb-4 tracking-wider">
              00
            </h1>
            <h2 className="text-3xl lg:text-5xl font-mono text-green-300 tracking-wide">
              RUNTIME COMPLEXITY
            </h2>
          </div>
        </section>

        {/* Definition */}
        <section id="definition" className="min-h-screen flex items-center justify-center p-8 gap-5">
          <Card className="max-w-4xl mx-auto bg-black/80 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-4xl font-mono text-green-400 text-center">DEFINITION</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-green-300 font-mono text-lg leading-relaxed text-center mb-6">
                Runtime complexity, also known as time complexity, measures the computational efficiency of an algorithm 
                by analyzing how the execution time grows relative to the input size.
              </p>
              <div className="text-center">
                <code className="bg-gray-900/50 px-4 py-2 rounded border border-green-500/30 text-green-400 font-mono text-xl">
                  T(n) = f(n)
                </code>
                <p className="text-green-300/70 font-mono text-sm mt-2">
                  Where T(n) represents time as a function of input size n
                </p>
              </div>
            </CardContent>
          </Card>
		  <Card className="max-w-4xl mx-auto bg-black/80 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-4xl font-mono text-green-400 text-center">STORY</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-green-300 font-mono leading-relaxed text-sm text-left mb-6">
                This was the first topic I explored for this project and it was the spark
				that inspired me to explore computer science for my final project. I thought
				about how different runtime complexities were so similar to the function families
				and equations we learned about in Algebra 2 that I knew I had to test and discover
				the mathematics within this topic.
              </p>
			  <img className='mt-4 rounded-lg border-2 border-green-300 transition-transform duration-300 hover:scale-105' src='https://miro.medium.com/v2/resize:fit:1400/1*6XK9WML8K65araT8blnGwA.jpeg' />
            </CardContent>
          </Card>
        </section>

        {/* Gallery of Cards */}
        <section id="gallery" className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-mono text-green-400 mb-2 text-center">COMPLEXITY GALLERY</h2>
			<h4 className="text-lg font-mono text-green-300 mb-8 text-center">Click a card to view more details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {runtimeComplexities.map((complexity, index) => (
                <RuntimeCard key={index} {...complexity} />
              ))}
            </div>
          </div>
        </section>

        {/* Algorithms Title */}
        <section id="algorithms-title" className="min-h-screen flex items-center justify-center relative">
          <ParallaxSection className="absolute inset-0 flex items-center justify-center" offset={0.2}>
            <div className="text-8xl font-mono text-green-500/5 select-none">
              Search & Sort
            </div>
          </ParallaxSection>
          
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-mono text-green-400 mb-4 tracking-wider">
              01
            </h1>
            <h2 className="text-3xl lg:text-5xl font-mono text-green-300 tracking-wide">
              ALGORITHMS
            </h2>
          </div>
        </section>

        {/* Searching Algorithms */}
        <section id="searching" className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto">
			<Card className="max-w-4xl mx-auto mb-8 bg-black/80 border-green-500/30">
				<CardHeader>
				<CardTitle className="text-4xl font-mono text-green-400 text-center">STORY</CardTitle>
				</CardHeader>
				<CardContent className="p-8">
				<p className="text-green-300 font-mono leading-relaxed text-sm text-left mb-6">
					After exploring how runtime works with programs, I wanted to apply it deeper
					into computer science. I decided to focus on algorithms, specifically searching
					and sorting algorithms. I chose known ones to implement using Python and tested
					them with inputs. I compared the results and data of my tests with predicted
					measurements, and found very similar outcomes. This really helped show how 
					math really can help me enhance my skills in computer science and proved
					 that runtime complexity is actually true when empirically tested.
				</p>
				<img className='mt-4 rounded-lg border-2 border-green-300 transition-transform duration-300 hover:scale-105' src='https://www.actian.com/wp-content/uploads/2023/11/algorithmic-bias-dark-side-artificial-intelligence.jpg' />
				</CardContent>
			</Card>
            <div className="mb-8">
              <h2 className="text-3xl font-mono text-green-400 mb-4">SEARCHING ALGORITHMS</h2>
              <p className="text-green-300 font-mono">
                Algorithms designed to locate specific elements within data structures efficiently.
              </p>
            </div>
            <AlgorithmCarousel algorithms={searchingAlgorithms} title="Search Methods" />
          </div>
        </section>

        {/* Sorting Algorithms */}
        <section id="sorting" className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-mono text-green-400 mb-4">SORTING ALGORITHMS</h2>
              <p className="text-green-300 font-mono">
                Algorithms that arrange elements in a specific order, fundamental to computer science.
              </p>
            </div>
            <AlgorithmCarousel algorithms={sortingAlgorithms} title="Sort Methods" />
          </div>
        </section>

        {/* Data Structures Title */}
        <section id="data-structures-title" className="min-h-screen flex items-center justify-center relative">
          <ParallaxSection className="absolute inset-0 flex items-center justify-center" offset={0.2}>
            <div className="text-8xl font-mono text-green-500/5 select-none">
              []
            </div>
          </ParallaxSection>
          
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-mono text-green-400 mb-4 tracking-wider">
              02
            </h1>
            <h2 className="text-3xl lg:text-5xl font-mono text-green-300 tracking-wide">
              DATA STRUCTURES
            </h2>
          </div>
        </section>

        {/* Data Structures Definition */}
        <section id="structures-def" className="min-h-screen flex items-center justify-center p-8">
          <Card className="max-w-4xl mx-auto bg-black/80 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-4xl font-mono text-green-400 text-center">DATA STRUCTURES</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-green-300 font-mono text-lg leading-relaxed text-center">
                Data structures are specialized formats for organizing, processing, retrieving and storing data. 
                They provide efficient ways to access and modify data based on specific use cases and requirements.
              </p>
            </CardContent>
          </Card>
		  <Card className="max-w-4xl mx-auto mb-8 bg-black/80 border-green-500/30">
				<CardHeader>
				<CardTitle className="text-4xl font-mono text-green-400 text-center">STORY</CardTitle>
				</CardHeader>
				<CardContent className="p-8">
				<p className="text-green-300 font-mono leading-relaxed text-sm text-left mb-6">
					This section shows I explored more complex topics within computer science that
					I could apply Algebra 2 to. The topic I chose was data structures, a fundemental
					of computer science. The data structures I chose were binary trees, linked lists,
					and 2D arrays. These were all structures that I thought could be modeled using
					an algebraic function.
				</p>
				<img className='mt-4 rounded-lg border-2 border-green-300 transition-transform duration-300 hover:scale-105' src='https://staging.herovired.com/wp-content/uploads/2023/03/what-is-data-structure-1.webp' />
				</CardContent>
			</Card>
        </section>

        {/* Parallax Section with Examples */}
        <section id="parallax-section" className="py-16">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-4xl font-mono text-green-400 text-center mb-16">DATA STRUCTURE EXAMPLES</h2>
            
            <div className="">
              {[
                {
                  name: 'Balanced Binary Tree',
                  description: 'Hierarchical structure with nodes connected by edges, used for efficient searching and sorting.',
                  code: `class Node():
	def __init__(self, left=None, right=None):
		if not left:
			left = Node()
		if not right:
			right = Node()
		self.left = left
		self.right = right`,
				  picture: "./static/pictures/structures/tree.png",
				  function: "Function: f(n) = 2^n (where n is levels in the tree)",
				  graph: "./static/pictures/structures/tree_func.png",
                },
                {
                  name: 'Linked Lists',
                  description: 'Dynamic data structure with nodes containing data and pointers to next elements.',
                  code: `class Node():
	def __init__(self, next=None):
		self.next = next`,
				  picture: "./static/pictures/structures/list.png",
				  function: "Function: f(n) = n (where n is number of nodes in list)",
				  graph: "./static/pictures/structures/list_func.png",
                },
                {
                  name: '2D Array',
                  description: 'Array that contains multiple arrays inside, forming a row column structure which when visually represented, forms a 2D grid.',
                  code: `class Array_2D():
	def __init__(self, rows=1, columns=1):
		self.list = [[0*columns]*rows]`,
				  picture: "./static/pictures/structures/array.png",
				  function: "f(n) = kn (where n is rows and k is columns)",
				  graph: "./static/pictures/structures/array_func.png",
                }
              ].map((structure, index) => (
                <ParallaxSection key={structure.name} offset={0.1}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <Card className="bg-black/80 border-green-500/30 ">
                      <CardHeader>
                        <CardTitle className="text-2xl font-mono text-green-400">{structure.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        <p className="text-green-300 font-mono text-sm mb-4 leading-relaxed">
                          {structure.description}
                        </p>
                        <div className="bg-gray-900/50 p-4 rounded border border-green-500/30">
                          <code className="text-green-400 font-mono text-xs">
                            {structure.code}
                          </code>
                        </div>
						<p className="text-md font-mono text-green-300">
							{structure.function}
						</p>
						<img className='max-h-80 object-contain mt-4 rounded-lg border-2 border-green-300 transition-transform duration-300 hover:scale-105 inline' src={structure.graph} />
                      </CardContent>
                    </Card>
                    
                    <div className="bg-gray-900/50 p-8 rounded border border-green-500/30 flex items-center justify-center h-48">
                      <img className='h-auto mt-4 rounded-lg border-2 border-green-300 transition-transform duration-300 hover:scale-105 inline' src={structure.picture} />
                    </div>
                  </div>
                </ParallaxSection>
              ))}
            </div>
          </div>
        </section>

        {/* Work Log Table */}
        <section id="work-log" className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-mono text-green-400 mb-8 text-center">WORK LOG</h2>
            <Card className="bg-black/80 border-green-500/30">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-500/30">
                        <TableHead className="text-green-400 font-mono">Date</TableHead>
                        <TableHead className="text-green-400 font-mono">Task</TableHead>
                        <TableHead className="text-green-400 font-mono">Hours</TableHead>
                        <TableHead className="text-green-400 font-mono">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workLogData.map((entry, index) => (
                        <TableRow key={index} className="border-green-500/30">
                          <TableCell className="text-green-300 font-mono">{entry.date}</TableCell>
                          <TableCell className="text-green-300 font-mono">{entry.task}</TableCell>
                          <TableCell className="text-green-300 font-mono">{entry.hours}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`font-mono text-xs ${
                                entry.status === 'Complete' ? 'text-green-400 border-green-500/50' :
                                entry.status === 'In Progress' ? 'text-yellow-400 border-yellow-500/50' :
                                'text-gray-400 border-gray-500/50'
                              }`}
                            >
                              {entry.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Reflection */}
        <section id="reflection" className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto flex flex-col justify-center items-center">
            <h2 className="text-4xl font-mono text-green-400 mb-2 text-center">REFLECTION</h2>
			<Button 
                  asChild
                  className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 font-mono m-4"
                >
                  <a href="https://lwsd-my.sharepoint.com/:w:/g/personal/1104984_lwsd_org/ESe3S6M6YRBAqJAYsqxv8RQBvLpVm1F8Qi4Lv4CigajY6A?e=ZDZhBG" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Word Doc
                  </a>
                </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Card className="bg-black/80 border-green-500/30 cursor-pointer hover:border-green-400/50 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-12 text-center">
                    <h3 className="text-2xl font-mono text-green-400 mb-4">Click to Read Full Reflection</h3>
                    <p className="text-green-300 font-mono text-sm">
                      "For my final project, I decided to explore how math is embedded into computer science. Specifically, how has what I learned from this year in Algebra 2 Honors impacted how I see aspects of computer science..."
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-green-500/30 text-green-400 overflow-hidden">
                <DialogHeader className="pb-4">
                  <DialogTitle className="font-mono text-2xl">PROJECT REFLECTION</DialogTitle>
                </DialogHeader>
				
                <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                  <div className="space-y-4 text-green-300 font-mono text-sm leading-relaxed">
                    <p>
                      For my final project, I decided to explore how math is embedded into computer science. Specifically, how has what I learned from this year in Algebra 2 Honors impacted how I see aspects of computer science. Some detailed subjects I focused on were runtime complexity, searching and sorting algorithms, and data structures.
                    </p>
                    <p>
                      Computer science has been my passion for a while, since I was introduced to it at the age of eight. When I first learned about this project, I knew from the start I wanted to find something within computer science that related to topics within algebra. It would also be a great opportunity for me to apply and learn more about a topic that I am interested in and marry it with a subject that I am learning.
                    </p>
                    <p>
                      To plan this project out I first created a simple schedule/task list that I could utilize to monitor and guide my progress. It included goals and objectives I needed to complete as well as soft deadlines for each task. It was helpful for me to just have a sense of what to do and not be in the complete dark while working on this project. As I worked, I tweaked a few things and went more in depth with certain goals that I wanted to achieve, but mainly for my own success. This was because I just wanted more clarity and detail when working and having a place to write down my thoughts was important for organization. 
                    </p>
                    <p>
                      For this project, the class time provided was spent mostly ideating and getting my peers’ thoughts and input on different aspects of my project, as well as asking Mr. Scheffel himself to provide feedback on ideas I had. It was a good place for planning and thinking, with some work on the programming of runtime functions done at the tail end of the periods.
                    </p>
                    <p>
                     The work I have done for this project connects to our algebra class as it showcases how multiple different function families integrate and interact with aspects of computer science in interesting ways. For example, many different types of functions such as linear, quadratic, and logarithmic are represented by runtime complexities. I think the mathematical standards of modeling with mathematics and look for and make use of structure contributed most to my project.
                    </p>
                    <p>
                      I achieved most of the goals and tasks I set out to do such as exploring runtime and algorithms, as well as data structures and the math behind them. I also successfully created a runtime calculator as I planned to, which I found was a nice capstone for this final project. However, I could have done more such as dove deeper into more complex topics, explored some of my own functions and algorithms that I have written and measure and graph their runtime, as well as polish up and add more features to the runtime calculator like a graphing tool, comparison feature, or smart suggestions.
                    </p>
                    <p>
                      The feedback I received for my presentation was mostly positive, with many liking my topic choice and detail I presented with. However, I did lack communication and time-management with my presentation, something I want to improve in the future. For future endeavors, refining my rehearsal and presentation slides would be best because I had a lot of content to cover and not a lot of time. Creating more concise slides that summarized the topics or just featured one interesting thing would be better for the future.
                    </p>
					<p>
						For future classes, one thing I would change for this project is the amount of time. For what was expected, the amount of class time given wasn’t adequate for most and I feel that people could have really benefited from having a work week, and then revision/feedback days where people could peer review each other’s projects. Also, having more prominent check-ins for the project would also just be a benefit for people who are struggling/need help to find the right track.
					</p>
					<p>
						I am proud of what I have turned in for this assignment. It reflects my best work within one and a half weeks and gives me room to improve for the future. In conclusion, this project enhanced my Algebra 2 experience and made me improve as a learner and gave me something new about my passion.
					</p>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Runtime Calculator Tool */}
        <section id="calculator" className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-mono text-green-400 mb-8">RUNTIME CALCULATOR</h2>
            <Card className="bg-black/80 border-green-500/30 p-8">
              <CardContent className="space-y-6">
                <div className="bg-gray-900/50 p-12 rounded border border-green-500/30">
                  <Calculator className="h-24 w-24 mx-auto text-green-400 mb-4" />
                  <p className="text-green-300 font-mono text-lg mb-6">
                    Interactive Runtime Complexity Calculator
                  </p>
                  <p className="text-green-300/70 font-mono text-sm mb-6">
                    Analyze and visualize algorithm performance metrics
                  </p>
                </div>
                <Button 
                  asChild
                  className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 font-mono"
                >
                  <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Launch Calculator Tool
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}