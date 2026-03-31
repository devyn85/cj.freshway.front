/*
 ############################################################################
 # FiledataField	: MsWdAppDetail.tsx
 # Description		: 기준정보 > 물류센터 정보 > 결품대응 POP그룹 관리 Grid
 # Author			: KimDongHan
 # Since			: 2025.10.24
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import commUtil from '@/util/commUtil';
import { Form } from 'antd';
//import { useEffect } from 'react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const MsWdAppDetail = ({
	form,
	gridRef,
	gridRef1,
	gridData,
	gridData1,
	searchDetailList,
	saveMasterList,
	saveDetailList,
	addDetail,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const gDccode = Form.useWatch('dccode', form);

	const gDcname = useMemo(
		() => getUserDccodeList().find((o: any) => o.dccode == gDccode)?.dcnameOnlyNm || '',
		[gDccode],
	);

	//////////////////////////////////////////////// 상단 그리드 ////////////////////////////////////////////////
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				// 행추가
				btnType: 'plus' as const,
				initValues: {
					dccode: gDccode,
					dcname: gDcname,
					useYn: 'Y', // 2025.12.05 이창진님 요청으로 기본값 'Y' 세팅
					rowStatus: 'I',
				},
			},
			{
				// 행삭제
				btnType: 'delete',
			},
			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
				},
			},
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn : true, // 체크박스
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 01. 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 02. 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		// {
		// 	// 02. 물류센터명
		// 	dataField: 'dccode',
		// 	headerText: t('lbl.DCNAME'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return getUserDccodeList()
		// 			.filter((dccode: any) => dccode.dccode === value)
		// 			.map((obj: any) => obj.dcnameOnlyNm);
		// 	},
		// },
		{
			// 03. POP그룹명
			dataField: 'popGroup',
			headerText: t('lbl.POP_GROUP'),
			dataType: 'text',
			editable: true,
			required: true,
			width: 200,
		},
		{
			// 04. 저장유형
			dataField: 'storagetype',
			headerText: t('lbl.SAVE_TYPE'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('STORAGETYPE', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			width: 100,
		},
		{
			// 05. 사용여부
			dataField: 'useYn',
			headerText: t('lbl.USE_YN'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: [
					{
						cdNm: t('lbl.SELECT'),
						comCd: '',
					},
					{
						cdNm: 'Y',
						comCd: 'Y',
					},
					{
						cdNm: 'N',
						comCd: 'N',
					},
				],
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			required: true,
			width: 100,
		},
		{
			// 06. 비고
			dataField: 'rmk',
			headerText: t('lbl.REMARK'),
			dataType: 'text',
			editable: true,
			width: 300,
		},
		{
			/* 07. 등록자 */
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'addId',
			visible: false,
		},
		{
			/* 08. 등록일시 */
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			/* 09. 수정자 */
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			/* 10. 수정일시 */
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
	];

	//////////////////////////////////////////////// 하단 그리드 ////////////////////////////////////////////////
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', //  행추가
				btnLabel: t('lbl.POPNO'),
				isActionEvent: false,
				callBackFn: addDetail,
			},
			{
				// 행삭제
				btnType: 'delete',
			},
			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveDetailList();
				},
			},
		],
	};

	// 그리드 속성
	const gridProps1 = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,       // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		isLegacyRemove: true, // 기존행 삭제 가능 옵션
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	const gridCol1 = [
		{
			// POP그룹명
			dataField: 'popGroup',
			headerText: t('lbl.POP_GROUP'),
			dataType: 'text',
			editable: false,
			width: 200,
		},
		{
			// POP번호
			dataField: 'popno',
			headerText: t('lbl.POPNO'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 200,
		},
		{
			// 사용여부
			dataField: 'useYn',
			headerText: t('lbl.USE_YN'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: [
					{
						cdNm: t('lbl.SELECT'),
						comCd: '',
					},
					{
						cdNm: 'Y',
						comCd: 'Y',
					},
					{
						cdNm: 'N',
						comCd: 'N',
					},
				],
				keyField: 'comCd',
				valueField: 'cdNm',
			},
			width: 100,
		},
		{
			/* 등록자 */
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'addId',
			visible: false,
		},
		{
			/* 등록일시 */
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			/* 수정자 */
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			/* 수정일시 */
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * ==========================================================================
 -  AUI Grid Event Initailize
 - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		let prevRowIndex: any = null;

		gridRef.current?.bind('selectionChange', function (event: any) {
			if (event.primeCell?.item?.rowStatus === 'I') {
				gridRef1.current?.clearGridData();
				return;
			}

			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;
			const selectedRow = gridRef.current?.getSelectedRows()[0];
			searchDetailList(selectedRow);
		});

		gridRef.current?.bind('cellEditBegin', (event: any) => {
			// 편집이 시작될 때, 특정 컬럼에 대한 편집 허용 여부를 결정
			if (event.dataField === 'popGroup') {
				// 신규 행이 아니라면
				if (event.item.rowStatus !== 'I') {
					// false를 반환하여 편집 모드 진입을 막는다.
					return false;
				}
			}

			return true;
		});

		// cellEditEnd 바이트 검증 추가 (initEvent 내부)
		gridRef.current?.bind('cellEditEnd', (event: any) => {
			const field = event.dataField;

			// popGroup 필드만 검사
			if (field === 'popGroup') {
				const label = t('lbl.POP_GROUP');
				const ok = commUtil.validateAndAlertByteLimit(event.value, 50, label);
				if (!ok) {
					// 검증 실패하면 이전값으로 되돌림
					gridRef.current?.setCellValue(event.rowIndex, field, '');
					// 포커스 유지(선택적)
					gridRef.current?.setFocus();
				}
			}
		});
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	useEffect(() => {
		if (gridRef1.current) {
			// 그리드 초기화
			gridRef1.current?.setGridData(gridData1);
			gridRef1.current?.setSelectionByIndex(0, 0);

			if (gridData1.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef1.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef1.current?.setColumnSizeList(colSizeList);
			}
		}
		gridRef.current?.setFocus();
	}, [gridData1]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={gridData?.length} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn
								gridBtn={gridBtn1}
								gridTitle={t('lbl.DETAIL')}
								totalCnt={gridData1?.length}
								extraContentLeft={<span className="msg">{t('msg.MSG_WD_APP_003')}</span>}
							/>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</GridAutoHeight>
					</>,
				]}
			/>
		</>
	);
};

export default MsWdAppDetail;
