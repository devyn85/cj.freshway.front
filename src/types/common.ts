type CommonCodeType = {
	comCd?: string;
	comGrpCd?: string;
	cdNm?: string;
	sortNo?: string | number;
	rsvStr1Val?: string;
	rsvStr2Val?: string;
	rsvStr3Val?: string;
	rsvStr4Val?: string;
	rsvStr5Val?: string;
	rsvStr6Val?: string;
	rsvStr7Val?: string;
	rsvStr8Val?: string;
};

interface GridBtnPropsType {
	/**
	 * 타켓 그리드 Ref
	 */
	tGridRef: any;
	/**
	 * 노출될 그리드 버튼 목록
	 */
	btnArr?: GridBtnType[];
}

interface GridBtnType {
	/**
	 * 버튼 타입
	 * 'down' : 아래로 (선택된 row 한칸 아래로 이동)
	 * 'up' : 위로 (선택된 row 한칸 위로 이동)
	 * 'excelForm' : 엑셀양식 (엑셀 양식 다운로드)
	 * 'excelSelect' : 엑셀선택 (그리드에 업로드 할 엑셀 선택)
	 * 'excelUpload' : 엑셀업로드 (그리드에 엑셀 DATA 업로드)
	 * 'excelDownload' : 엑셀다운로드 (그리드에 DATA 엑셀로 다운로드)
	 * 'copy' : 행복사 (선택된 row 복사 후 그리드 최하단에 붙여넣기)
	 * 'curPlus' : 행삽입 (선택된 row 바로 아래 행추가)
	 * 'plus' : 행추가 (그리드 최하단에 행추가)
	 * 'delete' : 행삭제 (선택된 row 삭제)
	 * 'detailView' : 상세보기 (선택된 row 상세보기)
	 * 'btn1' : 사용자 정의버튼1 (시스템운영 > 프로그램 화면에 등록된 사용버튼1 노출)
	 * 'btn2' : 사용자 정의버튼2 (시스템운영 > 프로그램 화면에 등록된 사용버튼2 노출)
	 * 'btn3' : 사용자 정의버튼3 (시스템운영 > 프로그램 화면에 등록된 사용버튼3 노출)
	 * 'btn4' : 사용자 정의버튼4 (시스템운영 > 프로그램 화면에 등록된 사용버튼4 노출)
	 * 'btn5' : 사용자 정의버튼5 (시스템운영 > 프로그램 화면에 등록된 사용버튼5 노출)
	 * 'btn6' : 사용자 정의버튼6 (시스템운영 > 프로그램 화면에 등록된 사용버튼6 노출)
	 * 'btn7' : 사용자 정의버튼7 (시스템운영 > 프로그램 화면에 등록된 사용버튼7 노출)
	 * 'btn8' : 사용자 정의버튼8 (시스템운영 > 프로그램 화면에 등록된 사용버튼8 노출)
	 * 'btn9' : 사용자 정의버튼9 (시스템운영 > 프로그램 화면에 등록된 사용버튼9 노출)
	 * 'btn10' : 사용자 정의버튼10 (시스템운영 > 프로그램 화면에 등록된 사용버튼10 노출)
	 * 'print' : 인쇄 (RD 연동)
	 * 'new' : 신규 (?????)
	 * 'save' : 저장 (그리드 변경된 DATA 저장)
	 * 'elecApproval' : 전자결재 (?????)
	 * 'userSetting' : 사용자설정팝업
	 */
	btnType:
		| 'down'
		| 'up'
		| 'excelForm'
		| 'excelSelect'
		| 'excelUpload'
		| 'excelDownload'
		| 'copy'
		| 'curPlus'
		| 'plus'
		| 'delete'
		| 'detailView'
		| 'btn1'
		| 'btn2'
		| 'btn3'
		| 'btn4'
		| 'btn5'
		| 'btn6'
		| 'btn7'
		| 'btn8'
		| 'btn9'
		| 'btn10'
		| 'print'
		| 'new'
		| 'save'
		| 'elecApproval'
		| 'userSetting';
	/**
	 * 권한 설정할 [ 버튼 타입 ] (ex. 'plus' 타입일 경우 'new')
	 */
	authType?: string;
	/**
	 * 버튼 명칭
	 */
	btnLabel?: string;
	/**
	 * 버튼 아이콘
	 */
	icoSvgData?: string;
	/**
	 * 콜백 Function 호출 전 처리 사용 유무
	 */
	isActionEvent?: boolean;
	/**
	 * 행추가/행복사 row 초기값
	 */
	initValues?: object;
	/**
	 * 호출전 Function
	 */
	callBeforeFn?: any;
	/**
	 * 콜백 Function
	 */
	callBackFn?: any;
	/**
	 * 마우스 오버시 노출시킬 툴팁
	 */
	tooltip?: string;
	/**
	 * 제외 조건 Function(item: any)
	 * item: 선택된 ROW DATA 주입시켜줌
	 * return: boolean (제외시킬 ROW true 설정)
	 */
	excludeFn?: any;
	/**
	 * 버튼 비활성화 Function
	 */
	disabledFn?: any;
}

