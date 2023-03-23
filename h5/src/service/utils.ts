/** 延时 */
export const delay = (time: number) => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, time);
  });
};
