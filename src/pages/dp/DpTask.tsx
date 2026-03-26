/*
 ############################################################################
 # FiledataField	: DpTask.tsx
 # Description		: 입고 > 입고작업 > 입고검수지정
 # Author			: KimDongHyeon
 # Since			: 2025.07.31
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import { apiPostMasterList, apiPostMasterList2 } from '@/api/dp/apiDpTask';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import TabsArray from '@/components/common/TabsArray';
import DpTaskDetail from '@/components/dp/task/DpTaskDetail';
import DpTaskDetail2 from '@/components/dp/task/DpTaskDetail2';
import DpTaskSearch from '@/components/dp/task/DpTaskSearch';
import { validateForm } from '@/util/FormUtil';
import { showAlert } from '@/util/MessageUtil';
import dayjs from 'dayjs';

// Store

const DpTask = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);
	const gridRef2 = useRef<any>(null);
	const gridRef3 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridDataDetail, setGridDataDetail] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridDataDetail2, setGridDataDetail2] = useState([]);

	const [activeKey, setActiveKey] = useState('2');

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			docdt: dates,
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
		const [docdtFrom, docdtTo] = requestParams.docdt;
		requestParams.docdtFrom = docdtFrom.format('YYYYMMDD');
		requestParams.docdtTo = docdtTo.format('YYYYMMDD');

		const { data } =
			activeKey === '1' ? await apiPostMasterList(requestParams) : await apiPostMasterList2(requestParams);

		if (activeKey === '1') {
			setGridData(data.masterList || []);
			setGridDataDetail(data.detailList || []);
		} else {
			setGridData2(data.masterList || []);
			setGridDataDetail2(data.detailList || []);
		}
	};

	const saveDpTask = async (gridNo: number) => {
		const gridMap: any = {
			0: {
				ref: gridRef,
				data: gridData,
			},
			1: {
				ref: gridRef1,
				data: gridDataDetail,
			},
			2: {
				ref: gridRef2,
				data: gridData2,
			},
			3: {
				ref: gridRef3,
				data: gridDataDetail2,
			},
		};

		const checkedItems = gridMap[gridNo].ref.current.getCheckedRowItemsAll();
		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		gridMap[gridNo].ref.current.showConfirmSave(async () => {
			const params = {
				apiUrl: '/api/dp/task/v1.0/saveDpTask',
				avc_COMMAND: 'PLANCONFIRM',
				saveDataList: checkedItems,
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchMasterList();
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
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		gridRef.current?.resize('100%', '100%');
		gridRef1.current?.resize('100%', '100%');
		gridRef2.current?.resize('100%', '100%');
		gridRef3.current?.resize('100%', '100%');
	}, [activeKey]);

	const tabItems = [
		{
			key: '1',
			label: '검수지정현황',
			children: (
				<DpTaskDetail
					gridRef={gridRef}
					gridRef1={gridRef1}
					gridData={gridData}
					gridDataDetail={gridDataDetail}
					saveDpTask={saveDpTask}
				/>
			),
		},
		{
			key: '2',
			label: '검수지정',
			children: (
				<DpTaskDetail2
					gridRef2={gridRef2}
					gridRef3={gridRef3}
					gridData={gridData2}
					gridDataDetail={gridDataDetail2}
					saveDpTask={saveDpTask}
				/>
			),
		},
	];

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<DpTaskSearch {...formProps} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} />

			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default DpTask;
