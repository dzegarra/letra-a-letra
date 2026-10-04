export const pickFile = (onSelectFile: (files: FileList | null) => void, accept?: string) => {
  const btn = document.createElement("input");
  btn.type = "file";
  if (accept) btn.accept = accept;
  btn.addEventListener("change", async function () {
    onSelectFile(this.files);
  });
  btn.click();
};
