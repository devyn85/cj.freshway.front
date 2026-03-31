/*
 ############################################################################
 # FiledataField	: IbStoWeightDetail2.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.10.24
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const IbStoWeightDetail2 = ({ gridRef, gridData, openModal, saveBatchMasterList }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const excelParams = {
		fileName: '센터별물동량',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: '마스터관리',
				authType: 'new',
				callBackFn: openModal,
			},
			{
				btnType: 'btn2', // 사용자 정의버튼1
				btnLabel: '동기화',
				authType: 'new',
				callBackFn: saveBatchMasterList,
			},
		],
	};

	// 그리드 초기화
	const gridCol1 = [
		{
			dataField: 'yyyymmdd',
			headerText: t('년월'),
			dataType: 'code',
			width: 130,
			editable: false,
		},
		{
			dataField: 'dccode',
			headerText: t('물류센터'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'dcname',
			headerText: t('물류센터명'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'channelName',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'confirmweight',
			headerText: t('lbl.DELIVERYWEIGHT'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'etcConfirmweight',
			headerText: t('별도산정상품(미곡)'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'etcConfirmweightAdd',
			headerText: t('별도산정상품(김치)'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'etcSkuEtcConfirmweight',
			headerText: t('별도산정상품(기타)'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'etcCustGunConfirmweight',
			headerText: t('별도산정고객(군납)'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'etcCustEtcConfirmweight',
			headerText: t('별도산정고객(기타)'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'exCustConfirmweight',
			headerText: t('제외고객'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'etcSkuIceConfirmweight',
			headerText: t('별도산정상품(아이스크림)_수량'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'etcPartnerConfirmweight',
			headerText: t('별도산정협력사'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'exSkuConfirmweight',
			headerText: t('제외상품'),
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
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
	// 그리드 속성
	const gridProps = {
		displayTreeOpen: false,
		treeIconFunction: (rowIndex: any, isBranch: any, isOpen: any, depth: any, item: any) => {
			return '';
		},
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false, //체크박스
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.status == '90') {
				return false;
			}
			return true;
		},
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			gridRef.current?.exportToXlsxGrid(params);
		},
	};

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
		// 셀 더블 클릭 이벤트
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			const toNumberSafe = (value: any) => {
				if (value === null || value === undefined || value === '') {
					return 0;
				}
				const num = Number(value);
				return Number.isNaN(num) ? 0 : num;
			};

			const groupData: any = {};
			gridData.forEach((row: any) => {
				const key = `${row.yyyymmdd.substring(0, 7)}${row.dccode}${row.toCustkey}${row.channel}`;

				if (!groupData[key]) {
					groupData[key] = {
						key,
						yyyymmdd: row.yyyymmdd.substring(0, 7),
						dccode: row.dccode,
						dcname: row.dcname,
						toCustkey: row.toCustkey,
						toCustname: row.toCustname,
						channelName: row.channelName,
						confirmweight: 0,
						etcConfirmweight: 0,
						etcConfirmweightAdd: 0,
						etcSkuEtcConfirmweight: 0,
						etcCustGunConfirmweight: 0,
						etcCustEtcConfirmweight: 0,
						exCustConfirmweight: 0,
						etcSkuIceConfirmweight: 0,
						etcPartnerConfirmweight: 0,
						exSkuConfirmweight: 0,
						dcWdConfirmweight: 0,
						dcWdJejuConfirmweight: 0,
						children: [],
					};
				}
				const month = groupData[key];

				// sum 누적 (null 안전)
				month.confirmweight += toNumberSafe(row.confirmweight);
				month.etcConfirmweight += toNumberSafe(row.etcConfirmweight);
				month.etcConfirmweightAdd += toNumberSafe(row.etcConfirmweightAdd);
				month.etcSkuEtcConfirmweight += toNumberSafe(row.etcSkuEtcConfirmweight);
				month.etcCustGunConfirmweight += toNumberSafe(row.etcCustGunConfirmweight);
				month.etcCustEtcConfirmweight += toNumberSafe(row.etcCustEtcConfirmweight);
				month.exCustConfirmweight += toNumberSafe(row.exCustConfirmweight);
				month.etcSkuIceConfirmweight += toNumberSafe(row.etcSkuIceConfirmweight);
				month.etcPartnerConfirmweight += toNumberSafe(row.etcPartnerConfirmweight);
				month.exSkuConfirmweight += toNumberSafe(row.exSkuConfirmweight);
				month.dcWdConfirmweight += toNumberSafe(row.dcWdConfirmweight);
				month.dcWdJejuConfirmweight += toNumberSafe(row.dcWdJejuConfirmweight);

				month.children.push(row);
			});
			// 그리드 초기화
			gridRef.current?.setGridData(Object.values(groupData));
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.current.getFitColumnSizeList(true);

				// yyyymmdd 칼럼 인덱스 찾기
				const yyyymmddIndex = gridCol1.findIndex((col: any) => col.dataField === 'yyyymmdd');
				if (yyyymmddIndex !== -1) {
					colSizeList[yyyymmddIndex] = 130; // yyyymmdd 열 너비 130으로 고정
				}
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="h100">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol1} gridProps={gridProps} />
			</AGrid>
		</>
	);
};
export default IbStoWeightDetail2;
