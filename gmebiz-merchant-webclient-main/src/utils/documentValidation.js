const handleDocumentValidation = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxSizeKB = Number(process.env.NEXT_PUBLIC_DOCUMENT_LIMIT) * 1024 ?? 5120;

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPG, PNG, or PDF files are allowed';
  }

  if (file.size > maxSizeKB * 1024) {
    return `File size exceeds ${maxSizeKB/1024} MB`;
  }

  return true;
}

export default handleDocumentValidation;
