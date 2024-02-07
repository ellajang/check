export default function (files, multiple) {
  return new Promise((resolve, reject) => {
    if (!multiple) {
      files = [files]
    }
    const convertedFiles = []

    const onLoadFunc = (reader, file) => {
      convertedFiles.push({
        base64: reader.result.split(',')[1],
        name: file.name,
        size: file.size,
        type: file.type
      })

      if (convertedFiles.length === files.length) {
        resolve(multiple ? convertedFiles : convertedFiles[0])
      }
    }

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      if (files[i]) {
        reader.readAsDataURL(files[i])
      }
      reader.onload = () => onLoadFunc(reader, files[i])
      reader.onerror = error => reject(error)
    }
  })
}
