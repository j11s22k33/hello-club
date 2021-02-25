import ContentCategory from "@/models/ContentCategory";

const size = 5
const data: Array<ContentCategory> = new Array(size)

for (let x = 0; x < size; x++) {
  data[x] = {
    CATE_ID: `CATE_${x}`,
    NAME: `CATE_${x}`
  }  
}

export default data