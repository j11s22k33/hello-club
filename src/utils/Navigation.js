/**
 * 임의수정 금지
 * LG HelloVision 미디어기술팀 신현승 (bbakbbak@lghv.net)
 */

class Navigation {
  constructor() {}

  /**
   * 초기 세팅
   * Layer {
   *      id: 'layer-id',
   *      sections: [
   *          {
   *              id: 'section-id',
   *              axis: {x:0, y:0},
   *              options: {
   *                  start:true,
   *                  cols:1
   *              },
   *              direction: {
   *                  left(section){
   *                      Navigation.go(section.id, {x:0, y:0}, true)
   *                  },
   *                  right(section){
   *
   *                  },
   *                  down: {
   *                      id: 'next-section-id',
   *                      axis: {x:0, y:0},
   *                      selected: true,
   *                  }
   *              },
   *              focus(section) {},
   *              back(section) {},
   *              enter(section) {},
   *              keydown(section, event) { return true },
   *              entry(section) {},
   *              leave(section) {},
   *          }
   *      ]
   * }
   */
  //네비 초기화
  set(layer) {
    console.log("[Navigation] 초기화");
    this.ignoreClass = "navi-ignore"; //네비에서 제외시킨다
    this.selectedClass = "selected";
    this.focusClass = "focus";
    this.navigation = []; // Layer 저장
    this.history = []; // 이전 Layer focusSection 저장
    this.prevFocusSection = null; // 이전 포커스Section
    this.focusSection = null; // 포커스Section
    this.prevFocusItem = null; // 이전 포커스Item
    this.focusItem = null; // Element
    this.key = ""; // 현재 입력된 키. event.key
    this.prevent = false; //키 이벤트 차단/해제

    this.navigation.push(layer);

    layer.sections.forEach((section) => {
      if (document.getElementById(section.id)) {
        this.setItems(section);

        if (section.options && section.options.start) {
          section.options.axis
            ? this.go(section.id, section.options.axis)
            : this.go(section.id);
        }
      }
    });

    document.onkeydown = (event) => {
      console.log(`[Navigation] onkeydown %o`, event);
      if (event.key == "F5" || event.key == "F12") return;

      event.stopImmediatePropagation && event.stopImmediatePropagation();
      event.stopPropagation && event.stopPropagation();
      event.preventDefault && event.preventDefault();

      if (this.prevent) {
        console.log(`[Navigation] prevent`)
        return;
      }

      // Navigation.keydown(section, event) { return true }
      if (this.keydown && this.keydown(this.focusSection, event)) return;
      // Section.keydown(section, event) { return true }
      if (
        this.focusSection.keydown &&
        this.focusSection.keydown(this.focusSection, event)
      )
        return;

      let direction;
      switch (event.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
      }

      if (direction) {
        this.key = direction;
        this.move(direction);
      } else {
        this.key = event.key;
        switch (event.key) {
          case "Enter":
            this.focusSection.enter &&
              this.focusSection.enter(this.focusSection);
            break;
          case "Backspace":
            this.focusSection.back && this.focusSection.back(this.focusSection);
            break;
        }
      }
    };
  }

  /**
   * 포커스 아이템 세팅
   * @param section
   * @param items
   */
  // setStore(section, items) {
  //     section.items = items
  //     if(!section.axis) section.axis = {y:0, x:0}
  // }

  /**
   * 포커스 아이템 세팅 (비동기 X)
   * @param section
   */
  setItems(section) {
    // const parent = document.getElementById(section.id);
    // const children = [...parent.children]

    /*
        <div id='section-id'>
            <div className='item'></div>
            <div className='item'></div>
            <div className='item ignore'></div>    // ignore 는 네비에서 제외한다
            <div className='item ignore'></div>
        </div>
        */

    const elms = document.querySelectorAll(
      `#${section.id} > *:not(.${this.ignoreClass})`
    );
    const children = [...elms];

    if (children.length > 0) {
      //다차원 배열로 변환
      let result = this.__convertMultiArray(section, children);

      //포커스 아이템 세팅 및 axis 초기화
      // this.setStore(section, result)
      section.items = result;
      if (!section.axis) section.axis = { y: 0, x: 0 };
    } else {
      section.axis = undefined;
      section.items = undefined;
    }
  }

  /**
   * 포커스 대상 아이템을 다차원 배열로 변환
   * @param section
   * @param items
   * @returns {[]}
   */
  __convertMultiArray(section, items) {
    let result = [];

    if (section.options && section.options.cols) {
      const cols = section.options.cols;
      const total = items.length;
      const count = Math.ceil(total / cols);

      for (let i = 0; i < count; i++) {
        total > 0 && result.push(items.splice(0, cols));
      }
    } else {
      result = [items];
    }

    return result;
  }

