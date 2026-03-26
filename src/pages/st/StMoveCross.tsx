/*
 ############################################################################
 # FiledataField	: MoveCross.tsx
 # Description		: 재고 > 재고현황 > CROSS자동보충
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api
// import { apiPostMasterList } from '@/api/st/DpApiMoveCross';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiPostMasterList } from '@/api/st/apiStMoveCross';
import StMoveCrossDetail from '@/components/st/moveCross/StMoveCrossDetail';
import StMoveCrossSearch from '@/components/st/moveCross/StMoveCrossSearch';

// lib
const StMoveCross = () => {
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
	const storerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);
	const [formRef] = Form.useForm();

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		sku: '',
		skuName: '',
		storagetype: '',
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
	const searchMasterList = () => {
		refs.gridRef.current.clearGridData();
		refs.gridRef1.current.clearGridData();
		const params = form.getFieldsValue();

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
				<StMoveCrossSearch search={searchMasterList} form={form} />
			</SearchFormResponsive>
			<StMoveCrossDetail
				ref={refs}
				form={form}
				data={gridData}
				totalCnt={totalCnt}
				formRef={formRef}
				search={searchMasterList}
			/>
		</>
	);
};

export default StMoveCross;
