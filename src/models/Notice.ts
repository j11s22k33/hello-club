export type NoticeType = "TEXT" | "IMAGE" | "TEXT_IMAGE";

interface Notice {
  id: number;
  label?: string;
  title: string;
  date: string;
  type: NoticeType;
}

export default Notice;
