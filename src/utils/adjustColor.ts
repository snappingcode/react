const adjustColor = (color: string, amount: number) => {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);

  let r = Math.min(255, Math.max(0, (num >> 16) + amount));
  let g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  let b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));

  let newColor: any = (r << 16) | (g << 8) | b;
  let newColorStr = newColor.toString(16).padStart(6, "0");

  return (usePound ? "#" : "") + newColorStr;
};
export default adjustColor;
