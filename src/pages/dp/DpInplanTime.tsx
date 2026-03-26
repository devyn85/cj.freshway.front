/*
 ############################################################################
 # FiledataField	: DpInplanTime.tsx
 # Description		: 입고 > 입고현황 > 입고 예정진행 현황(입차시간)
 # Author			: KimDongHan
 # Since			: 2025.12.01
 ############################################################################
*/
import { useRef, useState } from 'react';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterList } from '@/api/dp/apiDpInplanTime';
import DpInplanTimeDetail from '@/components/dp/inplanTime/DpInplanTimeDetail';
import DpInplanTimeSearch from '@/components/dp/inplanTime/DpInplanTimeSearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const DpInplanTime = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 다국어
	const { t } = useTranslation();

	// 준수/미준수
	const complyList = [
		{
			// 전체
			cdNm: t('lbl.ALL'),
			comCd: '',
		},
		{
			// 준수
			cdNm: t('lbl.COMPLY'),
			comCd: 'Y',
		},
		{
			// 미준수
			cdNm: t('lbl.NON_COMPLY'),
			comCd: 'N',
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

		const requestParams = form.getFieldsValue();

		const [deliverydateFrom, deliverydateTo] = requestParams.deliverydate;
		requestParams.deliverydateFrom = deliverydateFrom.format('YYYYMMDD');
		requestParams.deliverydateTo = deliverydateTo.format('YYYYMMDD');

		const hasFrom =
			requestParams.diffHourFrom !== undefined &&
			requestParams.diffHourFrom !== null &&
			String(requestParams.diffHourFrom).trim() !== '';
		const hasTo =
			requestParams.diffHourTo !== undefined &&
			requestParams.diffHourTo !== null &&
			String(requestParams.diffHourTo).trim() !== '';
		if ((hasFrom && !hasTo) || (!hasFrom && hasTo)) {
			// showAlert 함수가 프로젝트에 있으면 사용, 없으면 window.alert로 대체
			// 예정입고 차이 시간은 From To 둘 다 입력하셔야 합니다.
			showAlert(null, t('msg.MSG_DP_INPLAN_TIME_001'));
			return;
		}
		// diffHourFrom이 diffHourTo보다 큰 경우 체크
		if (hasFrom && hasTo) {
			const fromNum = Number(requestParams.diffHourFrom);
			const toNum = Number(requestParams.diffHourTo);
			if (!isNaN(fromNum) && !isNaN(toNum) && fromNum > toNum) {
				// 예정입고 차이 시간은 From 보다 To 가 클 수는 없습니다.
				// 입문시간이 예정시간 보다 빠른 경우 - 로 표기 됩니다.
				showAlert(null, t('msg.MSG_DP_INPLAN_TIME_002'));
				return;
			}
		}
		delete requestParams.deliverydate;

		// 그리드 초기화
		gridRef.current?.clearGridData();
		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};

	// 검색영역 초기 세팅
	const searchBox = {
		deliverydate: dates,
		channel: '',
		complyYn: '',
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearGridData();
		// },
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		complyList,
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
				<DpInplanTimeSearch {...formProps} />
			</SearchFormResponsive>

			<DpInplanTimeDetail gridRef={gridRef} gridData={gridData} complyList={complyList} />
		</>
	);
};

export default DpInplanTime;
