/*
 ############################################################################
 # FiledataField	: StConvertCG.tsx
 # Description		: 재고 > 재고속성 > 재고속성변경
 # Author			    : 고혜미
 # Since		    	: 25.09.18
 ############################################################################
*/
import { useRef, useState } from 'react';
// CSS
import { Form } from 'antd';
// Lib

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// Util
import { apiDetailList1, apiDetailList2, apiPostMasterList } from '@/api/st/apiStConvertCG';
import Splitter from '@/components/common/Splitter';
import StConvertCGDetail1 from '@/components/st/convertCG/StConvertCGDetail1';
import StConvertCGDetail2 from '@/components/st/convertCG/StConvertCGDetail2';
import StConvertCGDetail3 from '@/components/st/convertCG/StConvertCGDetail3';
import StConvertCGSearch from '@/components/st/convertCG/StConvertCGSearch';

// Type

// Component

const StConvertCG = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const [form] = Form.useForm();
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
		fixdccode: null,
		skuName: null, //상품
		sortkey: 'LOC', // 정렬순서
		wharea: null, // 창고구분
		fromzoc: null, // 존(FROM)
		tozoc: null, // 존(TO)
		stockgrade: null, // 재고속성
		fromloc: null, // 로케이션(FROM)
		toloc: null, // 로케이션(TO)
	});

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
		const params = form.getFieldsValue();

		apiPostMasterList(params).then(res => {
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
		const { sku, fixdccode, stockgrade, fromloc, toloc } = form.getFieldsValue();

		const params = {
			sku,
			fixdccode,
			stockgrade,
			fromloc,
			toloc,
			wharea: selectedRow?.wharea,
			whareafloor: selectedRow?.whareafloor,
			zone: selectedRow?.zone,
		};

		gridRef2.current.clearGridData();
		gridRef3.current.clearGridData();
		apiDetailList1(params).then(res => {
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
		const { sku, fixdccode, sortkey, fromloc, toloc } = form.getFieldsValue();

		const params = {
			sku,
			fixdccode,
			sortkey,
			fromloc,
			toloc,
			stockgrade: selectedRow?.stockgrade,
			loccategory: selectedRow?.loccategory,
			loctype: selectedRow?.loctype,
			wharea: selectedRow?.wharea,
			whareafloor: selectedRow?.whareafloor,
			zone: selectedRow?.zone,
		};
		gridRef3.current.clearGridData();
		apiDetailList2(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			} else {
				setTotalCnt3(0);
			}
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
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StConvertCGSearch form={form} />
			</SearchFormResponsive>

			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<Splitter
						key="StConvertCG-bottom-splitter"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<StConvertCGDetail1
								key="StConvertCGDetail1"
								ref={gridRef1}
								form={form}
								data={gridData1}
								totalCnt1={totalCnt1}
								onRowSelect={handleGrid1RowSelect}
							/>,
							<StConvertCGDetail2
								key="StConvertCGDetail2"
								ref={gridRef2}
								form={form}
								data={gridData2}
								totalCnt2={totalCnt2}
								onRowSelect={handleGrid1RowSelect2}
							/>,
						]}
					/>,
					<StConvertCGDetail3
						key="StConvertCGDetail3"
						ref={gridRef3}
						form={form}
						data={gridData3}
						totalCnt3={totalCnt3}
						callBackFn={searchMasterList}
					/>,
				]}
			/>
		</>
	);
};

export default StConvertCG;
