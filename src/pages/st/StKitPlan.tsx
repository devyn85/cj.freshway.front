/*
 ############################################################################
 # FiledataField	: StKitPlan.tsx
 # Description		: 재고 > 재고작업 > KIT상품 계획등록
 # Author			    : 고혜미
 # Since		    	: 25.10.21
 ############################################################################
*/
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
// CSS
import { Form } from 'antd';
// Lib

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// Util
import { apiPostMasterList01, apiPostMasterList02, apiPostMasterList03 } from '@/api/st/apiStKitPlan';
import Splitter from '@/components/common/Splitter';
import StKitPlanDetail1 from '@/components/st/kitPlan/StKitPlanDetail1';
import StKitPlanDetail2 from '@/components/st/kitPlan/StKitPlanDetail2';
import StKitPlanDetail3 from '@/components/st/kitPlan/StKitPlanDetail3';
import StKitPlanSearch from '@/components/st/kitPlan/StKitPlanSearch';

// Type

// Component

const StKitPlan = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();
	const [searchForm] = Form.useForm();

	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	const [totalCnt1, setTotalCnt1] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [totalCnt3, setTotalCnt3] = useState(0);

	// Declare react Ref(2/4)
	const gridRef1: any = useRef(null);
	const gridRef2: any = useRef(null);
	const gridRef3: any = useRef(null);

	// 검색영역 초기 세팅

	const [searchBox] = useState({
		fixdccode: '', // 물류센터
		month: dayjs(), //조회월
		kitSku: '',
		kitSkuName: null, //상품
	});

	// 기타출고 요청 일괄적용 초기 셋팅
	const [requiredBox] = useState({
		gubun: ['REQUEST', 'PLAN', 'PRODUCTION'], //구분
	});

	const [month, setMonth] = useState(searchBox.month);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = () => {
		gridRef1.current.clearGridData();
		gridRef2.current.clearGridData();
		gridRef3.current.clearGridData();
		const params = searchForm.getFieldsValue();

		const searchParam = {
			...params,
			month: params.month.format('YYYYMM'),
		};

		setMonth(params.month);

		apiPostMasterList01(searchParam).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData1(res.data);
				setTotalCnt1(res.data.length);
			} else {
				setTotalCnt1(0);
				setTotalCnt2(0);
				setTotalCnt3(0);
			}
		});
	};

	//	gridRef1 행 선택
	const handleGrid1RowSelect = (selectedRow: any) => {
		const param = searchForm.getFieldsValue();
		const params = {
			kitSku: selectedRow?.kitSku,
			dccode: selectedRow?.dccode,
			month: param.month.format('YYYYMM'),
		};

		gridRef2.current.clearGridData();
		gridRef3.current.clearGridData();
		apiPostMasterList02(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			} else {
				setTotalCnt2(0);
				setTotalCnt3(0);
			}
		});
	};

	//	gridRef2 행 선택
	const handleGrid1RowSelect2 = (selectedRow: any) => {
		const params = {
			sku: selectedRow?.sku,
			dccode: selectedRow?.dccode,
		};
		gridRef3.current.clearGridData();
		apiPostMasterList03(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			} else {
				setTotalCnt3(0);
			}
			gridRef1.current.setFocus?.();
		});
	};

	/**
	 * 공통버튼 클릭
	 */
	const titleFunc = {
		searchYn: searchMasterList,
	};

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
		gridRef3?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<StKitPlanSearch form={searchForm} />
			</SearchFormResponsive>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<StKitPlanDetail1
						key="StKitPlanDetail1"
						ref={gridRef1}
						form={form}
						data={gridData1}
						totalCnt1={totalCnt1}
						month={month}
						initialValues={requiredBox}
						callBackFn={searchMasterList}
						onRowSelect={handleGrid1RowSelect}
					/>,
					<Splitter
						key="StKitPlan-bottom-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<StKitPlanDetail2
								key="StKitPlanDetail2"
								ref={gridRef2}
								form={form}
								data={gridData2}
								totalCnt2={totalCnt2}
								onRowSelect={handleGrid1RowSelect2}
							/>,
							<StKitPlanDetail3
								key="StKitPlanDetail3"
								ref={gridRef3}
								form={form}
								data={gridData3}
								totalCnt3={totalCnt3}
								searchMasterList={searchMasterList}
							/>,
						]}
					/>,
				]}
			/>
		</>
	);
};

export default StKitPlan;
