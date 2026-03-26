/*
 ############################################################################
 # FiledataField	: IbAllWeight.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량 정산
 # Author			: KimDongHyeon
 # Since			: 2025.11.12
 ############################################################################
*/
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Lib
import { Form, Tabs } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

// API
// Hooks
// Utils
import {
	apiPostCopyMasterList,
	apiPostExcel,
	apiPostMasterList,
	apiPostMasterList2,
	apiPostSaveMasterList,
} from '@/api/ib/apiIbAllWeight';
import IbAllWeightDetail from '@/components/ib/allWeight/IbAllWeightDetail';
import IbAllWeightDetail2 from '@/components/ib/allWeight/IbAllWeightDetail2';
import IbAllWeightSearch from '@/components/ib/allWeight/IbAllWeightSearch';
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { getUserDccodeList } from '@/store/core/userStore';

// Store

const IbAllWeight = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const userDccodeList = getUserDccodeList('') ?? [];

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef<any>(null);
	const gridRef1 = useRef<any>(null);

	// Antd Form 사용
	const [form] = Form.useForm();

	// condifion data state
	const [dates, setDates] = useState(() => [dayjs(), dayjs()]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	const [activeKey, setActiveKey] = useState('1');
	const activeKeyRef = useRef(activeKey);

	// 다국어
	const { t } = useTranslation();

	// 검색영역 초기 세팅
	const searchBox = useMemo(
		() => ({
			yyyymm: dayjs(),
			slipdt: [dayjs('20250101'), dayjs()], //TEST TODO
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
		if (activeKey == '1') {
			requestParams.yyyymm = requestParams.yyyymm?.format('YYYYMM');
		} else if (activeKey == '2') {
			const [slipdtFrom, slipdtTo] = requestParams.slipdt;
			requestParams.slipdtFrom = slipdtFrom.format('YYYYMMDD');
			requestParams.slipdtTo = slipdtTo.format('YYYYMMDD');
		}
		delete requestParams.slipdt;
		requestParams.activeKey = activeKeyRef.current;
		requestParams.fixdccode = [].concat(requestParams.fixdccode).join(',');

		const { data } =
			activeKey === '1' ? await apiPostMasterList(requestParams) : await apiPostMasterList2(requestParams);
		if (activeKey === '1') {
			setGridData(data || []);
		} else {
			setGridData2(data || []);
		}
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

	const copyMasterList = async () => {
		const curYm = form.getFieldValue('yyyymm');
		const prevYm = curYm.subtract(1, 'month');
		showConfirm(
			null,
			`기존 자료가 있다면 삭제됩니다. \n${prevYm.format('YYYY-MM')} 데이터를 ${curYm.format(
				'YYYY-MM',
			)} 로 복사 하시겠습니까?`,
			async () => {
				const requestParams = form.getFieldsValue();
				requestParams.yyyymm = prevYm.format('YYYYMM');
				requestParams.toyyyymm = curYm.format('YYYYMM');

				const res = await apiPostCopyMasterList(requestParams);
				const { data } = res;
				if (res.error == undefined && data?.errorCode == undefined && !(res?.statusCode < 0)) {
					showAlert('', t('msg.confirmSaved'), searchMasterList);
				}
			},
		);
	};

	const saveMasterList = async () => {
		const checkedItems = gridRef1.current.getChangedData({
			validationYn: false,
			andCheckedYn: true,
		});

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		let errField = '';
		checkedItems.some((el: any) => {
			const { fromSttlBaseDate, toSttlBaseDate, dccode, custkey, lclCd, mclCd, storagetype, priceCl } = el;
			if (commUtil.isEmpty(fromSttlBaseDate)) {
				errField = '기준일FROM';
				return true;
			}
			if (commUtil.isEmpty(toSttlBaseDate)) {
				errField = '기준일TO';
				return true;
			}
			if (commUtil.isEmpty(dccode)) {
				errField = '공급센터';
				return true;
			}
			if (commUtil.isEmpty(custkey)) {
				errField = '협력사코드';
				return true;
			}
			if (commUtil.isEmpty(lclCd)) {
				errField = '대분류';
				return true;
			}
			if (commUtil.isEmpty(mclCd)) {
				errField = '중분류';
				return true;
			}
			if (commUtil.isEmpty(storagetype)) {
				errField = '저장유무';
				return true;
			}
			if (commUtil.isEmpty(priceCl)) {
				errField = '단가 구분값';
				return true;
			}
		});
		if (errField) {
			showAlert(null, t('msg.requiredInput', [errField]));
			return;
		}

		gridRef1.current.showConfirmSave(async () => {
			const params = {
				saveList: checkedItems,
			};

			const res = await apiPostSaveMasterList(params);
			const { data } = res;
			if (res.error == undefined && data?.errorCode == undefined && !(res?.statusCode < 0)) {
				showAlert('', '저장되었습니다', searchMasterList);
			}
		});
	};

	//엑셀다운로드
	const searchExcel = () => {
		const params = {
			...form.getFieldsValue(),
		};

		params.yyyy = params.yyyymm?.format('YYYY');
		params.yy = params.yyyymm?.format('YY');
		params.mm = params.yyyymm?.format('MM');
		params.yyyymm = params.yyyymm?.format('YYYYMM');
		params.custname = params.custkeyName?.split('] ')?.[1];
		params.fixdcname = userDccodeList.find((item: any) => item.dccode === params.fixdccode)?.dcname.split(']')[1] || '';

		apiPostExcel(params).then(res => {
			FileSaver.saveAs(res.data, dataRegex.decodeDisposition(res.headers['content-disposition']));
		});
	};

	const addRow = async () => {
		const requestParams = form.getFieldsValue();
		const [slipdtFrom, slipdtTo] = requestParams.slipdt;
		const fromSttlBaseDate = slipdtFrom.format('YYYYMMDD');
		const toSttlBaseDate = slipdtTo.format('YYYYMMDD');
		const dccode = requestParams.fixdccode;
		const custkey = requestParams.custkey;
		const custname = requestParams.custkeyName ? requestParams.custkeyName.split('] ')[1] : '';

		gridRef1.current?.addRow({
			fromSttlBaseDate,
			toSttlBaseDate,
			dccode,
			custkey,
			custname,
		});
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
			label: '정산',
			children: (
				<IbAllWeightDetail
					gridRef={gridRef}
					gridData={gridData}
					copyMasterList={copyMasterList}
					saveMasterList={saveMasterList}
					searchExcel={searchExcel}
				/>
			),
		},
		{
			key: '2',
			label: '기준정보',
			children: (
				<IbAllWeightDetail2
					gridRef1={gridRef1}
					gridData2={gridData2}
					copyMasterList={copyMasterList}
					saveMasterList={saveMasterList}
					addRow={addRow}
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
		activeKeyRef.current = activeKey;
	}, [activeKey]);

	/* TSX */
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />

			<SearchFormResponsive {...formProps}>
				<IbAllWeightSearch {...formProps} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKey} onChange={key => setActiveKey(key)} items={tabItems} className="contain-wrap" />
		</>
	);
};

export default IbAllWeight;
