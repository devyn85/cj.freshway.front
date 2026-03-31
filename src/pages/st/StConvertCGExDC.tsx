/*
 ############################################################################
 # FiledataField	: StConvertCGExDcSearch.tsx
 # Description		: 외부비축재고속성변경
 # Author			    : ParkJinWoo (jwpark1104@cj.net)
 # Since			    : 25.06.25
 ############################################################################
*/
// CSS

// Lib
import { Form } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Util

// Type

// Component

import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StConvertCGExDcDetail from '@/components/st/convertCGExDC/StConvertCGExDcDetail';
import StConvertCGExDcSearch from '@/components/st/convertCGExDC/StConvertCGExDcSearch';

// Store

// API
import { apiGetDataHeaderList } from '@/api/st/apiStConvertCGExDc';
const StConvertCGExDC = () => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================
	const refs: any = useRef(null);
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(false);
	const [searchForm] = Form.useForm();
	const [gridForm] = Form.useForm();

	const searchRef = useRef(null);
	const [headerSubGridData, setHeaderSubGridData] = useState<any[]>([]);
	const [detailGridData, setDetailGridData] = useState<any[]>([]);
	const [headerSubTotalCnt, setHeaderSubTotalCnt] = useState(0);
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dcCode: '2170',
		stockGrade: null,
	});

	// =====================================================================
	//  02. 함수
	// =====================================================================

	/**
	 * 검색 버튼 클릭 시 실행
	 */
	const search = () => {
		const params = searchForm.getFieldsValue();

		const searchVal = {
			sku: params.sku,
			blNo: params.blNo,
			multiOrganize: params.organize,
			organize: params.organize,
			stockGrade: params.stockGrade,
			dcCode: params.dcCode,
			...(params.blNo ? { searchBl: 'Y' } : {}),
		};

		apiGetDataHeaderList(searchVal).then(res => {
			setHeaderSubGridData(res.data);
			setHeaderSubTotalCnt(res.data.length);
		});
	};
	/**
	 * 초기화
	 * @returns {void}
	 */
	const resetFn = () => {
		refs.gridRefDtl.current.clearGridData();
		refs.gridRef.current.clearGridData();
		searchForm.resetFields();
	};

	const titleFunc = {
		searchYn: search,
		reset: resetFn, // 초기화
	};

	// =====================================================================
	//  03. react hook event
	//  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	// =====================================================================
	// 필요 시 hook 추가

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" func={titleFunc} />

			{/* 검색 영역 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<StConvertCGExDcSearch ref={searchRef} search={search} form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 그리드 영역 */}
			<StConvertCGExDcDetail
				ref={refs}
				form={gridForm}
				searchForm={searchForm}
				headerData={headerSubGridData}
				headerTotalCnt={headerSubTotalCnt}
				search={search}
			/>
		</>
	);
};

export default StConvertCGExDC;
