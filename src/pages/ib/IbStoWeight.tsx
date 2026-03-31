/*
 ############################################################################
 # FiledataField	: IbStoWeight.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량
 # Author			: KimDongHyeon
 # Since			: 2025.10.24
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form, Tabs } from 'antd';

// Component
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterList, apiPostSaveBatchMasterList } from '@/api/ib/apiIbStoWeight';
import CustomModal from '@/components/common/custom/CustomModal';
import { SearchFormResponsive } from '@/components/common/custom/form';
import IbStoWeightDetail from '@/components/ib/stoWeight/IbStoWeightDetail';
import IbStoWeightDetail2 from '@/components/ib/stoWeight/IbStoWeightDetail2';
import IbStoWeightDetail3 from '@/components/ib/stoWeight/IbStoWeightDetail3';
import IbStoWeightMasterPopup from '@/components/ib/stoWeight/IbStoWeightMasterPopup';
import IbStoWeightSearch from '@/components/ib/stoWeight/IbStoWeightSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { validateForm } from '@/util/FormUtil';
import dayjs from 'dayjs';

// Store

const IbStoWeight = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const expCodeList = getCommonCodeList('EXPIRATION_DATE_IB');
	const expCodeListMap = expCodeList.map((item: any) => {
		const [storagetype, start, end, rate] = item.comCd.split('_');
		return {
			storagetype,
			start,
			end,
			rate,
		};
	});
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();
	const [form1] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			yyyymm: dayjs(),
		}),
		[],
	);

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
		requestParams.yyyymm = requestParams.yyyymm.format('YYYYMM');
		requestParams.activeKey = activeKeyRef.current;
		requestParams.fixdccode = [].concat(requestParams.fixdccode).join(',');

		const { data } = await apiPostMasterList(requestParams);
		if (activeKey === '1') {
			setGridData(data || []);
		} else if (activeKey === '2') {
			setGridData2(data || []);
		} else {
			setGridData3(data || []);
		}
	};

	const saveBatchMasterList = async () => {
		showConfirm(null, `기존 자료가 있다면 삭제됩니다.\n데이터를 동기화 하시겠습니까?`, async () => {
			const requestParams = form.getFieldsValue();
			requestParams.yyyymm = requestParams.yyyymm.format('YYYYMM');
			requestParams.activeKey = activeKeyRef.current;
			requestParams.fixdccode = [].concat(requestParams.fixdccode).join(',');

			const res = await apiPostSaveBatchMasterList(requestParams);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined && !(res?.statusCode < 0)) {
				showAlert('', t('msg.confirmSaved'), searchMasterList);
			}
		});
	};

	const openModal = () => {
		form1.setFieldValue('yyyymm', form.getFieldValue('yyyymm'));
		modalRef.current.handlerOpen();
	};

	const closeModal = () => {
		modalRef.current.handlerClose();
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
	};

	const formProps = {
		form: form,
		initialValues: searchBox,
		dates,
		setDates,
		activeKey,
	};

	const tabItems = [
		{
			key: '1',
			label: '총량',
			children: (
				<IbStoWeightDetail
					gridRef={gridRef}
					gridData={gridData}
					openModal={openModal}
					saveBatchMasterList={saveBatchMasterList}
				/>
			),
		},
		{
			key: '2',
			label: '분류',
			children: (
				<IbStoWeightDetail2
					gridRef={gridRef1}
					gridData={gridData2}
					openModal={openModal}
					saveBatchMasterList={saveBatchMasterList}
				/>
			),
		},
		{
			key: '3',
			label: '입고',
			children: (
				<IbStoWeightDetail3
					gridRef={gridRef2}
					gridData={gridData3}
					openModal={openModal}
					saveBatchMasterList={saveBatchMasterList}
				/>
			),
		},
	];
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<IbStoWeightSearch {...formProps} />
			</SearchFormResponsive>

			<Tabs
				activeKey={activeKey}
				onChange={key => setActiveKey(key)}
				items={tabItems}
				tabBarStyle={{ marginBottom: 0 }} // 공간 없애기
				className="contain-wrap"
			/>

			<CustomModal ref={modalRef} width="1400px">
				<IbStoWeightMasterPopup
					form={form1}
					closeModal={closeModal}
					searchForm={form}
					parentTab={activeKey}
					parentTabRef={activeKeyRef}
				/>
			</CustomModal>
		</>
	);
};

export default IbStoWeight;
