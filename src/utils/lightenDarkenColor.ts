const lightenDarkenColor = (hex: string, amount?: number) => {
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length === 6) {
    hex = hex[0] + hex[1] + hex[2] + hex[3] + hex[4] + hex[5];
  }
  amount = amount || 0;

  let rgb = "#";
  let c: any;
  for (let i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * amount), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
};
export default lightenDarkenColor;
