/*
 ############################################################################
 # FiledataField	: WdPltDp.tsx
 # Description		: 재고 > 공용기 관리업 > PLT 수불 관리
 # Author			: KimDongHan
 # Since			: 2025.09.22
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
import { apiPostMasterList, apiPostSaveMasterList } from '@/api/wd/apiWdPltDp';

// Hooks
// Utils
import WdPltDpDetail from '@/components/wd/pltDp/WdPltDpDetail';
import WdPltDpSearch from '@/components/wd/pltDp/WdPltDpSearch';
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Store

const WdPltDp = () => {
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

	// 재고(footer) 데이터
	const [stock, setStock] = useState([]);
	const stockRef = useRef(stock);

	// 다국어
	const { t } = useTranslation();

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 조회
	const searchMasterList = async () => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();

		const [deliverydtFrom, deliverydtTo] = requestParams.deliverydt;
		requestParams.deliverydtFrom = deliverydtFrom.format('YYYYMMDD');
		requestParams.deliverydtTo = deliverydtTo.format('YYYYMMDD');
		delete requestParams.carAllocateDt;

		gridRef.current?.clearGridData();

		const { data } = await apiPostMasterList(requestParams);

		setStock(data.stock || []);
		setGridData(data.masterList || []);
	};

	// 저장
	const saveMasterList = async () => {
		//const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

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

		// 필수값 체크
		if (!gridRef.current?.validateRequiredGridData()) {
			return;
		}

		// 불필요한 컬럼 제거
		updatedItems.forEach((item: any) => {
			delete item.dcname;
		});

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
		deliverydt: dates,
		pltComDv: '',
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		gDccode,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
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
	}, []);

	useEffect(() => {
		stockRef.current = stock;
	}, [stock]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<WdPltDpSearch {...formProps} />
			</SearchFormResponsive>

			<WdPltDpDetail
				gridRef={gridRef}
				gridData={gridData}
				form={form}
				saveMasterList={saveMasterList}
				stockRef={stockRef}
			/>
		</>
	);
};

export default WdPltDp;
