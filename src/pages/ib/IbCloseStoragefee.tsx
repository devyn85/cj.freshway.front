/*
 ############################################################################
 # FiledataField	: IbCloseStoragefeeClose.tsx
 # Description		: 보관료 마감 처리 
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.29
 ############################################################################
*/
// CSS
// Lib
import { Form } from 'antd';
import { Tabs } from 'antd/lib';
import dayjs, { Dayjs } from 'dayjs';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Util
// Type
// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import IbCloseStoragefeeCloseDetail from '@/components/ib/closeStoragefee/IbCloseStoragefeeCloseDetail';
import IbCloseStoragefeeSearch from '@/components/ib/closeStoragefee/IbCloseStoragefeeSearch';
import IbCloseStoragefeeStatusDetail from '@/components/ib/closeStoragefee/IbCloseStoragefeeStatusDetail';

// Store
import { useAppSelector } from '@/store/core/coreHook';
// API
import { apigetDataHeaderlist, apiGetDataStatusHeaderlist } from '@/api/ib/apiIbCloseStoragefee';

const IbCloseStoragefee = () => {
	// =====================================================================
	//  01. 변수 선언부
	// =====================================================================
	const refs: any = useRef(null);
	const refs1: any = useRef(null);
	// const isFirstRender = useRef(true);
	const { t } = useTranslation();

	const [activeTabKey, setActiveTabKey] = useState('1');
	const [searchForm] = Form.useForm();
	// const globalVariable = useAppSelector(state => state.global.globalVariable);
	const dcCode = useAppSelector((state: any) => state.global.globalVariable.gDccode);
	const searchRef = useRef(null);

	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const [gridData1, setGridData1] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dcCode: '2170',
		// date: dayjs(),
		accountsYn: null,
		closeYn: null,
	});

	// =====================================================================
	//  02. 함수
	// =====================================================================

	//날짜변환(오류나서 만듬...)
	/**
	 *
	 * @param val
	 */
	const toYYYYMM = (val: unknown): string | null => {
		if (!val) return null;
		if (Array.isArray(val)) {
			// RangePicker: [start, end]
			return val[0] ? dayjs(val[0]).format('YYYYMM') : null;
		}
		// 단건 DatePicker
		return dayjs(val as Dayjs | string | Date).format('YYYYMM');
	};
	const searchMasterList = async () => {
		const params = searchForm.getFieldsValue();
		const isValid = await validateForm(searchForm);
		if (!isValid) return;

		const dateVal = toYYYYMM(params.date);

		if (activeTabKey === '1') {
			// 탭1: 정산여부(accountsYn) 사용
			const searchVal = {
				...params,
				stockMonth: dateVal,
			};
			// 방어: 탭2용 필드는 제거
			// delete searchVal.closeYn;
			// delete searchVal.closeMonth;
			// 필요 없으면 date 원본도 제거

			apiGetDataStatusHeaderlist(searchVal).then(res => {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			});
		} else if (activeTabKey === '2') {
			// 탭2: 마감여부(closeYn) 사용
			const searchVal = {
				...params,
				closeMonth: dateVal,
				closeYn: params.closeYn ?? '', // ← 여기! accountsYn 아님
			};
			// 방어: 탭1용 필드는 제거
			// delete searchVal.accountsYn;
			// delete searchVal.stockMonth;

			apigetDataHeaderlist(searchVal).then(res => {
				setGridData1(res.data);
				setTotalCnt1(res.data.length);
			});
		}
	};
	/**
	 * 버튼 설정
	 */
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * 탭 설정
	 */
	const tabs = [
		{
			key: '1',
			label: '정산현황',
			children: (
				<IbCloseStoragefeeStatusDetail
					ref={refs}
					data={gridData}
					totalCnt={totalCnt}
					form={searchForm}
					callback={searchMasterList}
					gDccode={dcCode}
				/>
			),
		},
		{
			key: '2',
			label: '마감처리',
			children: (
				<IbCloseStoragefeeCloseDetail
					ref={refs1}
					data={gridData1}
					totalCnt={totalCnt1}
					form={searchForm}
					callback={searchMasterList}
					toYYYYMM={toYYYYMM}
					gDccode={dcCode}
				/>
			),
		},
	];
	// =====================================================================
	//  03. react hook event
	//  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	// =====================================================================

	/**
	 * 탭 내의 그리드 사이즈 초기화
	 */
	useEffect(() => {
		refs.gridRef?.current.resize(); // 그리드 크기 조정
		refs1.gridRef?.current.resize(); // 그리드 크기 조정
	}, [activeTabKey]);

	// /**
	//  * 탭 변경시 조회
	//  */
	// useEffect(() => {
	// 	// init시에는 검색 X...?
	// 	if (isFirstRender.current) {
	// 		isFirstRender.current = false;
	// 		return;
	// 	}
	// 	searchMasterList();
	// }, [activeTabKey]);
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn" func={titleFunc} />

			{/* 검색 영역 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<IbCloseStoragefeeSearch ref={searchRef} search={searchMasterList} form={searchForm} activeKey={activeTabKey} />
			</SearchFormResponsive>
			<Tabs items={tabs} activeKey={activeTabKey} onChange={setActiveTabKey} className="contain-wrap" />
		</>
	);
};

export default IbCloseStoragefee;
