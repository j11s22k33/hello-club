import PopupImage from "@/components/PopupImage"
import PopupText from "@/components/PopupText"
import PopupTextImage from "@/components/PopupTextImage"
import React from "react"

function createNoticePopup(props: {notice, navigation, hide}) {
    switch(props?.notice?.type) {
      case 'TEXT':
        return <PopupText {...props} />
      case 'IMAGE':
        return <PopupImage {...props} />
      case 'TEXT_IMAGE':
        return <PopupTextImage {...props} />
    }
}

export {
    createNoticePopup
}