/*
 ############################################################################
 # FiledataField	: StAbcQuery.tsx
 # Description		: 재고 > 재고운영 > ABC 분석
 # Author			: KimDongHan
 # Since			: 2025.11.12
 ############################################################################
*/
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form, Tabs } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterT1List, apiPostMasterT2List, apiPostSaveMasterT2List } from '@/api/st/apiStAbcQuery';
import StAbcQueryDetail from '@/components/st/abcQuery/StAbcQueryDetail';
import StAbcQuerySearch from '@/components/st/abcQuery/StAbcQuerySearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const StAbcQuery = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
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
	const [gridData1, setGridData1] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	const tabItems = [
		{
			// 분석
			key: '1',
			label: t('lbl.ST_ABC_QUERY_TAB_1'),
		},
		{
			// 기준
			key: '2',
			label: t('lbl.ST_ABC_QUERY_TAB_2'),
		},
	];

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

		params.docdt = dates[0].format('YYYYMMDD');

		let data;
		if (activeKey === '1') {
			gridRef.current?.clearGridData();
			({ data } = await apiPostMasterT1List(params));
			setGridData(data || []);
		} else if (activeKey === '2') {
			gridRef1.current?.clearGridData();
			({ data } = await apiPostMasterT2List(params));
			setGridData1(data || []);
		}
	};

	// 저장
	const saveMasterT2List = async () => {
		const checkedItems = gridRef1.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef1.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 수정된 것만(체크박스 제외)
		// validationYn: false 옵션으로 유효성 검사 로직 제외
		const updatedItems = gridRef1.current?.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length === 0) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// 필수값 체크
		if (!gridRef1.current?.validateRequiredGridData()) {
			return;
		}

		// 중복컬럼 체크
		if (!gridRef1.current?.validatePKGridData(['dccode', 'abcName'])) {
			return;
		}

		// dpRatio + wdRatio + trunRatio 합이 100 인지 검증
		for (let i = 0; i < updatedItems.length; i++) {
			const row = updatedItems[i] || {};
			const dp = Number(row.dpRatio) || 0;
			const wd = Number(row.wdRatio) || 0;
			const tr = Number(row.trunRatio) || 0;
			const sum = dp + wd + tr;

			// 허용 오차: 부동소수점 이슈 방지
			if (Math.abs(sum - 100) > 0.0001) {
				showAlert(
					null,
					// 분석명칭 : [{{0}}]\r\n입고,출고,회전율 가중치의\r\n합은 100 이어야 합니다.\r\n(현재 합 : [{{1}}])
					t('msg.MSG_ST_ABC_QUERY_001', [row.abcName, sum]),
				);
				return;
			}
		}

		// 저장하시겠습니까? 신규 : N건, 수정 : N건, 삭제 : N건
		gridRef1.current?.showConfirmSave(() => {
			const params = {
				saveDataT2List: updatedItems,
			};

			// 저장 API 호출
			apiPostSaveMasterT2List(params).then((res: any) => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// 재조회
						searchMasterList();
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	// 검색영역 초기 세팅
	const searchBox = {
		wharea: '',
		loccategory: '',
		lottype: '',
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearGridData();
		// 	gridRef1.current?.clearGridData();
		// },
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
	// 소팅 초기화
	useEffect(() => {
		gridRef.current?.clearSortingAll();
		gridRef1.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<StAbcQuerySearch {...formProps} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />
			<StAbcQueryDetail
				form={form}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridData1={gridData1}
				activeKey={activeKey}
				setActiveKey={setActiveKey}
				saveMasterT2List={saveMasterT2List}
			/>
		</>
	);
};

export default StAbcQuery;