interface TableBtnPropsType {
	/**
	 * 타켓 그리드 Ref
	 */
	tGridRef: any;
	/**
	 * 노출될 표 버튼 목록
	 */
	btnArr?: TableBtnType[];
}

interface TableBtnType {
	/**
	 * 버튼 타입
	 * 'pre' : 이전 (현재 선택된 row 한칸 위 row의 DATA 표 영역에 노출)
	 * 'post' : 다음 (현재 선택된 row 한칸 아래 row의 DATA 표 영역에 노출)
	 * 'btn1' : 사용자 정의버튼1 (시스템운영 > 프로그램 화면에 등록된 사용버튼1 노출)
	 * 'btn2' : 사용자 정의버튼2 (시스템운영 > 프로그램 화면에 등록된 사용버튼2 노출)
	 * 'btn3' : 사용자 정의버튼3 (시스템운영 > 프로그램 화면에 등록된 사용버튼3 노출)
	 * 'btn4' : 사용자 정의버튼4 (시스템운영 > 프로그램 화면에 등록된 사용버튼4 노출)
	 * 'btn5' : 사용자 정의버튼5 (시스템운영 > 프로그램 화면에 등록된 사용버튼5 노출)
	 * 'btn6' : 사용자 정의버튼6 (시스템운영 > 프로그램 화면에 등록된 사용버튼6 노출)
	 * 'btn7' : 사용자 정의버튼7 (시스템운영 > 프로그램 화면에 등록된 사용버튼7 노출)
	 * 'btn8' : 사용자 정의버튼8 (시스템운영 > 프로그램 화면에 등록된 사용버튼8 노출)
	 * 'btn9' : 사용자 정의버튼9 (시스템운영 > 프로그램 화면에 등록된 사용버튼9 노출)
	 * 'btn10' : 사용자 정의버튼10 (시스템운영 > 프로그램 화면에 등록된 사용버튼10 노출)
	 * 'delete' : 행삭제 (현재 선택된 row 삭제)
	 * 'new' : 신규 (?????)
	 * 'save' : 저장 (표 변경된 DATA 저장)
	 */
	btnType:
		| 'pre'
		| 'post'
		| 'btn1'
		| 'btn2'
		| 'btn3'
		| 'btn4'
		| 'btn5'
		| 'btn6'
		| 'btn7'
		| 'btn8'
		| 'btn9'
		| 'btn10'
		| 'delete'
		| 'new'
		| 'save';
	/**
	 * 버튼 명칭
	 */
	btnLabel?: string;
	/**
	 * 버튼 아이콘
	 */
	icoSvgData?: string;
	/**
	 * 콜백 Function 호출 전 처리 사용 유무
	 */
	isActionEvent?: boolean;
	/**
	 * 콜백 Function
	 */
	callBackFn?: any;
	/**
	 * 마우스 오버시 노출시킬 툴팁
	 */
	tooltip?: string;
}

export type { CommonCodeType, GridBtnPropsType, GridBtnType, TableBtnPropsType, TableBtnType };
