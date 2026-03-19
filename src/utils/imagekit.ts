// // src/utils/imagekit.ts
// export const getProductImageUrl = (url: string, options?: {
//   width?: number;
//   height?: number;
//   bgRemove?: boolean;
//   shadow?: boolean;
// }) => {
//   const { width = 400, height = 400, bgRemove = false, shadow = false } = options ?? {};
  
//   const transforms = [
//     `w-${width}`,
//     `h-${height}`,
//     `c-at_max`,
//     `fo-auto`,
//     `q-80`,
//     bgRemove && `e-bgremove`,
//     shadow && `e-dropshadow`,
//   ].filter(Boolean).join(",");

//   return `${url}?tr=${transforms}`;
// };



export const getProductImageUrl = (url: string, options?: {
  width?: number;
  height?: number;
}) => {
  if (!url) return url;
  const { width = 400, height = 400 } = options ?? {};
  
  const transforms = [
    `w-${width}`,
    `h-${height}`,
    `c-at_max`,
    `fo-auto`,
    `q-80`,
  ].join(",");

  return `${url}?tr=${transforms}`;
};