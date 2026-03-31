/*
 ############################################################################
 # FiledataField	: RtQCConfirmResult.tsx
 # Description		: 입고 > 입고작업 > 반품판정현황
 # Author			: KimDongHyeon
 # Since			: 2025.07.21
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import dayjs from 'dayjs';
import { apiPostMasterList } from '@/api/rt/apiRtQCConfirmResult';
import { validateForm } from '@/util/FormUtil';
import RtQCConfirmResultSearch from '@/components/rt/qcConfirmResult/RtQCConfirmResultSearch';
import RtQCConfirmResultDetail from '@/components/rt/qcConfirmResult/RtQCConfirmResultDetail';

// Store

const RtQCConfirmResult = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [totalCountDetail, setTotalCountDetail] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			slipdt: dates,
		}),
		[],
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const searchMasterList = async () => {
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}
		const requestParams = form.getFieldsValue();
		const [fromSlipdt, toSlipdt] = requestParams.slipdt;
		requestParams.slipdtFrom = fromSlipdt.format('YYYYMMDD');
		requestParams.slipdtTo = toSlipdt.format('YYYYMMDD');

		const { data } = await apiPostMasterList(requestParams);
		setGridData(data || []);
		setTotalCount(data?.totalCount || 0);
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		reset: () => {
			form.resetFields();
			gridRef.current.clearGridData();
			gridRef1.current.clearGridData();
		},
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchForm {...formProps}>
				<RtQCConfirmResultSearch {...formProps} />
			</SearchForm>

			<RtQCConfirmResultDetail
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridDataDetail={gridDataDetail}
			/>
		</>
	);
};

export default RtQCConfirmResult;
