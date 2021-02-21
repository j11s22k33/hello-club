import Club from "@/models/Club";

interface ClubItemProps {
  club: Club;
}

const ClubItem: React.FC<ClubItemProps> = ({ club }) => {
  return (
    <li data-id={club.ID}>
      <div className="inner">
        <div className="thumbnail">
          <div className="club-text">
            <p className="channel">{club.NAME}</p>
            <p
              className="logo"
              style={{ backgroundImage: `url(${club.LOGO_IMG})` }}
            ></p>
          </div>
          {club.BG_IMG ? (
            <div
              className="img dim"
              style={{
                backgroundImage: `url(${club?.BG_IMG})`,
              }}
            ></div>
          ) : (
            <div className="img dim"></div>
          )}
        </div>
      </div>
    </li>
  );
};

export default ClubItem;
