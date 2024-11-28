/* eslint-disable @typescript-eslint/no-explicit-any */

interface Window {
  /** 防抖 */
  debounce(fn: (...args: any) => void, wait?: number): () => void;
  /** 节流 */
  throttle(fn: any, delay?: any): (...args: any[]) => any;
  trapFocus(container: any, elementToFocus?: any): void;
  removeTrapFocus(elementToFocus?: HTMLElement | null): void;
  Shopify: Shopify;
  relevancePickerRecord: Map<string, string>;
  sleep: (wait = 100) => Promise<void>;
  customHistory: {push: (url: string, replace = false, position: any) => void};
}

interface Shopify {
  /** 编辑模式 */
  designMode: boolean;
}
