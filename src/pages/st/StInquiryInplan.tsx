/*
 ############################################################################
 # FiledataField	: StInquiryInplan.tsx
 # Description		: 재고 > 재고조사 > 재고 실사 지시
 # Author			: KimDongHan
 # Since			: 2025.10.28

 	// 지시 이동
	const move = async () => {
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
import { apiPostInquiryName, apiPostMasterList, apiPostSaveMasterList } from '@/api/st/apiStInquiryInplan';
import StInquiryInplanDetail from '@/components/st/inquiryInplan/StInquiryInplanDetail';
import StInquiryInplanSearch from '@/components/st/inquiryInplan/StInquiryInplanSearch';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';
import styled from 'styled-components';

// Store

const StInquiryInplan = () => {
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
	const [form1] = Form.useForm();
	const [form2] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);
	const [inquiryno, setInquiryno] = useState('');
	const [gridCount, setGridCount] = useState(0);

	// 다국어
	const { t } = useTranslation();

	// 실사구분
	const searchTypeList = [
		{
			// 전체
			cdNm: t('lbl.SELECT'),
			comCd: '',
		},
		{
			// 소비기한
			cdNm: t('lbl.USEBYDATE'),
			comCd: '0',
		},
		{
			// 재고실사
			cdNm: t('lbl.STOCK_TAKE'),
			comCd: '1',
		},
	];

	// 검색영역 초기 세팅
	const searchBox = {
		stockgrade: '', // 재고속성
		storagetype: '', // 저장조건
		loccategory: '', // 로케이션종류
		stocktype: '', // 재고위치
		//excludeZone: '', // 제외존
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param callFrom
	 */
	// 조회
	const searchMasterList = async (callFrom: any) => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		let params = form.getFieldsValue();

		// 외부창고인 경우 창고값 필수
		if (params.fixdccode === '2170') {
			if (commUtil.isNull(params.organize)) {
				// 외부비축센터인 경우 창고는 필수값 입니다.
				showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_009'));
				return;
			}
		}

		params.excludeZone = params?.excludeZone?.join(',') || '';
		// if (!commUtil.isNull(requestParams.excludeZone)) {
		// 	requestParams.excludeZone = requestParams?.excludeZone?.join(',') || '';
		// }

		// 그리드 초기화
		gridRef.current?.clearGridData();

		// 상세는 입력용이라 초기화 하지 않음

		if (callFrom === 'save') {
			// 저장 후 재조회 시에는 상세를 초기화
			gridRef1.current?.clearGridData(); // 지시 이동 후 재조회 시 하단 그리드 초기화
		}

		form2.setFieldValue('inquiryAlias', '');

		let organize = commUtil.nvl(form.getFieldValue('organize'), []);
		organize = organize.toString(); // 물류센터 ->	문자열 변환[1,2,3]

		params = { ...params, organize: organize };
		const { data } = await apiPostMasterList(params);

		setGridData(data || []);
		setGridCount(data.length);
	};

	// 지시 이동
	const move = async () => {
		const isValid = await validateForm(form);

		if (!isValid) {
			return;
		}

		const isValid1 = await validateForm(form1);

		if (!isValid1) {
			return;
		}

		// 1. 상단 그리드 체크된 항목
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		// const checkedItems = gridRef.current?.getCustomCheckedRowItems();

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 유효성 검사 추가
		// 재고조사 별칭
		const inquiryAlias = form2.getFieldValue('inquiryAlias');
		// 재고조사 별칭에서 앞에 YYYYMMDD 와 뒤에 시퀀스 3자리를 제외한 값
		const inquiryMiddle =
			typeof inquiryAlias === 'string' && inquiryAlias.length > 11
				? inquiryAlias.substring(8, inquiryAlias.length - 3)
				: '';
		// 실사구분 명칭
		const searchtypeNm = searchTypeList.find(item => item.comCd === form1.getFieldValue('searchtype'))?.cdNm;

		// 재고조사 별칭이 있는 경우
		if (!commUtil.isNull(inquiryMiddle)) {
			// 재고조사 별칭과 실사구분값이 다른 경우 못 넘어가게 처리함.
			// 등록시 실사구분이 동일한 값만 저장할 수 있음
			if (searchtypeNm !== inquiryMiddle) {
				// 이미 등록된 실사구분이 일치하지 않습니다.
				showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_004'));
				return;
			}
		}

		// 2. serialkey 중복 체크
		const gridData1Items = gridRef1.current?.getGridData() || [];
		const existingSerialKeys = gridData1Items.map((item: any) => item.serialkey);

		// serialkey 중복 제외
		const nonDuplicateItems = checkedItems.filter((item: any) => !existingSerialKeys.includes(item.serialkey));

		if (nonDuplicateItems.length === 0) {
			// 모든 항목이 중복됨
			showAlert(null, t('체크된 항목이 모두 이미 등록되어 있습니다.'));
			return;
		}

		// 중복된 항목이 일부 있는 경우 안내
		if (nonDuplicateItems.length < checkedItems.length) {
			const duplicateCount = checkedItems.length - nonDuplicateItems.length;
			//console.warn(`${duplicateCount}개 항목이 이미 등록되어 제외되었습니다.`);
		}

		// 2-1. 상단 그리드 체크된 항목 하단 그리드로 복사 (중복 제외)
		gridRef1.current.addRow(nonDuplicateItems);

		// 3. 상단 그리드 전체 데이터
		const newGridData = gridRef.current?.getGridData();

		// 4. 상단 그리드에서 체크된 데이터 (중복 제외된 항목만)
		const nonDuplicateUids = nonDuplicateItems.map((item: any) => item._$uid);

		// 5. 상단 그리드에서 중복 제외된 데이터만 제거
		const filtered = newGridData.filter((item: any) => !nonDuplicateUids.includes(item._$uid));

		// 6. 나머지 데이터를 상단 그리드에 바인딩
		gridRef.current?.setGridData(filtered);

		// 7. 상단 그리드에 나머지 데이터로 상단 그리드 건수 세팅
		setGridCount(filtered.length);

		if (commUtil.isNull(inquiryAlias)) {
			const requestParams = {
				fixdccode: form.getFieldValue('fixdccode'),
				lottype: form1.getFieldValue('searchtype'),
				lottypeNm: searchTypeList.find(item => item.comCd === form1.getFieldValue('searchtype'))?.cdNm || '',
			};

			const { data } = await apiPostInquiryName(requestParams);

			form2.setFieldValue('inquiryAlias', data[0]?.inquiryName);
			setInquiryno(data[0]?.inquiryno);
		}
	};

	// 지시 이동삭제
	const moveDelete = async () => {
		// 1. 하단 그리드 체크된 항목
		const checkedItems = gridRef1.current?.getCheckedRowItemsAll();
		// 2025.12.04 김동한 체크박스 스페이스 이벤트로 인해 일괄적용
		//const checkedItems = gridRef1.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 2. 하단 그리드 체크된 항목 하단 그리드로 복사
		gridRef.current?.addRow(checkedItems);

		// 3. 하단 그리드 전체 데이터
		const newGridData = gridRef1.current?.getGridData();

		// 4. 하단 그리드에서 체크된 데이터
		const checkedUids = checkedItems.map((item: any) => item._$uid);

		// 5. 하단 그리드에서 체크된 데이터 제외 한 나머지 데이터
		const filtered = newGridData.filter((item: any) => !checkedUids.includes(item._$uid));

		// 6. 나머지 데이터를 하단 그리드에 바인딩
		gridRef1.current?.clearGridData();
		gridRef1.current?.addRow(filtered);

		setGridCount(gridData.length);

		const dataCount = gridRef1.current?.getGridData();

		if (dataCount.length === 0) {
			form2.setFieldValue('inquiryAlias', '');
			setInquiryno('');
		}
	};

	// 초기화
	const clear = async () => {
		gridRef1.current?.clearSortingAll();
		gridRef1.current?.clearGridData();
		form1.setFieldValue('inquiryAlias', '');
	};

	// 저장
	const saveMasterList = async () => {
		const inquiryAlias = form2.getFieldValue('inquiryAlias');

		if (commUtil.isNull(inquiryAlias)) {
			// 재고조사 별칭이 없습니다.
			showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_002'));
			return;
		}

		const checkedItems = gridRef1.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 재고조사 별칭에서 앞에 YYYYMMDD 와 뒤에 시퀀스 3자리를 제외한 값
		const inquiryMiddle =
			typeof inquiryAlias === 'string' && inquiryAlias.length > 11
				? inquiryAlias.substring(8, inquiryAlias.length - 3)
				: '';
		// 실사구분 명칭
		const matchedComCd = searchTypeList.find(
			item => item.cdNm?.trim().toLowerCase() === inquiryMiddle?.trim().toLowerCase(),
		)?.comCd;

		// 저장하시겠습니까? 신규 : N건, 수정 : N건, 삭제 : N건
		gridRef1.current?.showConfirmSave(() => {
			checkedItems.forEach((item: any) => {
				//item.saveInquiryno = inquiryno;
				//item.saveInquiryName = form1.getFieldValue('inquiryAlias');
				//item.lottype = form1.getFieldValue('searchtype');
				item.lottype = matchedComCd;
			});

			const params = {
				saveDataList: checkedItems,
				// inquiryAlias: inquiryAlias,
				fixdccode: form.getFieldValue('fixdccode'),
				//lottype: form1.getFieldValue('searchtype'),
				lottype: matchedComCd,
				lottypeNm: searchTypeList.find(item => item.comCd === matchedComCd)?.cdNm || '',
				//lottypeNm: searchTypeList.find(item => item.comCd === form1.getFieldValue('searchtype'))?.inquiryMiddle || '',
			};

			// 저장 API 호출
			apiPostSaveMasterList(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					// 저장 되었습니다.
					//showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
					// 재고조사 별칭\n[{0}]\n저장 되었습니다.
					showAlert(null, t('msg.MSG_ST_INQUIRY_INPLAN_003', [res.statusMessage]), () => {
						gridRef1.current?.clearSortingAll();
						gridRef1.current?.clearGridData();
						form2.setFieldValue('inquiryAlias', '');
						// 재조회
						searchMasterList(null);
					});
				}
				// 실패시는 서버에서 에러 메시지를 보여줌
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
	};

	const commonProps = {
		form,
		search: searchMasterList,
		initialValues: searchBox,
		dates,
		setDates,
		gridRef,
		gridRef1,
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

			<StInquiryInplanSearchWrap>
				<SearchFormResponsive {...commonProps} initialValues={searchBox}>
					<StInquiryInplanSearch {...commonProps} />
				</SearchFormResponsive>
			</StInquiryInplanSearchWrap>

			<StInquiryInplanDetail
				form={form}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridData1={gridData1}
				saveMasterList={saveMasterList}
				move={move}
				form1={form1}
				form2={form2}
				searchTypeList={searchTypeList}
				gridCount={gridCount}
				setGridCount={setGridCount}
				moveDelete={moveDelete}
				clear={clear}
			/>
		</>
	);
};

export default StInquiryInplan;

const StInquiryInplanSearchWrap = styled.div`
	li {
		.ant-row.ant-form-item-row {
			.ant-form-item-label {
				padding-left: 4px;
			}
		}
	}
`;
