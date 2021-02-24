import ContentCategory from "@/models/ContentCategory";

const size = 5
const data: Array<ContentCategory> = new Array(size)

for (let x = 0; x < size; x++) {
  data[x] = {
    CATE_ID: `cate_id_${x}`,
    NAME: `${x} > 카테고리`
  }  
}

export default data