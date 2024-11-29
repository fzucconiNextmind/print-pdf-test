export function encodeSvgString(svg: string) {
  const decoded = unescape(encodeURIComponent(svg));
  const b64String = btoa(decoded);
  const imgSource = `data:image/svg+xml;base64,${b64String}`;
  return imgSource;
}

export function svgToDataURI(
  svgData: string,
  renderWidth: number,
  renderHeight: number
) {
  const id = `canvas-id-${Math.random()}`;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", id);
  canvas.setAttribute("style", "display: none");

  document.body.appendChild(canvas);

  canvas.width = renderWidth;
  canvas.height = renderHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("no canvas 2d context");
  }

  const img = document.createElement("img");
  img.setAttribute("src", encodeSvgString(svgData));

  return new Promise((res) => {
    img.onload = function load() {
      ctx.drawImage(img, 0, 0, renderWidth, renderHeight);
      const url = canvas.toDataURL("image/jpeg", 1.0);
      const el = document.getElementById(id);
      if (el) el.remove();

      res(url);
    };
  });
}
