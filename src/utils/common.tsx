import PopupNoticeText from "@/components/PopupNoticeText";
import PopupNoticeTextImage from "@/components/PopupNoticeTextImage";
import Notice from "@/models/Notice";
import React from "react";

function createNoticePopup(props: { notice: Notice; navigation; hide }) {
  switch (props?.notice?.TYPE) {
    case 100:
      return <PopupNoticeText {...props} />;
    case 200:
      return <PopupNoticeText {...props} />;
    case 300:
      return <PopupNoticeTextImage {...props} />;
  }
}

export { createNoticePopup };
