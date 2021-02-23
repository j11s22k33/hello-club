import Notice from "@/models/Notice";

interface NoticeItemProps {
  notice: Notice;
}

const ClubItem: React.FC<NoticeItemProps> = ({ notice }) => {
  return (
    <li data-id={notice.id}>
      <p className="title">
        {notice.title}
      </p>
      <p className="date">{notice.date}</p>
    </li>
  );
};

export default ClubItem;
