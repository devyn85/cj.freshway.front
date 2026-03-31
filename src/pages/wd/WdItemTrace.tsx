/*
 ############################################################################
 # FiledataField	: WdItemTrace.tsx
 # Description		: 모니터링 > 검수 > 검수 공정별 현황
 # Author			: KimDongHan
 # Since			: 2025.11.17
 ############################################################################
*/
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterList } from '@/api/wd/apiWdItemTrace';
import WdItemTraceDetail from '@/components/wd/itemTrace/WdItemTraceDetail';
import WdItemTraceSearch from '@/components/wd/itemTrace/WdItemTraceSearch';
import Constants from '@/util/constants';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Store

const WdItemTrace = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const modalRef = useRef(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();

	const [popupForm] = Form.useForm();
	const [popupData, setPopupData] = useState<any>(null);

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 다국어
	const { t } = useTranslation();

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
		const requestParams = form.getFieldsValue();
		requestParams.deliverydate = requestParams.deliverydate.format('YYYYMMDD');

		gridRef.current?.clearGridData();
		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};

	const openPop = () => {
		// 팝업 열기
		const width = window.screen.availWidth;
		const height = window.screen.availHeight;
		const popupUrl = `/wd/WDInspectMntPop?${Constants.WIN_POPUP.KEY}=${Constants.WIN_POPUP.VALUE}`;

		const popup = window.open(popupUrl, 'WDInspectMntPop', `width=${'1920'},height=${'1080px'},left=0,top=0`);
		//const popup = window.open(popupUrl, 'WDInspectMntPop', 'width=1920,height=480,left=0,top=0');

		// 팝업이 준비되면 데이터 전송
		const popParams = {
			dccode: form.getFieldValue('dccode'),
			popType: form1.getFieldValue('popType'),
			storageOptions: getCommonCodeList('STORAGETYPE', t('lbl.ALL'), ''),
		};

		const handleMessage = (event: MessageEvent) => {
			if (event.data === 'popup-ready' && popup) {
				popup.postMessage(popParams, window.location.origin);
				window.removeEventListener('message', handleMessage);
			}
		};

		window.addEventListener('message', handleMessage);
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearGridData();
		// 	},
	};

	// 검색영역 초기 세팅
	const searchBox = {
		deliverydate: dayjs(),
		channel: '',
		storagetype: '',
		shortageYn: '',
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
	};

	const closeEvent = () => {
		modalRef.current?.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 소팅 초기화
	useEffect(() => {
		gridRef.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
	});

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<WdItemTraceSearch {...formProps} />
			</SearchFormResponsive>

			<WdItemTraceDetail gridRef={gridRef} gridData={gridData} form1={form1} openPop={openPop} />
		</>
	);
};

export default WdItemTrace;
