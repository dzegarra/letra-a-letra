export const bytesToPdf = (obj: Uint8Array, filename: string) => {
  const blob = new Blob([obj], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};
