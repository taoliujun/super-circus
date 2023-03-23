/**
 * 加载调试器
 */
export const loadConsoleScript = (): void => {
  const debug = window.location.search.indexOf('debug=1') !== -1;

  if (debug) {
    const script = document.createElement('script');
    script.src = 'https://cdn.bootcdn.net/ajax/libs/eruda/2.4.1/eruda.min.js';
    document.body.appendChild(script);
    script.onload = () => {
      eruda?.init();
    };
  }
};
