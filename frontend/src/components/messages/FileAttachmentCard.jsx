import { Download, FileText, TableProperties, FileArchive, File } from 'lucide-react';
import { formatFileSize } from '../../data/mockData';

const FILE_CONFIG = {
  'application/pdf': {
    bg: '#FEE2E2',
    Icon: FileText,
    iconColor: '#EF4444',
    label: 'PDF Document',
  },
  default_sheet: {
    bg: '#DBEAFE',
    Icon: TableProperties,
    iconColor: '#2563EB',
    label: 'Dataset',
  },
  'application/zip': {
    bg: '#EDE9FE',
    Icon: FileArchive,
    iconColor: '#4F46E5',
    label: 'Archive',
  },
};

function getConfig(fileType) {
  const normalizedType = fileType?.toLowerCase() || '';
  if (normalizedType === 'application/pdf' || normalizedType === 'pdf') return FILE_CONFIG['application/pdf'];
  if (normalizedType.includes('spreadsheet') || normalizedType.includes('excel') || normalizedType.includes('csv'))
    return FILE_CONFIG['default_sheet'];
  if (normalizedType === 'application/zip' || normalizedType === 'zip') return FILE_CONFIG['application/zip'];
  return { bg: '#F1F5F9', Icon: File, iconColor: '#475569', label: 'File' };
}

export default function FileAttachmentCard({ attachment }) {
  const fileName = attachment.fileName || attachment.filename || attachment.original_filename || 'Attached File';
  const fileSizeBytes = attachment.fileSizeBytes || attachment.fileSize || attachment.size || attachment.bytes || 0;
  const fileType = attachment.fileType || attachment.mimeType || attachment.format || '';
  const cdnUrl = attachment.cdnUrl || attachment.url || attachment.fileUrl || attachment.secure_url || '#';
  const { bg, Icon, iconColor, label } = getConfig(fileType);

  const handleDownload = (e) => {
    e.stopPropagation();
    if (cdnUrl && cdnUrl !== '#') {
      window.open(cdnUrl, '_blank');
    }
  };

  return (
    <div
      onClick={handleDownload}
      className="attach-card hover-3d-lift flex items-center gap-3 p-3 bg-white border border-[#E2E8F0]
        rounded-xl cursor-pointer group min-w-0 max-w-full"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: bg }}
      >
        <Icon size={20} color={iconColor} />
      </div>

      <div className="attach-content flex-1 overflow-hidden">
        <p className="text-sm font-semibold text-[#0F172A] truncate">{fileName}</p>
        <p className="text-xs text-[#475569]">
          {formatFileSize(fileSizeBytes)} • {label}
        </p>
      </div>

      <Download
        size={18}
        className="dl-icon text-[#94A3B8] group-hover:text-[#2563EB] transition-colors flex-shrink-0"
      />
    </div>

  );
}
