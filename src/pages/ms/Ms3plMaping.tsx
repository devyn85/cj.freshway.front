/*
 ############################################################################
 # FiledataField	: Ms3plMaping.tsx
 # Description		: 기준정보 > 기준정보작업 > 3PL전산기준목록
 # Author			: KimDongHyeon
 # Since			: 2025.11.18
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
import dayjs from 'dayjs';
import { apiPostMasterList } from '@/api/ms/apiMs3plMaping';
import { validateForm } from '@/util/FormUtil';
import Ms3plMapingSearch from '@/components/ms/3plMaping/Ms3plMapingSearch';
import Ms3plMapingDetail from '@/components/ms/3plMaping/Ms3plMapingDetail';

// Store

const Ms3plMaping = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [loopTrParams, setLoopTrParams] = useState({});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();
	const [form2] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = {
		slipdt: dates,
	};

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

		const { data } = await apiPostMasterList(requestParams);
		setGridData(data || []);
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current.clearGridData();
		},
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<Ms3plMapingSearch {...formProps} />
			</SearchFormResponsive>

			<Ms3plMapingDetail gridRef={gridRef} gridData={gridData} />
		</>
	);
};

export default Ms3plMaping;
