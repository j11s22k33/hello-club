import Content from "@/models/Content";

function createContents(size: number, params) {
  const contents: Array<Content> = new Array(size);

  for (let x = 0; x < size; x++) {
    contents[x] = {
      id: x,
      title: `[${x}][${params.cateId}] 아침에 삼겹살 먹어도 맛있다. 식은 치킨도 맛있다. 간식은 필수. 새벽에 먹는 라면은 살이 안찐다.`,
      imgUrl: "/images/club/img-main-default.png",
      contentsType: "ASSET",
      date: "20210306",
    };
  }

  return contents.slice(params.offset, params.offset + params.limit);
}

export default {
  createContents,
};
