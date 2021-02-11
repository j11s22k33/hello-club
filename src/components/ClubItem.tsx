import Club from "@/models/Club";

interface ClubItemProps {
  club: Club;
}

const ClubItem: React.FC<ClubItemProps> = ({ club }) => {
  return (
    <li data-id={club.id}>
      <div className="inner">
        <div className="thumbnail">
          <div className="club-text">
            <p className="channel">{club.channel}</p>
            <p
              className="logo"
              style={{ backgroundImage: `url(${club.logo})` }}
            ></p>
          </div>
          {club.bg ? (
            <div
              className="img dim"
              style={{
                backgroundImage: `url(${club?.bg})`,
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
