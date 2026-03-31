/* eslint-disable */

import { createRoot } from 'react-dom/client';

/*
 * AUIGrid 사용자 정의 에디트 렌더러
 */
export default window.AUIGrid.Class({
	/****************************************************************
	 *
	 * Overriden Properties
	 *
	 ****************************************************************/

	/* 생성될 HTML Tag 명 */
	tagName: 'div',

	/* 렌더러 HTML 엘리먼트 */
	element: null,

	/* CSS 스타일 클래스 */
	cssClass: 'aui-grid-edit-renderer-custom',

	/* 행 아이템 */
	data: null,

	/* 렌더러의 칼럼 레이아웃 데이터 */
	columnData: null,

	/* 칼럼 인덱스 */
	columnIndex: -1,

	/* 행 인덱스 */
	rowIndex: -1,

	/* 데이터 필드명 */
	dataField: '',

	/* 사용자가 설정한 여분의 속성 */
	extraProps: null,

	/****************************************************************
	 *
	 * Private Properties
	 *
	 * Rule : Private Properties 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	// 리액트 DOM 노드(루트)
	__reactDomNode: null,
	__thisObj: null,

	/****************************************************************
	 *
	 * Overriden Methods
	 *
	 ****************************************************************/

	/*
	 * @Overriden public destroy
	 * @param {boolean} unload 실제 DOM 에서 제거할지 여부
	 *
	 * 셀 수정 완료(취소) 될 때 마지막에 호출됩니다.
	 * 여기서 해제할 것 모두 해제 하십시오.
	 * 메모리 누수를 유발하는 코드들을 모두 해제 하십시오.
	 */
	destroy: function (unload) {
		// 리액트 DOM 제거
		setTimeout(() => {
			if (this.__reactDomNode !== null) {
				this.__reactDomNode.unmount();
				this.__reactDomNode = null;
			}

			// 필수 : 반드시 아래 코드는 추가 해야 합니다.
			this.$super.destroy(unload);
		}, 100);
	},

	/*
	 * @Overriden public create
	 *
	 * 셀 수정 진입할 때 동적으로 에디트렌더러가 생성되며 그리드에 의해 호출됩니다.
	 * 초기 엘리먼트 생성 및 이벤트를 설정하십시오.
	 */
	create: function () {
		const value = this.data[this.dataField];
		// 리액트 DOM(루트)
		this.__reactDomNode = createRoot(this.element);
		// 컴포넌트 렌더링
		this.__reactDomNode.render(<>{value}</>);
	},

	/*
	 * @Overriden public triggerEditEndEvent
	 * @param {object} newValue 에디팅 완료로 적용 시킬 새로운 값
	 * @param {string} which 에디팅 완료를 발생 시킨 행위에 대한 정의
	 *
	 * 에디팅 완료(cellEditEnd) 이벤트를 발생 시키고 실제로 에디팅 종료시킵니다.
	 */
	triggerEditEndEvent: function (newValue, which) {
		this.__thisObj.$super.triggerEditEndEvent(newValue, which);
	},

	/*
	 * @Overriden public triggerEditCancelEvent
	 * @param {string} which 에디팅 취소를 발생 시킨 행위에 대한 정의
	 *
	 * 에디팅 취소(cellEditCancel) 이벤트를 발생 시키고 에디팅 취소시킵니다.
	 */
	triggerEditCancelEvent: function (which) {
		this.__thisObj.$super.triggerEditCancelEvent(which);
	},

	/*
	 * @Overriden public injectValue
	 * @param {obejct} value 새로운 값
	 *
	 * 외부에 의해 에디팅이 완료될 경우를 위해 값을 주입 시켜 놓습니다.
	 * 에디트렌더러의 정상적인 종료가 아닌 외부 특정 요인에 의해 수정 완료 처리될 때 여기서 주입시켜 놓은 값이 적용됩니다.
	 */
	injectValue: function (value) {
		this.$super.injectValue(value);
	},

	/****************************************************************
	 *
	 * Private Methods
	 *
	 * Rule : Private Methods 는 반드시 __ 로 시작하십시오
	 * 즉, 사용자가 추가하는 속성, 메소드는 __ 로 시작하십시오.
	 *
	 ****************************************************************/

	__updateValue: function (value) {
		this.injectValue(value);
	},
}).extend(window.AUIGrid.EditRendererBase);
