/*
 ############################################################################
 # FiledataField	: MsPbox.tsx
 # Description		: 재고 > 공용기 관리 > P-BOX 관리/사용 현황
 # Author			: KimDongHan
 # Since			: 2025.09.18
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
import {
	apiPostMasterT1List,
	apiPostMasterT2List,
	apiPostSaveMasterList,
	apiPostsavePrintList,
} from '@/api/ms/apiMsPbox';
import MsPboxDetail from '@/components/ms/pbox/MsPboxDetail';
import MsPboxSearch from '@/components/ms/pbox/MsPboxSearch';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import reportUtil from '@/util/reportUtil';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// Store

const MsPbox = () => {
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

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const gDcname = useSelector((state: any) => state.global.globalVariable.gDccodeNm);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData1, setGridData1] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	// const tabItems = [
	// 	{
	// 		// PBOX등록
	// 		key: '1',
	// 		label: t('lbl.MS_P_BOX_T1'),
	// 	},
	// 	{
	// 		// 사용현황
	// 		key: '2',
	// 		label: t('lbl.MS_P_BOX_T2'),
	// 	},
	// ];

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

		if (activeKey === '1') {
			// const [carAllocateDtFrom, carAllocateDtTo] = requestParams.carAllocateDt;
			// requestParams.carAllocateDtFrom = carAllocateDtFrom.format('YYYYMMDD');
			// requestParams.carAllocateDtTo = carAllocateDtTo.format('YYYYMMDD');
			// delete requestParams.carAllocateDt;
			gridRef.current?.clearGridData();
			const { data } = await apiPostMasterT1List(requestParams);
			setGridData(data || []);
		} else if (activeKey === '2') {
			const [deliverydtFrom, deliverydtTo] = requestParams.deliverydt;
			requestParams.deliverydtFrom = deliverydtFrom.format('YYYYMMDD');
			requestParams.deliverydtTo = deliverydtTo.format('YYYYMMDD');
			delete requestParams.deliverydt;
			gridRef1.current?.clearGridData();
			const { data } = await apiPostMasterT2List(requestParams);
			setGridData1(data || []);
		}
	};

	// 저장 버튼
	const saveMasterList = async () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();
		//const checkedItems = gridRef.current?.getCustomCheckedRowItems({ isGetRowIndex: true });

		if (!checkedItems || checkedItems.length === 0) {
			// 체크된 항목이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_061'));
			return;
		}

		// 수정된 것만(체크박스 제외)
		// validationYn: false 옵션으로 유효성 검사 로직 제외
		const updatedItems = gridRef.current?.getChangedData({ validationYn: false });
		//const updatedItems = gridRef.current.getChangedData(); // 수정된 것만(체크만 한 것도 포함)

		if (!updatedItems || updatedItems.length === 0) {
			// 변경된 데이터가 없습니다.
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		// 차량번호가 있는 경우 차량할당일은 필수 체크
		// updatedItems.forEach((item: any) => {
		// 	//console.log('item.rowStatus =>', item.rowStatus);

		// 	if (!commUtil.isNull(item.carno)) {
		// 		if (commUtil.isNull(item.carAllocateDt)) {
		// 			//console.log('item.rowStatus222222 =>', item.rowStatus);
		// 			// 차량번호 등록시\r\n차량할당일은 필수 입니다.
		// 			showAlert(null, t('msg.MSG_MS_P_BOX_002'));
		// 			return;
		// 		}
		// 	}
		// });

		for (const item of updatedItems) {
			if (item.rowStatus !== 'D') {
				if (!commUtil.isNull(item.carno) && commUtil.isNull(item.carAllocateDt)) {
					// 차량번호 등록시\r\n차량할당일은 필수 입니다.
					showAlert(null, t('msg.MSG_MS_P_BOX_002'));
					return;
				}
				if (!commUtil.isNull(item.carAllocateDt) && commUtil.isNull(item.carno)) {
					// 차량할당일 등록시\r\n차량번호는 필수 입니다.
					showAlert(null, t('msg.MSG_MS_P_BOX_002'));
					return;
				}
			}
		}

		//필수값 체크
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

	// 출력 버튼
	const savePrintList = async () => {
		const checkedItems = gridRef.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			// 인쇄할 데이터가 없습니다.
			showAlert(null, t('msg.noPrintData'));
			return;
		}
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const params = {
				saveDataList: checkedItems,
			};

			// 	// 저장 API 호출
			apiPostsavePrintList(params).then(res => {
				// 저장 성공시
				if (res.statusCode === 0) {
					const values = (checkedItems || []).map((item: any) => {
						return item.pboxNo;
					});

					// 5개씩 묶어서 PLT1..PLT5 컬럼 생성
					const rows: any[] = [];
					for (let i = 0; i < values.length; i += 5) {
						const chunk = values.slice(i, i + 5);
						const row: any = {};
						for (let j = 0; j < 5; j++) {
							row[`plt${j + 1}`] = chunk[j] ?? null; // 없으면 null 채움
						}
						rows.push(row);
					}

					// 1. 리포트 파일명
					const fileName = ['MS_Label_CJFWMS3.mrd'];

					// 2. 리포트에 XML 생성을 위한 DataSet 생성
					const dataSet = [rows];

					// 3. 리포트 용지 설정에 따른 라벨 ID. 해당 파라미타는 사라질 수도 있음.
					const labelId = ['CJFWDP3'];

					reportUtil.openLabelReportViewer(fileName, dataSet, labelId);

					// 재조회
					searchMasterList();
				}
			});
		});
	};

	// 검색영역 초기 세팅
	const searchBox = {
		//carAllocateDt: dates,
		//reprint: '',
		allocatedYn: '',
		useYn: '',
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		gDccode,
		gDcname,
		activeKey,
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
	}, [activeKey]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<MsPboxSearch {...formProps} />
			</SearchFormResponsive>

			{/* <Tabs
				activeKey={activeKey}
				onChange={key => setActiveKey(key)}
				items={tabItems}
			/> */}

			<MsPboxDetail
				activeKey={activeKey}
				activeKeyRef={activeKeyRef}
				gridRef={gridRef}
				gridRef1={gridRef1}
				gridData={gridData}
				gridData1={gridData1}
				saveMasterList={saveMasterList}
				savePrintList={savePrintList}
				form={form}
				searchMasterList={searchMasterList}
				setActiveKey={setActiveKey}
			/>
		</>
	);
};

export default MsPbox;