  /**
   * 포커스 대상 아이템 변경
   * //외부 호출 금지
   */
  __switchFocus() {
    if (!this.focusSection.items) return;

    const inputTag = document.getElementsByTagName("input")[0];

    //이전 아이템 포커스 처리
    if (this.focusItem) {
      this.focusItem.classList.remove(this.focusClass);
      this.focusItem === inputTag && this.focusItem.blur();
    }

    //다음 아이템 포커스 처리
    this.prevFocusItem = this.focusItem;
    this.focusItem = this.focusSection.items[this.focusSection.axis.y][
      this.focusSection.axis.x
    ];
    this.focusSection.focusItem = this.focusItem;
    this.focusItem.classList.remove(this.selectedClass);
    this.focusItem.classList.add(this.focusClass);
    this.focusItem === inputTag && this.focusItem.focus();
    this.focusSection.focus && this.focusSection.focus(this.focusSection);
  }

  /**
   * 조건에 맞는 section 검색
   * @param id
   * @returns {*}
   */
  findSection(section_id) {
    let section = null;
    this.navigation.some((layer) => {
      section = layer.sections.find((section) => section.id == section_id);
      return section != null;
    });
    return section;
  }

  /**
   * 신규 레이어 생성 ex) 팝업
   * @param layer
   */
  createLayer(layer) {
    this.history.push(this.focusSection);
    this.navigation.push(layer);
    layer.sections.forEach((section) => {
      this.setItems(section);
      if (section.options && section.options.start) {
        section.options.axis
          ? this.go(section.id, section.options.axis, true)
          : this.go(section.id, null, true);
      }
    });
  }

  /**
   * 레이어 삭제
   * @param id
   */
  removeLayer(layer_id) {
    const section = this.history[this.history.length - 1];
    const idx = this.navigation.findIndex((layer) => {
      return layer.id === layer_id;
    });

    this.navigation.splice(idx, 1);
    this.history.splice(this.history.length - 1, 1);
    this.go(section.id);
  }

  /**
   * 포커스 영역 추가
   * @param id
   * @param sections
   */
  addSection(id, sections) {
    let existing = this.navigation.find((layer) => {
      return layer.id === id;
    });

    sections.forEach((section) => {
      //추가할 영역이 기존에 존재하면 기존 영역은 삭제 후 추가
      existing.sections.forEach((exist, index) => {
        if (exist.id === section.id) {
          existing.sections.splice(index, 1);
        }
      });

      existing.sections.push(section);
      this.setItems(section);
    });
  }

  /**
   * 포커스 영역 삭제
   * @param id
   */
  // removeSection(id) { //Layer 삭제임. 사용하지 말것
  //     const idx = this.navigation.findIndex(layer => {
  //         return layer.id === id
  //     });

  //     this.navigation.splice(idx, 1);
  // }

  /**
   * 포커스 아이템 추가 // setItems() 이랑 똑같은 함수임
   * @param id
   * @param axisInit true axis초기화,  false axis기존값 유지
   */
  // addItems(id, axis) {
  //     const section = this.findSection(id);
  //     if(axis) section.axis = axis

  //     const parent = document.getElementById(section.id);
  //     const children = [...parent.children];

  //     if (children.length > 0) {
  //         let result = this.__convertMultiArray(section, children);
  //         this.setStore(section, result);
  //     }
  // }

  /**
   * 비동기 로딩 시 키 동작 대기 // Navigation.prevent 사용할것
   * @param directions
   */
  // preventKey(directions) {
  //     //deep copy 위한 immutable 처리
  //     this.focusSectionCopy = Map(this.focusSection).toJS();

  //     directions.forEach(direction => {
  //         if (this.focusSection.direction[direction] !== null) {
  //             this.focusSection.direction[direction] = null;
  //         }
  //     });
  // }

  /**
   * 키 동작 대기 해제
   */
  // permitKey() {
  //     let target = this.findSection(this.focusSectionCopy.id);
  //     target.direction = this.focusSectionCopy.direction;

  //     this.focusSectionCopy = null;
  // }

  /**
   * next section 변환
   * @param id
   * @param direction
   */
  switchDirection(id, direction) {
    let target = this.findSection(id);
    target.direction = direction;
  }

  /**
   * section id가 같으면 focus만 이동
   * section id가 다르면 section 이동 후 focus 이동
   * @param {*} id section id
   * @param {*} axis {x:0, y:0}
   * @param {*} selected true | false
   */
  go(id, axis, selected) {
    if (this.focusSection && this.focusSection.id == id) {
      if (axis) this.focusSection.axis = axis;
      this.__switchFocus();
    } else {
      this.__go(id, axis, selected);
    }
  }

