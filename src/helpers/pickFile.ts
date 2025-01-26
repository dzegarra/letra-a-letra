export const pickFile = (onSelectFile: (files: FileList | null) => void) => {
  const btn = document.createElement("input");
  btn.type = "file";
  btn.addEventListener("change", async function () {
    onSelectFile(this.files);
  });
  btn.click();
};
