import Content from "@/models/Content";

interface ContentItemProps {
  content: Content;
  naviIgnore: boolean;
}

const ClubItem: React.FC<ContentItemProps> = ({ content, naviIgnore }) => {
  return (
    <li data-id={content.id} className={naviIgnore ? "navi-ignore" : ""}>
      <div className="inner">
        <div className="thumbnail">
          {content.imgUrl ? (
            <div
              className="img"
              style={{ backgroundImage: `url(${content.imgUrl})` }}
            ></div>
          ) : (
            <div className="img"></div>
          )}
        </div>
        <div className="title">
          <p>{content.title}</p>
        </div>
      </div>
    </li>
  );
};

export default ClubItem;
