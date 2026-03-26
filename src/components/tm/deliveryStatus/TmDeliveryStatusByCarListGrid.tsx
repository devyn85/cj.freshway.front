/*
 ############################################################################
 # FiledataField	: TmDeliveryStatusByCarListGrid.tsx
 # Description		: 모니터링 > 배송 > 배송현황 > 차량별 탭 그리드
 # Author			: BS.kim
 # Since			: 2025.11.17
 ############################################################################
 */
// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { adjustProps } from '@/lib/AUIGrid/auIGridUtil';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// css
import AGrid from '@/assets/styled/AGrid/AGrid';

// API
import { apiTmDeliveryStatusByCarDetailList } from '@/api/tm/apiTmDeliveryStatus';

// Util
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// Const

// Types

// 파일 정의
const TmDeliveryStatusByCarListGrid = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 변수 정의(1/4)
	const { t } = useTranslation(); // 다국어 처리
	/**
	 * [ props ]
	 * @param {string} gridData - 그리드 데이터
	 * @param {ref} gridRef - 그리드 Ref
	 * @param {Array} hjDongSelect - 행정동
	 * @param {state} setSelectedRowInCenterGrid - 그리드 선택 row state
	 * @param {ref} orderGroupGridRef - 주문 그룹 Ref
	 * @param {Function} searchList - 조회 function
	 * @param {form} form - 조회 조건
	 */
	const { gridData, dayCount, monthCount, gridDayRef, gridMonthRef, gridDetailRef, searchList, form, isActive } = props;

	// React Ref 정의(2/4)
	const changeHistoryPopupRef = useRef(null); // 변경이력팝업 ref

	// 초기값 정의(3/4)
	const [detailGridData, setDetailGridData] = useState([]);

	// 기타(4/4)
	const userInfo = useSelector((state: any) => state.global.globalVariable); // 로그인 유저 정보

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 그리드(당일) props
	const gridDayProps = adjustProps({
		editable: false, // 데이터 수정 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		showRowNumColumn: true, // 행번호
		noDataMessage: t('lbl.NO_DATA'), // 조회 결과가 없습니다.
	});

	// 그리드(당일) columnLayout
	const gridDayCol = [
		{
			dataField: 'contracttypename',
			dataType: 'code',
			headerText: '계약유형',
		},
		{
			dataField: 'arrivalCount',
			dataType: 'numeric',
			headerText: '전체',
		},
		{
			dataField: 'arrivalReportCount',
			dataType: 'numeric',
			headerText: '보고',
		},
		{
			dataField: 'arrivalReportRate',
			dataType: 'numeric',
			headerText: '보고율(%)',
			formatString: '#,##0.00',
		},
		{
			dataField: 'unarrivalReportCount',
			dataType: 'numeric',
			headerText: '미보고',
		},
		{
			headerText: '자동',
			children: [
				{
					dataField: 'normalReportCount',
					dataType: 'numeric',
					headerText: '보고',
				},
				{
					dataField: 'normalReportRate',
					dataType: 'numeric',
					headerText: '보고율(%)',
					formatString: '#,##0.00',
				},
			],
		},
		{
			headerText: '수동',
			children: [
				{
					dataField: 'manualReportCount',
					dataType: 'numeric',
					headerText: '보고',
				},
				{
					dataField: 'manualReportRate',
					dataType: 'numeric',
					headerText: '보고율(%)',
					formatString: '#,##0.00',
				},
			],
		},
		{
			dataField: 'photoRate',
			dataType: 'numeric',
			headerText: '사진촬영율(%)',
			formatString: '#,##0.00',
		},
	];

	// 그리드(당월) props
	const gridMonthProps = adjustProps({
		editable: false, // 데이터 수정 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		showRowNumColumn: true, // 행번호
		noDataMessage: t('lbl.NO_DATA'), // 조회 결과가 없습니다.
	});

	// 그리드(당월) columnLayout
	const gridMonthCol = [
		{
			dataField: 'contracttypename',
			dataType: 'code',
			headerText: '계약유형',
		},
		{
			dataField: 'arrivalCount',
			dataType: 'numeric',
			headerText: '전체',
		},
		{
			dataField: 'arrivalReportCount',
			dataType: 'numeric',
			headerText: '보고',
		},
		{
			dataField: 'arrivalReportRate',
			dataType: 'numeric',
			headerText: '보고율(%)',
			formatString: '#,##0.00',
		},
		{
			dataField: 'unarrivalReportCount',
			dataType: 'numeric',
			headerText: '미보고',
		},
		{
			headerText: '자동',
			children: [
				{
					dataField: 'normalReportCount',
					dataType: 'numeric',
					headerText: '보고',
				},
				{
					dataField: 'normalReportRate',
					dataType: 'numeric',
					headerText: '보고율(%)',
					formatString: '#,##0.00',
				},
			],
		},
		{
			headerText: '수동',
			children: [
				{
					dataField: 'manualReportCount',
					dataType: 'numeric',
					headerText: '보고',
				},
				{
					dataField: 'manualReportRate',
					dataType: 'numeric',
					headerText: '보고율(%)',
					formatString: '#,##0.00',
				},
			],
		},
		{
			dataField: 'photoRate',
			dataType: 'numeric',
			headerText: '사진촬영율(%)',
			formatString: '#,##0.00',
		},
	];

	// 그리드(상세) props
	const gridDetailProps = adjustProps({
		editable: false, // 데이터 수정 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		showRowNumColumn: true, // 행번호
		noDataMessage: t('lbl.NO_DATA'), // 조회 결과가 없습니다.
	});

	// 그리드(상세) columnLayout
	const gridDetailCol = [
		// 차량번호
		{
			dataField: 'carno',
			dataType: 'code',
			headerText: '차량번호',
		},
		// 계약유형
		{
			dataField: 'contracttype',
			dataType: 'code',
			headerText: '계약유형',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
			},
		},
		// 실착지수
		{
			dataField: 'arrivalCount',
			dataType: 'numeric',
			headerText: '전체',
		},
		{
			dataField: 'arrivalReportCount',
			dataType: 'numeric',
			headerText: '보고',
		},
		{
			dataField: 'arrivalReportRate',
			dataType: 'numeric',
			headerText: '보고율(%)',
			formatString: '#,##0.00',
		},
		{
			dataField: 'unarrivalReportCount',
			dataType: 'numeric',
			headerText: '미보고',
		},
		{
			headerText: '자동',
			children: [
				{
					dataField: 'normalReportCount',
					dataType: 'numeric',
					headerText: '보고',
				},
				{
					dataField: 'normalReportRate',
					dataType: 'numeric',
					headerText: '보고율(%)',
					formatString: '#,##0.00',
				},
			],
		},
		{
			headerText: '수동',
			children: [
				{
					dataField: 'manualReportCount',
					dataType: 'numeric',
					headerText: '보고',
				},
				{
					dataField: 'manualReportRate',
					dataType: 'numeric',
					headerText: '보고율(%)',
					formatString: '#,##0.00',
				},
			],
		},
		{
			dataField: 'photoRate',
			dataType: 'numeric',
			headerText: '사진촬영율(%)',
			formatString: '#,##0.00',
		},
	];

	/**
	 * 	조회(상세)
	 * @param params
	 */
	const searchDetailList = async (params: any) => {
		/**
		 * @param {string} deliverydt - 배송일자
		 * @param {string} dccode - 센터
		 * @param {string} contracttype - 계약유형(: 지입, : 고정, : 임시, : 실비)
		 * @param {string} carnoList - 키워드검색(차량번호, 기사)
		 */

		const formdata = props.form.getFieldsValue();
		const searchParams = {
			...params,
			dccode: formdata.dccode,
			deliverydt: commUtil.isEmpty(formdata.deliverydtOri) ? '' : formdata.deliverydtOri.format('YYYYMMDD'),
			carnoList: commUtil.isEmpty(formdata.carnoList)
				? []
				: formdata.carnoList.indexOf(',') > -1
				? formdata.carnoList.split(',')
				: [formdata.carnoList], // 차량번호/기사
		};

		apiTmDeliveryStatusByCarDetailList(searchParams).then(res => {
			if (res.statusCode === 0) {
				setDetailGridData(res.data);
				gridDetailRef.current.setGridData(res.data);
				setTimeout(() => {
					if (res.data.length > 0) {
						const colSizeList = gridDetailRef.current.getFitColumnSizeList(true);
						gridDetailRef.current.setColumnSizeList(colSizeList);
					}
				}, 10);
			}
		});
	};

	useImperativeHandle(ref, () => ({
		searchDetailList,
	}));

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 일별 row 선택시
	useEffect(() => {
		const grid = gridDayRef.current;
		if (!grid) {
			return;
		}

		const handleCellClick = (event: any) => {
			if (!isActive) {
				return;
			}
			gridDetailRef.current.clearGridData();
			searchDetailList(event?.item);
		};

		grid.bind('cellClick', handleCellClick);
		return () => {
			grid.unbind('cellClick', handleCellClick);
		};
	}, [isActive]);

	/**
	 * =====================================================================
	 *  04. jsx
	 * =====================================================================
	 */
	return (
		<>
			<AGrid dataProps={''}>
				<Row gutter={8}>
					<Col span={12}>
						<AGrid dataProps={''}>
							<GridTopBtn gridTitle="당일" totalCnt={dayCount} />
							<AUIGrid ref={gridDayRef} columnLayout={gridDayCol} gridProps={gridDayProps} />
							<GridTopBtn gridTitle="당월" totalCnt={monthCount} />
							<AUIGrid ref={gridMonthRef} columnLayout={gridMonthCol} gridProps={gridMonthProps} />
						</AGrid>
					</Col>
					<Col span={12}>
						<AGrid dataProps={''}>
							<GridTopBtn gridTitle="세부내역" totalCnt={detailGridData.length} />
							<AUIGrid ref={gridDetailRef} columnLayout={gridDetailCol} gridProps={gridDetailProps} />
						</AGrid>
					</Col>
				</Row>
			</AGrid>
		</>
	);
});

export default TmDeliveryStatusByCarListGrid;
