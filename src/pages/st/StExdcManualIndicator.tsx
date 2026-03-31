/*
 ############################################################################
 # FiledataField	: StExdcManualIndicator.tsx
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

// Store

// API
import { apiGetDataHeaderList } from '@/api/st/apiStExdcManualIndicator';
import StExdcManualIndicatorDetail from '@/components/st/StExdcManualIndicator/StExdcManualIndicatorDetail';
import StExdcManualIndicatorSearch from '@/components/st/StExdcManualIndicator/StExdcManualIndicatorSearch';
import dayjs from 'dayjs';
const StExdcManualIndicator = () => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================
	const refs: any = useRef(null);
	const { t } = useTranslation();

	const [searchForm] = Form.useForm();
	const [gridForm] = Form.useForm();

	const searchRef = useRef(null);
	const [headerSubGridData, setHeaderSubGridData] = useState<any[]>([]);

	const [headerSubTotalCnt, setHeaderSubTotalCnt] = useState(0);

	const [searchBox] = useState({
		dcCode: '2170',
		date: dayjs(),
		// date: baseYyyymm(),
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
			...params,
			baseYyyymm: params.date.format('YYYYMM'),
		};

		apiGetDataHeaderList(searchVal).then(res => {
			// //console.log(res.data);
			setHeaderSubGridData(res.data);
			// setHeaderSubTotalCnt(res.data.list.length);
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
			<MenuTitle authority="searchYn" func={titleFunc} />

			{/* 검색 영역 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<StExdcManualIndicatorSearch ref={searchRef} search={search} form={searchForm} />
			</SearchFormResponsive>

			{/* 상세 그리드 영역 */}
			<StExdcManualIndicatorDetail
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

export default StExdcManualIndicator;