  /**
   * 외부 함수 아님
   * 섹션 이동
   * @param {String} id section id
   * @param {JSON} axis {x:0, y:0}
   * @param {Boolean} selected true | false
   */
  __go(id, axis, selected) {
    if (this.focusSection) {
      selected && this.focusItem.classList.add(this.selectedClass);
      console.log(`[Navigation] leave section.id:%o`, this.focusSection.id);
      this.focusSection.leave && this.focusSection.leave(this.focusSection);
    }

    this.prevFocusSection = this.focusSection;
    this.focusSection = this.findSection(id);
    if (axis) this.focusSection.axis = axis;
    console.log(`[Navigation] entry section.id:%o`, this.focusSection.id);
    this.focusSection.entry && this.focusSection.entry(this.focusSection);
    this.__switchFocus();
  }

  /**
   * 외부 함수 아님
   * 섹션 이동
   * @param {String} direction left | right | up | down
   */
  __go2(direction) {
    const next =
      this.focusSection.direction && this.focusSection.direction[direction];

    if (
      next &&
      document.getElementById(next.id) &&
      typeof next !== "function"
    ) {
      this.__go(next.id, next.axis, next.selected);
    } else if (typeof next === "function") {
      this.focusSection.direction[direction](this.focusSection);
    }
  }

  /**
   * 네이게이션 이동
   * @param {String} direction left | right | up | down
   */
  move(direction) {
    if (!this.focusSection.items) return;

    //이동 옵션
    const nextRow =
      this.focusSection.options && this.focusSection.options.nextRow;
    const loop = this.focusSection.options && this.focusSection.options.loop;

    switch (direction) {
      case "right":
        if (
          this.focusSection.axis.x <
          this.focusSection.items[this.focusSection.axis.y].length - 1
        ) {
          this.focusSection.axis.x += 1;
          this.__switchFocus();
        } else {
          if (nextRow) {
            //X 좌표의 마지막 항목에서 바로 아래 리스트 첫번째 항목으로 이동
            if (this.focusSection.axis.y < this.focusSection.items.length - 1) {
              this.focusSection.axis.y += 1;
              this.focusSection.axis.x = 0;
              this.__switchFocus();
            }
          } else if (loop) {
            //X 좌표의 마지막 항목에서 현재 리스트 첫번째 항목으로 이동
            this.focusSection.axis.x = 0;
            this.__switchFocus();
          } else {
            //더 움직일 수 없을때.  section.direction.right 호출됨
            this.__go2(direction);
          }
        }
        break;
      case "left":
        if (this.focusSection.axis.x > 0) {
          this.focusSection.axis.x -= 1;
          this.__switchFocus();
        } else {
          if (nextRow) {
            //X 좌표의 마지막 항목에서 바로 아래 리스트 첫번째 항목으로 이동
            if (this.focusSection.axis.y > 0) {
              this.focusSection.axis.y -= 1;
              this.focusSection.axis.x =
                this.focusSection.items[this.focusSection.axis.y].length - 1;
              this.__switchFocus();
            }
            // } else if (loop) {
            //     //X 좌표의 마지막 항목에서 현재 리스트 첫번째 항목으로 이동
            //     this.focusSection.axis.x = this.focusSection.items[this.focusSection.axis.y].length - 1;
            //     this.__switchFocus();
          } else {
            //더 움직일 수 없을때.  section.direction.left 호출됨
            this.__go2(direction);
          }
        }
        break;
      case "down":
        let nextY = this.focusSection.axis.y + 1;
        let nextColItems = this.focusSection.items[nextY];

        if (
          this.focusSection.axis.y < this.focusSection.items.length - 1 &&
          this.focusSection.axis.x <= nextColItems.length - 1
        ) {
          this.focusSection.axis.y = nextY;
          this.__switchFocus();
        } else {
          //더 움직일 수 없을때.  section.direction.down 호출됨
          this.__go2(direction);
        }
        break;
      case "up":
        if (this.focusSection.axis.y > 0) {
          this.focusSection.axis.y -= 1;

          // // UP&&DOWN 예외처리
          // let colItems = this.focusSection.items[this.focusSection.axis.y]
          // if(this.focusSection.axis.x >= colItems.length) {
          //     this.focusSection.axis.x = colItems.length-1
          // }

          this.__switchFocus();
        } else {
          //더 움직일 수 없을때.  section.direction.up 호출됨
          this.__go2(direction);
        }
        break;
      default:
        break;
    }
  }
}

export default new Navigation();
