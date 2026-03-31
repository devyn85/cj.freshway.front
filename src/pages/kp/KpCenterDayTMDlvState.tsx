/*
 ############################################################################
 # FiledataField	: KpCenterDayTMDlvState.tsx
 # Description		: 지표 > 센터 운영 > 배송조별 출자 평균시간 현황
 # Author			: KimDongHan
 # Since			: 2025.09.01
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
import { apiPostMasterList } from '@/api/kp/apiKpCenterDayTMDlvState';
import KpCenterDayTMDlvStateDetail from '@/components/kp/centerDayTMDlvState/KpCenterDayTMDlvStateDetail';
import KpCenterDayTMDlvStateSearch from '@/components/kp/centerDayTMDlvState/KpCenterDayTMDlvStateSearch';
import dayjs from 'dayjs';

// Store

const KpCenterDayTMDlvState = () => {
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
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		requestParams.deliverydt = requestParams.deliverydt.format('YYYYMMDD');

		// 그리드 초기화
		gridRef.current?.clearGridData();
		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};
	// 검색영역 초기 세팅
	const searchBox = {
		dccode: '',
		deliverydt: dayjs(),
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
				<KpCenterDayTMDlvStateSearch {...formProps} />
			</SearchFormResponsive>

			<KpCenterDayTMDlvStateDetail gridRef={gridRef} gridData={gridData} />
		</>
	);
};

export default KpCenterDayTMDlvState;
