import { useMessaging } from '../../context/MessagingContext';
import { CURRENT_USER, formatMsgTime } from '../../data/mockData';
import FileAttachmentCard from './FileAttachmentCard';
import Avatar from '../ui/Avatar';

export default function MessageBubble({ message, animDelay = 0 }) {
  const { activeConversationId, currentUserId } = useMessaging();
  const isMine = 
    message.senderId === currentUserId || 
    message.senderId?._id === currentUserId ||
    message.senderId === CURRENT_USER.id ||
    message.senderId?._id === CURRENT_USER.id;
  const time = formatMsgTime(message.createdAt);

  return (
    <div
      className={`flex ${isMine ? 'flex-col items-end ml-auto' : 'items-end gap-3'} max-w-[80%] anim-msg-stagger-in`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Dusre user ki DP (Avatar) */}
      {!isMine && (
        <Avatar
          user={message.senderId}
          src={message.senderAvatarUrl || message.senderId?.profileImage}
          name={message.senderName || message.senderId?.fullName || message.senderId?.firstName}
          size="sm"
          className="shadow-sm"
        />
      )}

      <div className={isMine ? 'flex flex-col items-end gap-1 min-w-0 max-w-full' : 'min-w-0 max-w-full'}>
        {/* Message ka dabba (Bubble) */}
        <div
          className={`px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.1)] max-w-full relative
            ${isMine
              ? 'bg-[#2563EB] text-white rounded-2xl rounded-tr-none'
              : 'bg-white border border-[#E8EDF5] text-[#111b21] rounded-2xl rounded-tl-none'
            }`}
        >
          {(message.content || message.text || message.message) && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content || message.text || message.message}</p>
          )}

          {(message.attachments?.length > 0 || message.attachment || message.attachmentId) && (
            <div className="mt-3 space-y-2 min-w-0 max-w-full">
              {(message.attachment || message.attachmentId) && (
                <FileAttachmentCard 
                  key={(message.attachment || message.attachmentId)._id || (message.attachment || message.attachmentId).id || 'att'} 
                  attachment={message.attachment || message.attachmentId} 
                />
              )}
              {message.attachments?.map((a) => (
                <FileAttachmentCard key={a._id || a.id} attachment={a} />
              ))}
            </div>
          )}

          {!isMine && (
            <div className="flex justify-end mt-1">
              <span className="text-[10px] text-[#667781] leading-none">{time}</span>
            </div>
          )}
        </div>

        {/* Message bhejne ka time aur padha gaya ya nahi (Read receipt) */}
        {isMine && (
          <div className="flex items-center gap-1 mr-1 mt-0.5">
            {message.pending ? (
              <span className="text-[10px] text-[#94A3B8] italic anim-gentle-pulse">Sending…</span>
            ) : (
              <>
                <span className="text-[10px] text-[#94A3B8] leading-none">{time}</span>
                {message.readAt && (
                  <span className="text-[10px] text-[#2563EB] font-bold leading-none ml-1">✓✓</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
