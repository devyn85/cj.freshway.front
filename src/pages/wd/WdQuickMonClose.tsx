/*
 ############################################################################
 # FiledataField	: QuickMonClose.tsx
 # Description		: 출고 > 출고작업 > 퀴배송상세
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api
import { apiPostMasterList } from '@/api/wd/apiWdQuickMonClose';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import WdQuickMonCloseDetail from '@/components/wd/quickMonClose/WdQuickMonCloseDetail';
import WdQuickMonCloseSearch from '@/components/wd/quickMonClose/WdQuickMonCloseSearch';
import dateUtil from '@/util/dateUtil';

// lib
const WdQuickMonClose = () => {
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
	const [formRef] = Form.useForm();
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPage, setTotalPage] = useState(0);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: null,
		sku: null,
		skuName: null,
		stocktype: null,
		storagetype: null,
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
		// 그리드/상태 초기화
		refs.gridRef?.current?.clearGridData?.();
		setGridData([]);
		setTotalCnt(0);

		const params = {
			...form.getFieldsValue(),
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'),
			sttlYm: commUtil.isNull(form.getFieldValue('sttlYm')) ? '' : form.getFieldValue('sttlYm').format('YYYYMM'),
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
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	/**
	 * 모든 그리드 데이터 초기화 (조건 변경 시 사용)
	 */
	const clearAllGridData = () => {
		refs.gridRef.current?.clearGridData();

		// 상태도 초기화
		setGridData([]);
		setTotalCnt(0);
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

	// 공통 props 객체
	const commonProps = {
		form,
		formRef,
		search: searchMasterList,
		clearAllGridData, // 모든 그리드 데이터 초기화 함수
	};

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<WdQuickMonCloseSearch {...commonProps} />
			</SearchFormResponsive>
			<WdQuickMonCloseDetail {...commonProps} ref={refs} data={gridData} totalCnt={totalCnt} formRef={formRef} />
		</>
	);
};

export default WdQuickMonClose;
