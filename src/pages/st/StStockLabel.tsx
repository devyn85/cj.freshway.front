/*
 ############################################################################
 # FiledataField	: StStockLabel.tsx
 # Description		: 재고 > 재고현황 > 재고라벨출력
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api
import { apiPostMasterList } from '@/api/st/apiStStockLabel';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import StStockLabelDetail from '@/components/st/stStockLabel/StStockLabelDetail';
import StStockLabelSearch from '@/components/st/stStockLabel/StStockLabelSearch';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';

// lib
const StStockLabel = () => {
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

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: [today, today], // 조회기간(시작일, 종료일)
		//fixdccode: '', // 물류센터
		sku: '', // 상품코드
		stocktype: '', // 재고위치
		stockgrade: '', // 재고속성
		lottable01yn: '', // 소비기한여부
		serialno: '', // 이력번호
		storagetype: '', // 저장조건
		organize: '', // 조직
		fromloc: '', // 출발로케이션
		toloc: '', // 도착로케이션
		zone: '', // 존
		stockid: '', // 재고ID
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

		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const params = {
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'), // 조회 시작일 (YYYYMMDD)
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'), // 조회 종료일 (YYYYMMDD)
			fixdccode: commUtil.nvl(form.getFieldValue('fixdccode'), ''), // 물류센터 코드
			sku: commUtil.nvl(form.getFieldValue('sku'), ''), // 상품코드
			stocktype: commUtil.nvl(form.getFieldValue('stocktype'), ''), // 재고위치
			stockgrade: commUtil.nvl(form.getFieldValue('stockgrade'), ''), // 재고속성
			lottable01yn: commUtil.nvl(form.getFieldValue('lottable01yn'), ''), // 소비기한여부
			serialno: commUtil.nvl(form.getFieldValue('serialno'), ''), // 이력번호
			storagetype: commUtil.nvl(form.getFieldValue('storagetype'), ''), // 저장조건
			organize: commUtil.nvl(form.getFieldValue('organize'), ''), // 조직
			fromloc: commUtil.nvl(form.getFieldValue('fromloc'), ''), // 출발로케이션
			toloc: commUtil.nvl(form.getFieldValue('toloc'), ''), // 도착로케이션
			zone: commUtil.nvl(form.getFieldValue('zone'), ''), // 존
			stockid: commUtil.nvl(form.getFieldValue('stockid'), ''), // 재고ID
		};

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
				<StStockLabelSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StStockLabelDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StStockLabel;
