import { DocumentType } from "../../../services/documentService";
import { Button } from "../button/Button";

interface DocumentCardProps {
  document: DocumentType;
  onDownload: () => void;
  onDelete: () => void;
}

export const DocumentCard = ({
  document,
  onDownload,
  onDelete,
}: DocumentCardProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("image")) return "🖼️";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("excel")) return "📊";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-3xl">
          {getFileIcon(document.fileType)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {document.fileName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatFileSize(document.fileSize)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Uploaded on {new Date(document.uploadDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          className="text-brand-600 hover:text-brand-700"
        >
          Download
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
