/*
 ############################################################################
 # FiledataField	: KpClose.tsx
 # Description		: 모니터링 > 물동 > 물동마감 진행 현황
 # Author			: KimDongHan
 # Since			: 2025.08.22
 ############################################################################
*/
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostDetailList, apiPostMasterList, apiPostSaveMasterList } from '@/api/kp/apiKpClose';
import KpCloseDetail from '@/components/kp/close/KpCloseDetail';
import KpCloseSearch from '@/components/kp/close/KpCloseSearch';
import { validateForm } from '@/util/FormUtil';
import { showMessage } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store

const KpClose = () => {
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
	const [gridDataDetail, setGridDataDetail] = useState([]);

	// 다국어
	const { t } = useTranslation();

	const [searchType, setSearchType] = useState('0');

	const radioOption = [
		{
			// 월별
			label: t('lbl.MONTH_BY'),
			value: '0',
		},
		{
			// 일별
			label: t('lbl.DAY_BY'),
			value: '1',
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 마스터 조회
	const searchMasterList = async () => {
		// 유효성 검사 필수 항목
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const requestParams = form.getFieldsValue();

		// 월별
		if (requestParams.searchtype === '0') {
			requestParams.docdt = requestParams.docdtmonth.format('YYYYMM');
		}

		// 일별
		if (requestParams.searchtype === '1') {
			const [docdtFrom, docdtTo] = requestParams.docdtday;
			requestParams.docdtFrom = docdtFrom.format('YYYYMMDD');
			requestParams.docdtTo = docdtTo.format('YYYYMMDD');
			delete requestParams.docdtday;

			if (
				requestParams.docdtFrom &&
				requestParams.docdtTo &&
				requestParams.docdtFrom.substring(0, 6) !== requestParams.docdtTo.substring(0, 6)
			) {
				// 시작일자의 년월과 종료일자의 년월이 동일해야 합니다.
				showMessage({
					content: t('msg.KP_CLOSE_MSG_001'),
					modalType: 'info',
				});
				return;
			}
		}

		// 그리드 초기화
		gridRef.current?.clearGridData();
		gridRef1.current?.clearGridData();
		const { data } = await apiPostMasterList(requestParams);

		setGridData(data || []);
	};

	// 디테일 조회
	const searchDetailList = async (requestParams: any) => {
		// 월별
		if (requestParams.searchtype === '0') {
			requestParams.docdt = requestParams.dmMonth;
		}

		// 일별
		if (requestParams.searchtype === '1') {
			requestParams.docdtFrom = requestParams.docdtFrom;
			requestParams.docdtTo = requestParams.docdtTo;
		}

		if (requestParams.rtVendorNcomp === 0) {
			requestParams.reserveYn = 'N';
		} else {
			requestParams.reserveYn = 'Y';
		}

		gridRef1.current?.clearGridData();
		const { data } = await apiPostDetailList(requestParams);
		setGridDataDetail(data || []);
	};

	// 저장 버튼
	const saveMasterList = async (rowdata: any) => {
		rowdata.docdt = rowdata.dmMonth;

		// 다음 컬럼들은 모두 0 이어야만 진행 가능
		const fieldsToCheck = [
			'dpNstoNcomp',
			'dpStoNcomp',
			'rtNcomp',
			'wdNstoNcomp',
			'wdQuickNcomp',
			'wdStoNcomp',
			'rtCustNcomp',
			'stoSt',
			'ajDuNcomp',
			'ajDdNcomp',
			'rtVendorNcomp',
		];

		const nonZeroFields = fieldsToCheck.filter(f => Number(rowdata[f] ?? 0) !== 0);

		if (nonZeroFields.length > 0) {
			// 미처리건+재고(DAILYCROSS 제외)\r\n건수가 0 이여야\r\n마감등록 가능 합니다.
			showAlert(null, t('msg.KP_CLOSE_MSG_005'));
			return;
		}

		// 마감처리 하시겠습니까?
		showConfirm(null, t('msg.KP_CLOSE_MSG_002'), async () => {
			const params = {
				saveList: [rowdata],
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
		//dccode: '',
		searchtype: '0',
		docdtmonth: dayjs(),
		docdtday: dates,
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		searchType,
		setSearchType,
		radioOption,
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
		// reset: () => {
		// 	form.resetFields();
		// 	gridRef.current?.clearSortingAll();
		// 	gridRef1.current?.clearSortingAll();
		// 	gridRef.current?.clearGridData();
		// 	gridRef1.current?.clearGridData();
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
		gridRef1.current?.clearSortingAll();
	}, []);

	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
	});

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<KpCloseSearch {...formProps} />
			</SearchFormResponsive>

			<KpCloseDetail
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridDataDetail={gridDataDetail}
				searchDetailList={searchDetailList}
				saveMasterList={saveMasterList}
			/>
		</>
	);
};

export default KpClose;
