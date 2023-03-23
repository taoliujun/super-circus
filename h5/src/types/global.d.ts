declare module '*.css';
declare module '*.less';

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.webp';
declare module '*.gif';

declare module '*.md';

declare namespace eruda {
  function init(): void;
}

interface Window {
  wx: any;
}
