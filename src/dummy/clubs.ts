import Club from "@/models/Club";

function createClubs(size:number, params) {
  const clubs: Array<Club> = new Array(size)

  for(let x=0; x<size; x++) {
    clubs[x] = {
      ID: x,
      NAME: `CH.${x}`,
      BG_IMG: "/images/club/img-main-default.png",
      LOGO_IMG: `/images/temp/logo${x % 4 + 1}.png`,
    }
  }

  return clubs.slice(params.OFFSET, params.OFFSET+params.LIMIT)
}

export default {
  createClubs
};
