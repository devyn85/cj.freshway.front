// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiGetSysAuthorityProgramList, apiPostSaveSysAuthorityProgram } from '@/api/sys/apiSysAuthority';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const SysAuthorityProgramDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// props 초기화
	const { form, data, totalCnt, callBackFn } = props;

	// 그리드 접근 Ref
	ref.gridRefGrp = useRef();
	ref.gridRefDtl = useRef();

	// 다국어
	const { t } = useTranslation();

	// grid data
	const [totalCntDtl, setTotalCntDtl] = useState(0);

	// 그룹권한 그리드 컬럼
	const gridColGrp = [
		{
			dataField: 'authCd',
			headerText: t('lbl.AUTH_CD'),
			dataType: 'code',
		},
		{
			dataField: 'authNm',
			headerText: t('lbl.AUTH_NM'),
		},
		{
			dataField: 'upAuthGroupCd',
			headerText: t('lbl.UP_AUTH_GROUP_CD'),
			dataType: 'code',
		},
		{
			dataField: 'lowAuthYn',
			headerText: t('lbl.LOW_AUTH_YN'),
			dataType: 'code',
		},
	];

	// 그룹권한 그리드 Props
	const gridPropsGrp = {
		editable: false,
		showStateColumn: false,
		fillColumnSizeMode: true,
	};

	// 권한 상세 그리드 컬럼
	const gridColDtl = [
		{
			dataField: 'progCd',
			headerText: t('lbl.PROG_CD'),
			editable: false,
		},
		{
			dataField: 'progNm',
			headerText: t('lbl.PROG_NM'),
			editable: false,
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
			dataField: 'searchYn',
			headerText: t('lbl.SEARCH'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'newYn',
			headerText: t('lbl.NEW'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'deleteYn',
			headerText: t('lbl.DELETE'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'saveYn',
			headerText: t('lbl.SAVE'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'printYn',
			headerText: t('lbl.PRINT'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn1Nm',
			headerText: t('lbl.BTN1'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn1Yn',
			headerText: t('lbl.BTN1'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn2Nm',
			headerText: t('lbl.BTN2'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn2Yn',
			headerText: t('lbl.BTN2'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn3Nm',
			headerText: t('lbl.BTN3'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn3Yn',
			headerText: t('lbl.BTN3'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn4Nm',
			headerText: t('lbl.BTN4'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn4Yn',
			headerText: t('lbl.BTN4'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn5Nm',
			headerText: t('lbl.BTN5'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn5Yn',
			headerText: t('lbl.BTN5'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn6Nm',
			headerText: t('lbl.BTN6'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn6Yn',
			headerText: t('lbl.BTN6'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn7Nm',
			headerText: t('lbl.BTN7'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn7Yn',
			headerText: t('lbl.BTN7'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn8Nm',
			headerText: t('lbl.BTN8'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn8Yn',
			headerText: t('lbl.BTN8'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn9Nm',
			headerText: t('lbl.BTN9'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn9Yn',
			headerText: t('lbl.BTN9'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'btn10Nm',
			headerText: t('lbl.BTN10'),
			editable: false,
			colSpan: 2,
		},
		{
			dataField: 'btn10Yn',
			headerText: t('lbl.BTN10'),
			commRenderer: {
				type: 'checkBox',
			},
		},
	];

	// 권한 상세 그리드 Props
	const gridPropsDtl = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		// fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 권한그룹별 프로그램 목록 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchProgramList = (rowIndex: number) => {
		ref.gridRefDtl.current.clearGridData();
		if (commUtil.isNotEmpty(rowIndex)) {
			const selectedRow = ref.gridRefGrp.current.getItemByRowIndex(rowIndex);
			if (commUtil.isNotEmpty(selectedRow) && !ref.gridRefGrp.current.isAddedById(selectedRow._$uid)) {
				const params = {
					...form.getFieldsValue(),
					authCd: selectedRow.authCd,
				};
				apiGetSysAuthorityProgramList(params).then(res => {
					const gridData = res.data;
					ref.gridRefDtl.current.setGridData(gridData);
					setTotalCntDtl(res.data.length);

					// 조회된 결과에 맞게 칼럼 넓이를 구한다.
					const colSizeList = ref.gridRefDtl.current.getFitColumnSizeList(true);
					// 구해진 칼럼 사이즈를 적용 시킴.
					ref.gridRefDtl.current.setColumnSizeList(colSizeList);
				});
			} else {
				return;
			}
		}
	};

	/**
	 * 그룹 상세 저장
	 * @returns {void}
	 */
	const saveDtlFunc = () => {
		// 변경 데이터 확인
		const authDtlList = ref.gridRefDtl.current.getChangedData({ validationYn: false });
		if (!authDtlList || authDtlList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		ref.gridRefDtl.current.showConfirmSave(() => {
			const params = {
				authProgramList: authDtlList,
			};
			apiPostSaveSysAuthorityProgram(params).then(() => {
				// 콜백 처리
				if (callBackFn && callBackFn instanceof Function) {
					callBackFn();
				}
			});
		});
	};

	// 그룹권한 그리드 버튼 설정
	const gridBtnGrp: GridBtnPropsType = {
		tGridRef: ref.gridRefGrp, // 타겟 그리드 Ref
	};

	// 그룹 상세 그리드 버튼 설정
	const gridBtnDtl: GridBtnPropsType = {
		tGridRef: ref.gridRefDtl, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveDtlFunc,
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
		ref.gridRefGrp?.current?.bind('selectionConstraint', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.rowIndex !== event.toRowIndex) {
				searchProgramList(event.toRowIndex);
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRefGrp?.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(data);
			gridRefCur1?.setSelectionByIndex(0, 0);
			searchProgramList(0);

			// 상세 총건수 초기화
			if (data?.length < 1) {
				setTotalCntDtl(0);
			}
		}
	}, [data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRefGrp?.current?.resize?.('100%', '100%');
		ref.gridRefDtl?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<>
					<AGrid>
						<GridTopBtn gridBtn={gridBtnGrp} gridTitle={t('lbl.AUTHORITYGRP')} totalCnt={totalCnt} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRefGrp} columnLayout={gridColGrp} gridProps={gridPropsGrp} />
					</GridAutoHeight>
				</>,
				<>
					<AGrid>
						<GridTopBtn gridBtn={gridBtnDtl} gridTitle={t('lbl.PROGRAM')} totalCnt={totalCntDtl} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRefDtl} columnLayout={gridColDtl} gridProps={gridPropsDtl} />
					</GridAutoHeight>
				</>,
			]}
		/>
	);
});

export default SysAuthorityProgramDetail;
