export function base64toFileUrl(base64String) {
  try {
    const binaryString = atob(base64String);
    const blobArray = [];
    for (let i = 0; i < binaryString.length; i++) {
      blobArray.push(binaryString.charCodeAt(i));
    }
    const blob =  new Blob([new Uint8Array(blobArray)], { type: 'application/octet-stream' })

    return `data:${blob.type};base64,${base64String}`;
  } catch (e){
  }
}
