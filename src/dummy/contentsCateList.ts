import ContentCategory from "@/models/ContentCategory";

const size = 5
const data: Array<ContentCategory> = new Array(size)

for (let x = 0; x < size; x++) {
  data[x] = {
    cateId: `CATE_${x}`,
    cateName: `CATE_${x}`
  }  
}

export default data