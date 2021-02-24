import Content from "@/models/Content";

const size = 27
const contents: Array<Content> = new Array(size)

for(let x=0; x<size; x++) {
  contents[x] = {
    ID: x+1,
    TITLE: `${x+1} > 아침에 삼겹살 먹어도 맛있다. 식은 치킨도 맛있다. 간식은 필수. 새벽에 먹는 라면은 살이 안찐다.`,
    POSTER_IMG: "/images/club/img-main-default.png",
  }
}

export default contents;
