import PopupNoticeImage from "@/components/PopupNoticeImage";
import PopupNoticeText from "@/components/PopupNoticeText";
import PopupNoticeTextImage from "@/components/PopupNoticeTextImage";
import Notice from "@/models/Notice";
import React from "react";

function createNoticePopup(props: { notice: Notice; navigation; hide }) {
  switch (props?.notice?.type) {
    case "TXT":
      return <PopupNoticeText {...props} />;
    case "IMG":
      return <PopupNoticeImage {...props} />;
    case "TXTIMG":
      return <PopupNoticeTextImage {...props} />;
  }
}

export { createNoticePopup };
