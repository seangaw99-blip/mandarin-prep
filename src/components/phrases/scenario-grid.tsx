'use client';

import Link from 'next/link';

interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

interface ScenarioGridProps {
  scenarios: Scenario[];
}

export default function ScenarioGrid({ scenarios }: ScenarioGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {scenarios.map((scenario) => (
        <div
          key={scenario.id}
          className="active:scale-[0.96] transition-transform"
        >
          <Link
            href={`/phrases/${scenario.id}`}
            className="block bg-card rounded-xl p-4 text-center hover:bg-border/30 transition-colors"
          >
            <span className="text-3xl block mb-2">{scenario.icon}</span>
            <h3 className="text-sm font-semibold text-card-foreground">
              {scenario.name}
            </h3>
            <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {scenario.count} phrases
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
