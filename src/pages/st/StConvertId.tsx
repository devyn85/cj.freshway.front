/*
 ############################################################################
 # FiledataField	: MoveCross.tsx
 # Description		: 재고 > 재고현황 > PLT-ID변경
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api
import { apiPostMasterList } from '@/api/st/apiStConvertId';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import StConvertIdDetail from '@/components/st/convertId/StConvertIdDetail';
import StConvertIdSearch from '@/components/st/convertId/StConvertIdSearch';
import dateUtil from '@/util/dateUtil';
import { useTranslation } from 'react-i18next';

// lib
const StConvertId = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const today = dateUtil.getToDay('YYYY-MM-DD');
	const storerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const [formRef] = Form.useForm();

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: null, // 납품일자
		dccode: null, // 물류센터
		organize: null, // 창고
		stockgrade: null, // 재고속성
		skugroup: null, // 상품분류
		sku: null, // 상품코드
		skuname: null, // 상품명칭
		loc: null, // LOC
		uomSt: null, // 이체단위
		qtySt: null, // 수량
		openqtySt: null, // 가용재고수량
		qtyallocatedSt: null, // 재고할당수량
		qtypickedSt: null, // 피킹재고
		tranqty: null, // 작업수량
		lottable01: null, // 기준일(소비,제조)
		durationTerm: null, // 소비기간(잔여/전체)
		fromStockid: null, // 재고ID
		stocktype: null, // 재고유형
		storagetype: null, // 저장조건
	}); // 검색영역

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	조회
	 */
	const searchMasterList = async () => {
		refs.gridRef.current.clearGridData();
		const params = form.getFieldsValue();

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		searchMasterListImp(params);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp = (params: any) => {
		// API 호출
		apiPostMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StConvertIdSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StConvertIdDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				search={searchMasterList}
				formRef={formRef}
			/>
		</>
	);
};

export default StConvertId;
