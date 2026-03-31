/*
 ############################################################################
 # FiledataField	: StStock.tsx
 # Description		: 재고 > 재고현황 > 재고조회
 # Author			: 성상수
 # Since			: 25.05.16
 ############################################################################
*/
import { Form } from 'antd';
import { useEffect, useRef, useState } from 'react';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiPostMasterList } from '@/api/st/apiStStock';
import StStockDetail from '@/components/st/stock/StStockDetail';
import StStockSearch from '@/components/st/stock/StStockSearch';
import commUtil from '@/util/commUtil';
import styled from 'styled-components';

// lib

const StStock = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	const fixdccode = Form.useWatch('fixdccode', form);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	// 검색영역 초기 세팅

	const [searchBox] = useState({
		fixdccode: null, // 물류센터 기본 선택값
		organizenm: null, // 창고
		sortkey: 'LOC', // 정열순서
		usebydatefreert: null, // 소비기한잔여(%)
		skuName: null, // 상품명
		storagetype: null, // 저장조건
		lottable01yn: null, // 소비기한여부
		stocktype: null, // 재고위치
		stockgrade: null, // 재고속성
		serialno: null, // 이력번호
		zone: null, // 피킹존
		loccategory: null, // 로케이션종류
		fromloc: null, // 로케이션(FROM)
		toloc: null, // 로케이션(TO)
		zeroQtyYn: null, // 현재고 0인 상품 제외
		locSkuSumYn: null, // 로케이션/상품별 합계표시
		except1: null, // CROSS존제외
		except2: null, // STAGE존제외
		except3: null, // CANCEL존제외
		except4: null, // 소비기한9999제외
		stockAmount: '0',
	});

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
		let params = form.getFieldsValue();
		let fixdccode = commUtil.nvl(form.getFieldValue('fixdccode'), []);

		refs.gridRef.current.clearGridData();

		if (!fixdccode || fixdccode.length === 0) {
			showAlert(null, '물류센터를 선택해주세요.');
			return;
		}
		if (Array.isArray(fixdccode) && fixdccode.length > 1) {
			//물류센터를 2개이상 선택시
			if (commUtil.isNull(params.sku)) {
				showAlert(null, '물류센터 멀티선택시 상품코드는 필수입니다.');
				return;
			}
		}

		fixdccode = fixdccode.toString(); // 물류센터 ->	문자열 변환[1,2,3]
		const storagetype = commUtil.nvl(form.getFieldValue('storagetype'), []).toString(); //  저장조건 -> 문자열 변환[1,2,3]

		params = { ...params, fixdccode: fixdccode, storagetype: storagetype };

		apiPostMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}

			// 검색 후 단가/금액표시 체크박스 초기화
			form.setFieldsValue({ stockAmount: '0' });
			form.setFieldsValue({ stockAmount_checkbox: false });
		});
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
	// START.로케이션/상품별 합계표시 여부
	const locSkuSumYn = Form.useWatch('locSkuSumYn', form);
	useEffect(() => {
		if (locSkuSumYn === '1') {
			refs.gridRef.current.setGroupBy(['loc', 'sku'], ['loc', 'sku']);
		} else {
			refs.gridRef.current.setGroupBy([], []);
		}
	}, [locSkuSumYn]);
	// END.로케이션/상품별 합계표시 여부

	// 그리드 데이터 변경 시 skuname 컬럼 너비 설정
	useEffect(() => {
		if (gridData.length > 0 && refs.gridRef?.current) {
			setTimeout(() => {
				const columnIndex = refs.gridRef.current?.getColumnIndexByDataField('skuname');
				if (columnIndex !== undefined && columnIndex !== -1) {
					refs.gridRef.current?.setColumnWidth(columnIndex, 200);
				}
			}, 200);
		}
	}, [gridData]);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsiveWrap>
				<SearchFormResponsive form={form} initialValues={searchBox}>
					<StStockSearch search={searchMasterList} form={form} fixdccode={fixdccode} />
				</SearchFormResponsive>
			</SearchFormResponsiveWrap>
			<StStockDetail ref={refs} form={form} data={gridData} totalCnt={totalCnt} />
		</>
	);
};

export default StStock;

const SearchFormResponsiveWrap = styled.div`
	li {
		.ant-row.ant-form-item-row {
			.ant-form-item-label {
				padding-left: 4px;
			}
			.ant-form-item-control {
				padding: 2px 4px;
			}
		}
	}
`;
