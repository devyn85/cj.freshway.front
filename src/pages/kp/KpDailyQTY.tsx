/*
 ############################################################################
 # FiledataField	: KpDailyQTY.tsx
 # Description		: 지표 > 센터 운영 > 일일 물동량 조회
 # Author			: KimDongHan
 # Since			: 2025.09.02
 ############################################################################
*/
import { useEffect, useRef, useState } from 'react';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterList } from '@/api/kp/apiKpDailyQTY';
import KpDailyQTYDetail from '@/components/kp/dailyQTY/KpDailyQTYDetail';
import KpDailyQTYSearch from '@/components/kp/dailyQTY/KpDailyQTYSearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const KpDailyQTY = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 다국어
	// const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		let params = form.getFieldsValue();
		let fixdccode = commUtil.nvl(form.getFieldValue('fixdccode'), []);

		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		fixdccode = fixdccode.toString(); // 물류센터 ->	문자열 변환[1,2,3]
		params = { ...params, fixdccode: fixdccode };

		const [docdtFrom, docdtTo] = params.docdt;
		params.docdtFrom = docdtFrom.format('YYYYMMDD');
		params.docdtTo = docdtTo.format('YYYYMMDD');

		// 그리드 초기화
		gridRef.current?.clearGridData();
		const { data } = await apiPostMasterList(params);

		setGridData(data || []);
	};

	// 검색영역 초기 세팅
	const searchBox = {
		docdt: dates,
		channel: '',
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearSortingAll();
		// 	gridRef.current?.clearGridData();
		// },
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
				<KpDailyQTYSearch {...formProps} />
			</SearchFormResponsive>

			<KpDailyQTYDetail gridRef={gridRef} gridData={gridData} />
		</>
	);
};

export default KpDailyQTY;
