import { text } from './modes/text';
import { count } from './modes/count';

const modes = { text, count } as const;

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type modeValues = {
  [Property in keyof typeof modes]: Expand<
    {
      mode: Property;
      // @ts-ignore
    } & Parameters<InstanceType<typeof modes[Property]>['execute']>[0]
  >;
};
export type collectorConfig = modeValues[keyof modeValues];

export function executeCollector(config: collectorConfig): number {
  return new modes[config.mode]().getProgress(config as any);
}
