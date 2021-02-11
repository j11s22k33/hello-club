import Content from "@/models/Content";

interface ContentItemProps {
  content: Content;
}

const ClubItem: React.FC<ContentItemProps> = ({ content }) => {
  return (
    <li data-id={content.id}>
      <div className="inner">
        <div className="thumbnail">
          {content.bg ? (
            <div
              className="img"
              style={{ backgroundImage: `url(${content.bg})` }}
            ></div>
          ) : (
            <div className="img"></div>
          )}
        </div>
        <div className="title">
          <p>{content.title}</p>
          <p>
            <em>{content.description}</em>
          </p>
        </div>
      </div>
    </li>
  );
};

export default ClubItem;
