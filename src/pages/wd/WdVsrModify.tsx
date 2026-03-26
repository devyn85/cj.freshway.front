/*
 ############################################################################
 # FiledataField	: WdVsrModify.tsx
 # Description		: 출고 > 출고 > CS 출고 정정 요청 대응
 # Author			: KimDongHan
 # Since			: 2025.10.21
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
import { apiPostMasterList, apiPostSaveMasterList } from '@/api/wd/apiWdVsrModify';
import WdVsrModifyDetail from '@/components/wd/vsrModify/WdVsrModifyDetail';
import WdVsrModifySearch from '@/components/wd/vsrModify/WdVsrModifySearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const WdVsrModify = () => {
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
		const [ifDateFrom, ifDateTo] = requestParams.ifDate;
		requestParams.ifDateFrom = ifDateFrom.format('YYYYMMDD');
		requestParams.ifDateTo = ifDateTo.format('YYYYMMDD');
		delete requestParams.ifDate;

		// 그리드 초기화
		gridRef.current?.clearGridData();
		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};

	// 저장 버튼
	const saveMasterList = async () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 수정된 것만(체크박스 제외)
		// validationYn: false 옵션으로 유효성 검사 로직 제외
		const updatedItems = gridRef.current?.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length === 0) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// 처리구분이 해당사항없음(50)(공통코드:WD_AMEND) 인 경우 답변은 필수
		for (let i = 0; i < updatedItems.length; i++) {
			const item: any = updatedItems[i];

			if (item.status === '50') {
				if (commUtil.isNull(item.reasonmsg)) {
					// 처리구분이 해당사항없음인 경우 답변은 필수 입력해야 합니다.
					showAlert(null, t('msg.MSG_WD_VRS_MODIFY_001'));
					return;
				}
			}
		}

		// 저장하시겠습니까? 신규 : N건, 수정 : N건, 삭제 : N건
		gridRef.current?.showConfirmSave(() => {
			const params = {
				saveDataList: updatedItems,
			};

			// 저장 API 호출
			apiPostSaveMasterList(params).then(res => {
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
		ifDate: dates,
		status: '',
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
		// 	gridRef.current?.clearGridData();
		// 	gridRef.current?.clearSortingAll();
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
				<WdVsrModifySearch {...formProps} />
			</SearchFormResponsive>

			<WdVsrModifyDetail gridRef={gridRef} gridData={gridData} saveMasterList={saveMasterList} />
		</>
	);
};

export default WdVsrModify;
