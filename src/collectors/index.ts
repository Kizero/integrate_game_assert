/**
 * 收集器索引 - Collectors Index
 * 导出所有可用的素材收集器
 */

export { BaseCollector, CollectorSource, CollectedAsset } from './base-collector.js';
export { OpenGameArtCollector } from './opengameart-collector.js';
export { ItchCollector } from './itch-collector.js';

import { BaseCollector } from './base-collector.js';
import { OpenGameArtCollector } from './opengameart-collector.js';
import { ItchCollector } from './itch-collector.js';

/**
 * 所有可用的收集器
 */
export const AvailableCollectors: Record<string, typeof BaseCollector> = {
  opengameart: OpenGameArtCollector,
  itch: ItchCollector,
};

/**
 * 创建收集器实例
 */
export function createCollector(name: string): BaseCollector {
  const CollectorClass = AvailableCollectors[name.toLowerCase()];
  if (!CollectorClass) {
    throw new Error(`未知的收集器: ${name}`);
  }
  return new CollectorClass();
}

/**
 * 获取所有收集器的信息
 */
export function listCollectors() {
  return Object.keys(AvailableCollectors).map(name => {
    const collector = createCollector(name);
    return collector.getSource();
  });
}
