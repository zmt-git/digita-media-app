export async function getImageInfo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    function handleLoad() {
      const img = new Image();

      img.src = this.result;
      resolve({ file, width: img.width, height: img.height });
      console.log({ file, width: img.width, height: img.height });
      removeListener();
    }

    function handleError(error) {
      reject(error);
      removeListener();
    }

    function removeListener() {
      reader.removeEventListener("loadend", handleLoad);
      reader.removeEventListener("error", handleError);
    }

    reader.addEventListener("loadend", handleLoad);
    reader.addEventListener("error", handleError);
  });
}
