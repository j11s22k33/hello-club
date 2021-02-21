import Notice from "@/models/Notice";

interface NoticeItemProps {
  notice: Notice;
}

const ClubItem: React.FC<NoticeItemProps> = ({ notice }) => {
  return (
    <li data-id={notice.ID}>
      <p className="title">
        {notice.label && <em>{notice.label}</em>}
        {notice.TITLE}
      </p>
      <p className="date">{notice.DATE}</p>
    </li>
  );
};

export default ClubItem;
