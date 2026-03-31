/*
 ############################################################################
 # FiledataField	: SysProgramSearch.tsx
 # Description		: ADMIN > 시스템운영 > 프로그램 1단 Grid 영역
 # Author			: JangGwangSeok
 # Since			: 25.05.20
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailTableGroup from '@/assets/styled/Container/UiDetailTableGroup';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// Util
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import { InputText } from '@/components/common/custom/form';

// API
import { apiPostSaveSysProgram } from '@/api/sys/apiSysProgram';

const SysProgramDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'useYn',
			headerText: t('lbl.USE'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'progCd',
			headerText: t('lbl.PROG_CD'),
		},
		{
			dataField: 'progNm',
			headerText: t('lbl.PROG_NM'),
		},
		{
			dataField: 'progLvl',
			headerText: t('lbl.PROG_LVL'),
		},
		{
			dataField: 'progNo',
			headerText: t('lbl.PROG_NO'),
		},
		{
			dataField: 'authority',
			headerText: t('lbl.AUTHORITY'),
		},
		{
			dataField: 'progUrl',
			headerText: t('lbl.PROG_URL'),
		},
		{
			dataField: 'progArgs',
			headerText: t('lbl.PROG_ARGS'),
		},
		{
			dataField: 'systemCl',
			headerText: t('lbl.SYSTEM_CL'),
		},
		{
			dataField: 'proghelpUrl',
			headerText: t('lbl.PROGHELP_URL'),
		},
		{
			dataField: 'menuYn',
			headerText: t('lbl.MENU_YN'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'topmenuYn',
			headerText: t('lbl.TOPMENU_YN'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn1Nm',
			headerText: t('lbl.BTN1_NM'),
		},
		{
			dataField: 'btn2Nm',
			headerText: t('lbl.BTN2_NM'),
		},
		{
			dataField: 'btn3Nm',
			headerText: t('lbl.BTN3_NM'),
		},
		{
			dataField: 'refUpperProgCd',
			visible: false,
		},
		{
			dataField: 'rowId',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		showStateColumn: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		selectionMode: 'multipleCells', // 셀 선택모드
		rowIdField: 'rowId',

		// 트리 구조 관련 속성
		treeColumnIndex: 1, // 계층형 그리드(트리 그리드) 에서 트리 아이콘을 출력시킬 칼럼 인덱스를 지정
		displayTreeOpen: true, // 최초 보여질 때 모두 열린 상태로 출력 여부
		flat2tree: true,
		treeIdField: 'progCd',
		treeIdRefField: 'refUpperProgCd',
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장
	 * @returns {void}
	 */
	const saveFunc = () => {
		// 변경 데이터 확인
		const menus = gridRef.current.getChangedData();
		if (!menus || menus.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		// validation
		if (menus.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveSysProgram(menus).then(() => {
				// 콜백 처리
				props.callBackFn && props.callBackFn instanceof Function ? props.callBackFn() : null;
			});
		});
	};

	/**
	 * 일괄적용
	 * @returns {void}
	 */
	const allApplyFn = () => {};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'down', // 아래로
			},
			{
				btnType: 'up', // 위로
			},
			{
				btnType: 'excelForm', // 엑셀양식
			},
			{
				btnType: 'excelSelect', // 엑셀선택
			},
			{
				btnType: 'excelUpload', // 엑셀업로드
			},
			{
				btnType: 'excelDownload', // 엑셀다운로드
			},
			{
				btnType: 'copy', // 행복사
				initValues: {
					menuId: '',
					regId: '',
					regDt: '',
				},
			},
			{
				btnType: 'curPlus', // 행삽입 (선택된 row 바로 아래 행추가)
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					menuYn: 0,
					useYn: 0,
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'detailView', // 상세보기
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
			},
			{
				btnType: 'btn3', // 사용자 정의버튼3
			},
			{
				btnType: 'print', // 인쇄
			},
			{
				btnType: 'new', // 신규
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveFunc,
			},
			{
				btnType: 'elecApproval', // 전자결재
			},
		],
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'pre', // 이전
			},
			{
				btnType: 'post', // 다음
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
			},
			{
				btnType: 'btn3', // 사용자 정의버튼3
			},
			{
				btnType: 'btn4', // 사용자 정의버튼3
			},
			{
				btnType: 'btn5', // 사용자 정의버튼3
			},
			{
				btnType: 'btn6', // 사용자 정의버튼3
			},
			{
				btnType: 'new', // 신규
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveFunc,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;

		// 에디팅 시작 이벤트 바인딩
		gridRefCur.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRefCur.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'progCd') {
				return gridRefCur.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			<AGrid>
				<GridTopBtn
					gridBtn={gridBtn}
					totalCnt={props.totalCnt}
					extraContentLeft={
						<span className="msg">상품 조회 시 속도가 많이 느려지며 서버에 많은 부담을 주게 됩니다.</span>
					}
				>
					<InputText label={t('lbl.PROG_CD')} name="newProgCd" span={256} maxLength={10} allowClear />
					<Button onClick={allApplyFn}> {t('lbl.ALLAPPLY')} </Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<AGrid>
				<TableTopBtn tableBtn={tableBtn} />
				<UiDetailViewArea>
					<UiDetailTableGroup>
						<colgroup>
							<col width={100} />
						</colgroup>
						<tr>
							<th>
								<label data-required>{t('lbl.PROG_CD')}</label>
							</th>
							<td></td>
						</tr>
						<tr>
							<th>
								<label data-required>{t('lbl.PROG_NM')}</label>
							</th>
							<td></td>
						</tr>
						<tr>
							<th>
								<label data-required>{t('lbl.PROG_LVL')}</label>
							</th>
							<td></td>
						</tr>
						<tr>
							<th>
								<label data-required>{t('lbl.PROG_NO')}</label>
							</th>
							<td></td>
						</tr>
					</UiDetailTableGroup>
				</UiDetailViewArea>
			</AGrid>
		</>
	);
});

export default SysProgramDetail;
