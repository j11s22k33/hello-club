import Content from "@/models/Content";

interface ContentItemProps {
  content: Content;
}

const ClubItem: React.FC<ContentItemProps> = ({ content }) => {
  return (
    <li data-id={content.ID}>
      <div className="inner">
        <div className="thumbnail">
          {content.POSTER_IMG ? (
            <div
              className="img"
              style={{ backgroundImage: `url(${content.POSTER_IMG})` }}
            ></div>
          ) : (
            <div className="img"></div>
          )}
        </div>
        <div className="title">
          <p>{content.TITLE}</p>
        </div>
      </div>
    </li>
  );
};

export default ClubItem;
