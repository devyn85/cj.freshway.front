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

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiPostSaveSysProgram } from '@/api/sys/apiSysProgram';

const SysProgramDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// props 초기화
	const { form } = props;

	// 다국어
	const { t } = useTranslation();

	const systemCl = Form.useWatch('systemCl', props.form);
	const systemClList = [
		{ label: t('lbl.WEB'), value: 'LOGISONE' },
		{ label: t('lbl.CENTER_APP'), value: 'WMMOB' },
		{ label: t('lbl.DRIVER_APP'), value: 'DMMOB' },
	];

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'systemCl',
			headerText: t('lbl.SYSTEM_CL'),
			dataType: 'code',
			// commRenderer: {
			// 	type: 'dropDown',
			// 	keyField: 'value',
			// 	valueField: 'label',
			// 	list: systemClList,
			// 	disabledFunction: () => {
			// 		return true;
			// 	},
			// },
			required: true,
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return systemClList.filter((system: any) => system.value === value).map((obj: any) => obj.label);
			},
		},
		{
			dataField: 'progCd',
			headerText: t('lbl.PROG_CD'),
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (commUtil.isNotEmpty(item.updId)) {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'progNm',
			headerText: t('lbl.PROG_NM'),
			required: true,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'useYn',
			headerText: t('lbl.USE_YN'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'menuYn',
			headerText: t('lbl.MENU_YN'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'topmenuYn',
			headerText: t('lbl.TOPMENU_YN'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'progLvl',
			dataType: 'numeric',
			headerText: t('lbl.PROG_LVL'),
			required: true,
		},
		{
			dataField: 'progNo',
			headerText: t('lbl.PROG_NO'),
			required: true,
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
			dataField: 'proghelpUrl',
			headerText: t('lbl.PROGHELP_URL'),
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
			dataField: 'btn4Nm',
			headerText: t('lbl.BTN4_NM'),
		},
		{
			dataField: 'btn5Nm',
			headerText: t('lbl.BTN5_NM'),
		},
		{
			dataField: 'btn6Nm',
			headerText: t('lbl.BTN6_NM'),
		},
		{
			dataField: 'btn7Nm',
			headerText: t('lbl.BTN7_NM'),
		},
		{
			dataField: 'btn8Nm',
			headerText: t('lbl.BTN8_NM'),
		},
		{
			dataField: 'btn9Nm',
			headerText: t('lbl.BTN9_NM'),
		},
		{
			dataField: 'btn10Nm',
			headerText: t('lbl.BTN10_NM'),
		},
		{
			dataField: 'refUpperProgNo',
			visible: false,
		},
		{
			dataField: 'rowId',
			visible: false,
		},
		{
			dataField: 'updId',
			visible: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		rowIdField: 'rowId',
		useCtrlF: false, // 트리 구조일 경우 AUI그리드 searchAll() 검색 method 사용불가

		// 트리 구조 관련 속성
		treeColumnIndex: 1, // 계층형 그리드(트리 그리드) 에서 트리 아이콘을 출력시킬 칼럼 인덱스를 지정
		displayTreeOpen: true, // 최초 보여질 때 모두 열린 상태로 출력 여부
		flat2tree: true,
		treeIdField: 'progNo',
		treeIdRefField: 'refUpperProgNo',
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 저장 버튼
	 * @returns {void}
	 */
	const saveFunc = () => {
		// 변경 데이터 확인
		const menus = gridRef.current.getChangedData({ validationYn: false });
		if (!menus || menus.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (menus.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}

		// "내부순번" 칼럼에 대한 validation 체크
		const gridData = gridRef.current.getGridData();
		for (const i in menus) {
			if ((menus[i].progLvl + 1) * 2 !== menus[i].progNo.length) {
				showAlert('', `${menus[i].progLvl}레벨의 [ 내부순번 ] 값은 ${(menus[i].progLvl + 1) * 2}자리로 입력해주세요.`);

				// 해당 인덱스로 이동
				if (menus[i].rowId) {
					const rowIndex = gridRef.current.rowIdToIndex(menus[i].rowId);
					gridRef.current.setSelectionByIndex(rowIndex, 7);
				}

				return false;
			} else if (menus[i].progLvl > 0) {
				const isUpperProgNo = gridData.some((item: any) => {
					if (
						menus[i].progLvl - 1 === item.progLvl &&
						menus[i].rowId !== item.rowId &&
						menus[i].progNo?.slice(0, -2) === item.progNo
					) {
						return true;
					}
				});

				// 상위 프로그램 없을 경우 경고
				if (!isUpperProgNo) {
					showAlert('', t('msg.MSG_COM_VAL_229')); // 상위 프로그램에 맞는 내부순번을 입력해주세요.

					// 해당 인덱스로 이동
					if (menus[i].rowId) {
						const rowIndex = gridRef.current.rowIdToIndex(menus[i].rowId);
						gridRef.current.setSelectionByIndex(rowIndex, 7);
					}

					return false;
				}
			}
		}

		gridRef.current.showConfirmSave(() => {
			apiPostSaveSysProgram(menus).then((res: any) => {
				if (res?.data?.statusCode === 0) {
					// 콜백 처리
					if (props.callBackFn && props.callBackFn instanceof Function) {
						props.callBackFn();
					}
				}
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'copy', // 행복사
				initValues: {
					menuId: '',
					regId: '',
					regDt: '',
				},
			},
			{
				btnType: 'curPlus', // 행삽입
				initValues: {
					systemCl: systemCl,
				},
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					systemCl: systemCl,
				},
			},
			{
				btnType: 'delete', // 행삭제
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
		<AGrid className="contain-wrap">
			<GridTopBtn gridBtn={gridBtn} gridProps={gridProps} totalCnt={props.totalCnt} gridTitle={t('lbl.LIST')} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default SysProgramDetail;
