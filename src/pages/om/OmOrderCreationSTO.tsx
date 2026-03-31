/*
############################################################################
# FiledataField	: OmOrderCreationSTO.tsx
# Description  : 주문 > 주문등록 > 물류센터간이체
# Author			: YeoSeungCheol
# Since			: 25.09.29
############################################################################
*/

// Lib
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmOrderCreationSTOSearch from '@/components/om/orderCreationSTO/OmOrderCreationSTOSearch';
import OmOrderCreationSTOTab1 from '@/components/om/orderCreationSTO/OmOrderCreationSTOTab1';
import OmOrderCreationSTOTab2 from '@/components/om/orderCreationSTO/OmOrderCreationSTOTab2';

// Util
import { validateForm } from '@/util/FormUtil';

// API
import { apiPostMasterList, apiPostResultList, apiPostSaveMasterList } from '@/api/om/apiOmOrderCreationSTO';

// Store
import TabsArray from '@/components/common/TabsArray';
import { getCommonCodeList } from '@/store/core/comCodeStore';

const OmOrderCreationSTO = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { TabPane } = Tabs;

	// Antd Form 사용
	const [form] = Form.useForm();

	// grid data Tab순서대로
	const [gridData1, setGridData1] = useState([]);
	const [gridData2, setGridData2] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);

	// 그리드 접근을 위한 Ref Tab순서대로
	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);

	// 현재 탭 정보
	const [activeTabKey, setActiveTabKey] = useState('1');

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		deliverydate: dayjs(),
		fromdccode: '',
		todccode: '',
		stotype: null,
		skuName: '',
		storagetype: null,
		lottable01yn: null,
		stocktype: null,
		stockgrade: null,
		zone: '',
		blno: '',
		serialno: '',
		custkey: '',
		fromlocation: '',
		tolocation: '',
		identifynumber: null,
		sortorder: null,
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	const searchMasterList = () => {
		switch (activeTabKey) {
			case '1':
				searchTab1List();
				break;
			case '2':
				searchTab2List();
				break;
			default:
				break;
		}
	};

	/**
	 * Tab1 조회
	 */
	const searchTab1List = async () => {
		const isValid = await validateForm(form, ['deliverydate', 'fromdcname', 'todcname', 'stotype']);
		if (!isValid) return;

		const v: any = form.getFieldsValue();

		const openCenterList = getCommonCodeList('OPENCENTER');

		// 공급받는 센터가 오픈센터에 존재하는지 확인
		// const isExist = openCenterList.some((center: any) => center.comCd === v.todccode);

		// if (isExist) {
		// 	showAlert(null, "STO는 '공급받는 센터'가 사용하는 시스템에서 생성 가능합니다.");
		// 	return;
		// } else {
		const payload: any = {
			DELIVERYDATE: v.deliverydate ? dayjs(v.deliverydate).format('YYYYMMDD') : undefined,
			FROM_DCCODE: v.fromdcname,
			FROM_ORGANIZE: v.fromOrganize,
			toDccode: v.todccode,
			organize: v.organize,
			STOTYPE: v.stotype,
			MULTI_SKU: v.sku,
			STORAGETYPE: v.storagetype,
			LOTTABLE01YN: v.lottable01yn,
			STOCKTYPE: v.stocktype,
			STOCKGRADE: v.stockgrade,
			ZONE: v.zone,
			BLNO: v.blno,
			SERIALNO: v.serialno,
			CONTRACTCOMPANY: v.custkey,
			FROMLOC: v.fromlocation,
			TOLOC: v.tolocation,
			SERIALYN: v.identifynumber,
			SORTKEY: v.sortorder,
		};

		apiPostMasterList(payload).then(res => {
			if (res?.statusCode === 0) {
				setGridData1(res.data ?? []);
				setTotalCount(res.data ? res.data.length : 0);
			} else {
				showAlert(null, res?.statusMessage || res?.message || '처리 중 오류가 발생했습니다.');
			}
		});
		// }
	};

	/**
	 * Tab2 조회 (처리결과)
	 */
	const searchTab2List = () => {
		apiPostResultList({}).then(res => {
			if (res?.statusCode === 0) {
				setGridData2(res.data ?? []);
			}
		});
	};

	/**
	 * 저장 함수 (Tab1에서 호출)
	 */
	const onSave = () => {
		const v: any = form.getFieldsValue();
		const deliverydate = v?.deliverydate;
		const fromDccode = v?.fromdcname;
		const toDccode = v?.todccode;

		if (!deliverydate) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.DOCDT_STO')]));
			return;
		}
		if (!fromDccode) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.FROM_DCCODE')]));
			return;
		}
		if (!toDccode) {
			showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.TO_DCCODE')]));
			return;
		}
		if (fromDccode === toDccode) {
			showAlert(null, '공급센터, 공급받는센터는 서로 다른 센터를 선택하셔야 합니다.');
			return;
		}

		const grid: any = gridRef1?.current;
		if (!grid || !grid.getCheckedRowItemsAll) {
			showAlert(null, '그리드 데이터를 불러올 수 없습니다.');
			return;
		}

		// const checked = grid.getCheckedRowItemsAll() || [];
		const checked = grid.getCustomCheckedRowItems({ isGetRowIndex: true }).map((item: any) => item['item']) || [];
		if (!checked.length) {
			showAlert(null, t('msg.noSelect'));
			return;
		}

		const targetList: any[] = [];
		for (const row of checked) {
			const qty = Number(row.req ?? row.toOrderqty ?? row.orderqty ?? 0);
			if (!row.sku || !row.uom || !row.stockgrade || qty <= 0) continue;
			targetList.push({
				fromStorerkey: row.storerkey,
				fromDccode: v.fromdcname,
				fromOrganize: v.fromdcname,
				fromArea: '1000',
				fromSku: row.sku,
				fromUom: row.uom,
				fromStockgrade: row.stockgrade,
				fromStockid: row.stockid ?? null,
				fromLoc: row.fromLoc,
				fromLot: row.fromLot,
				fromStocktype: row.stocktype,
				fromOrderqty: qty,
				toOrderqty: qty,
				toStocktype: row.stocktype,
				toDccode: v.todccode,
				toStorerkey: row.storerkey,
				toOrganize: v.organize === '' ? v.todccode : v.organize,
				// toOrganize: v.todccode,
				toArea: '1000',
				toSku: row.sku,
				toUom: row.uom,
				toStockgrade: row.stockgrade,
				toStockid: row.stockid ?? null,
				toLoc: row.toLoc,
				toLot: row.toLot,
			});
		}
		if (!targetList.length) {
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		const body = {
			avc_DCCODE: v.fromdcname,
			avc_COMMAND: 'CONFIRM',
			DC_A: v.fromdcname,
			DC_B: v.todccode,
			STOTYPE: v.stotype,
			DELIVERYDATE: dayjs(deliverydate).format('YYYYMMDD'),
			toDccode: v.todccode,
			organize: v.organize === '' ? v.todccode : v.organize,
			saveList: targetList,
		};

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${targetList.length}건
				수정 : 0건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, async () => {
			apiPostSaveMasterList(body).then(res => {
				if (res?.statusCode === 0) {
					showMessage({ content: t('msg.MSG_COM_SUC_003') });
					setGridData2(res.data ?? []);
					setActiveTabKey('2');
				}
				// else {
				// 	showAlert(null, res?.statusMessage || res?.message || '처리 중 오류가 발생했습니다.');
				// }
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList,
	};

	/**
	 * 탭 클릭
	 * @param {string} key 탭 키
	 */
	const tabClick = (key: string) => {
		setActiveTabKey(key);
		if (key === '1') {
			// Tab1로 이동 시 그리드 데이터 초기화
			setGridData1([]);
			setTotalCount(0);
			gridRef1.current?.resize('100%', '100%');
		} else {
			// Tab2로 이동 시 그리드 데이터 초기화
			setGridData2([]);
			gridRef2.current?.resize('100%', '100%');
		}
		return;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (activeTabKey === '1') {
			gridRef1.current?.resize('100%', '100%');
		} else if (activeTabKey === '2') {
			gridRef2.current?.resize('100%', '100%');
		}
	}, [activeTabKey]);

	useEffect(() => {
		gridRef1.current?.resize('100%', '100%');
	}, []);

	// * 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '이동대상',
			children: (
				<OmOrderCreationSTOTab1
					gridRef={gridRef1}
					data={gridData1}
					totalCnt={totalCount}
					searchForm={form}
					onSave={onSave}
				/>
			),
		},
		{
			key: '2',
			label: '이동결과',
			children: <OmOrderCreationSTOTab2 gridRef={gridRef2} data={gridData2} />,
		},
	];

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			{activeTabKey === '1' && (
				<SearchFormResponsive form={form} initialValues={searchBox}>
					<OmOrderCreationSTOSearch form={form} />
				</SearchFormResponsive>
			)}

			{/* 상세 영역 정의 */}
			<TabsArray activeKey={activeTabKey} onChange={tabClick} items={tabs} />
		</>
	);
};

export default OmOrderCreationSTO;
