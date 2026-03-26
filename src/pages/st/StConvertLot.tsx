/*
 ############################################################################
 # FiledataField	: StConvertLot.tsx
 # Description		: 재고 > 재고조정 > 유통기한변경
 # Author			: 성상수
 # Since			: 25.05.16
 ############################################################################
*/
import { Form } from 'antd';

//Api

//Component
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util

// lib
import axios from '@/api/Axios';
import { SearchForm } from '@/components/common/custom/form';
import StConvertLotDetail from '@/components/st/convertLot/StConvertLotDetail';
import StConvertLotSearch from '@/components/st/convertLot/StConvertLotSearch';
import commUtil from '@/util/commUtil';
import { useEffect, useRef, useState } from 'react';

const StConvertLot = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const [form] = Form.useForm();
	const [formGrid] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const [formRef] = Form.useForm();
	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	// 검색영역 초기 세팅
	const [searchBox] = useState({
		skuName: null,
		sku: null,
		sortkey: null,
		fromzone: null,
		tozone: null,
		fromloc: null, // 로케이션(From)
		toloc: null, // 로케이션(To)
		blno: null, // B/L 번호
		serialno: null, // 이력 번호
		contractcompanyName: null, // 계약업체 (display name)
		contractcompany: null, // 계약업체 (code)
		lottable01: null, // 기준일(소비,제조)
		stockgrade: null, // 재고속성
		skugroupName: null, // 상품분류 (display name)
		skugroup: null, // 상품분류 (code)
		dt: null, // 날짜 범위 (useEffect에서 설정)
	}); // 검색영역 초기값

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		if (params.serialno || params.blno || params.contractcompany) {
			params.searchserial = 'Y';
		}

		params.dt1 = commUtil.isNull(form.getFieldValue('dt')) ? '' : form.getFieldValue('dt')[0].format('YYYYMMDD');
		params.dt2 = commUtil.isNull(form.getFieldValue('dt')) ? '' : form.getFieldValue('dt')[1].format('YYYYMMDD');

		// dtFlag와 lottable01을 YYYYMMDD 형식으로 변환
		if (params.lottable01) {
			params.lottable01 = params.lottable01.format('YYYYMMDD');
		}

		//refs.current.setHandlerSearch();

		apiGetMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
	};

	/**
	 * 조회 api 함수
	 * @param {object} params - 파라미터
	 * @returns {Promise<any>} Axios response data
	 */
	const apiGetMasterList = (params: any) => {
		return axios.post('/api/st/convertLot/v1.0/getMasterList', params).then(res => res.data);
	};

	/**
	 * 공통버튼 클릭
	 */
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		//
	}, []);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchForm form={form} initialValues={searchBox}>
				<StConvertLotSearch search={searchMasterList} form={form} />
			</SearchForm>
			<StConvertLotDetail
				ref={refs}
				form={formGrid}
				data={gridData}
				totalCnt={totalCnt}
				formRef={formRef}
				search={searchMasterList}
			/>
		</>
	);
};

export default StConvertLot;
