/*
 ############################################################################
 # FiledataField	: StInquiry.tsx
 # Description		: 재고 > 재고조사 > 재고조사등록 
 # Author			: KimDongHan
 # Since			: 2025.11.02
 ############################################################################
*/
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StInquiryDetail1 from '@/components/st/inquiry/StInquiryDetail1';
import StInquiryDetail2 from '@/components/st/inquiry/StInquiryDetail2';
import StInquirySearch from '@/components/st/inquiry/StInquirySearch';

// API
import { apiGetOrganizeList } from '@/api/cm/apiCmDcXOrganizeManager';
import { apiPostDetailList, apiPostMasterList } from '@/api/st/apiStInquiry';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

// Utils
import TabsArray from '@/components/common/TabsArray';
import { validateForm } from '@/util/FormUtil';

const StInquiry = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어
	const [form] = Form.useForm();
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [titleFunc, setTitleFunc] = useState<any>({});
	const [organizeList, setOrganizeList] = useState<any[]>([]);
	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const refs1: any = useRef(null);

	// Declare init value(3/4)
	const dcList = getUserDccodeList();
	const stockgradeList = getCommonCodeList('STOCKGRADE');
	const storagetypeList = getCommonCodeList('STORAGETYPE');

	// 실사구분
	const searchTypeList = [
		{
			// 전체
			cdNm: t('lbl.ALL'),
			comCd: '',
		},
		{
			// 소비기한
			cdNm: t('lbl.USEBYDATE'),
			comCd: '0',
		},
		{
			// 재고실사
			cdNm: t('lbl.STOCK_TAKE'),
			comCd: '1',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const params = form.getFieldsValue();
		const [fromInquirydt, toInquirydt] = params.inquirydt;
		params.fromInquirydt = fromInquirydt.format('YYYYMMDD');
		params.toInquirydt = toInquirydt.format('YYYYMMDD');
		delete params.inquirydt;

		// 그리드 초기화
		refs.gridRef.current?.clearGridData();
		refs.gridRef1.current?.clearGridData();

		const { data } = await apiPostMasterList(params);

		setGridData(data || []);
	};

	// 조회(상세)
	const searchDetailList = async (rowData: any) => {
		const searchRequestParams = form.getFieldsValue();

		const requestParams = {
			inquirydt: rowData.inquirydt,
			inquiryno: rowData.inquiryno,
			inquiryName: rowData.inquiryName,
			fixdccode: rowData.dccode,
			storerkey: rowData.storerkey,
			priority: rowData.priority,
			organize: rowData.organize,
			lottype: rowData.lottype,
			sku: searchRequestParams.sku,
			status: searchRequestParams.status,
			fromZone: searchRequestParams.fromZone,
			toZone: searchRequestParams.toZone,
			fromLoc: searchRequestParams.fromLoc,
			toLoc: searchRequestParams.toLoc,
			wharea: searchRequestParams.wharea,
			//...searchRequestParams,
		};

		// 그리드 초기화
		refs.gridRef1.current?.clearGridData();
		const { data } = await apiPostDetailList(requestParams);

		setGridData1(data || []);
	};

	const searchBox = {
		inquirydt: dates,
		status: '',
		wharea: '',
		lottype: '',
	};

	/**
	 * 탭 클릭
	 * @param {string} key 탭 키
	 */
	const tabClick = (key: string) => {
		if (key === '1') {
			refs.gridRef?.current?.resize('100%', '100%');
		} else {
			refs1.gridRef?.current?.resize('100%', '100%');
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 소팅 초기화
	useEffect(() => {
		apiGetOrganizeList({}).then(res => {
			setOrganizeList(res.data);
		});
	}, []);

	useEffect(() => {
		setTitleFunc({ searchYn: activeKey === '1' ? searchMasterList : '' });
		refs.gridRef.current?.resize('100%', '100%');
		refs.gridRef1.current?.resize('100%', '100%');
		//refs1.gridRef.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
		searchTypeList,
		dcList,
		stockgradeList,
		storagetypeList,
		organizeList,
		search: searchMasterList,
	};

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: t('lbl.ST_INQUIRY_TAB_1'),
			children: (
				<StInquiryDetail1
					key="StInquiryDetail1"
					ref={refs}
					search={searchMasterList}
					gridData={gridData}
					gridData1={gridData1}
					searchTypeList={searchTypeList}
					searchDetailList={searchDetailList}
				/>
			),
		},
		{
			key: '2',
			label: t('lbl.ST_INQUIRY_TAB_2'),
			children: <StInquiryDetail2 key="StInquiryDetail2" ref={refs1} search={searchMasterList} gridData={gridData2} />,
		},
	];

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<StInquirySearch {...formProps} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />
		</>
	);
};

export default StInquiry;
