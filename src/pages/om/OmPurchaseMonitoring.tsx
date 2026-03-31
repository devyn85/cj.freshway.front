/*
 ############################################################################
 # FiledataField	: OmPurchaseMonitoring.tsx
 # Description		: 주문 > 주문등록 > 저장품발주현황
 # Author			: JeongHyeongCheol
 # Since			: 25.09.10
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Util

// Component
import { apiGetGraphList, apiGetMasterList } from '@/api/om/apiOmPurchaseMonitoring';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmPurchaseMonitoringDetail from '@/components/om/purchaseMonitoring/OmPurchaseMonitoringDetail';
import OmPurchaseMonitoringSearch from '@/components/om/purchaseMonitoring/OmPurchaseMonitoringSearch';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function

// hooks
interface DataItem {
	tlevel: string | number; // 조회 결과의 tlevel 필드 (문자열 또는 숫자)
	// 기타 auigrid에 필요한 필드 (uid, id, name, charge, start 등)
	[key: string]: any;
}

// 변환된 계층 구조 데이터 타입
interface HierarchicalItem extends DataItem {
	children?: HierarchicalItem[];
}
const OmPurchaseMonitoring = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();

	// 입고센터
	const userDccodeList = getUserDccodeList();
	const [dccodeList, setDccodeList] = useState([]);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);
	// const [totalGridData, setTotalGridData] = useState([]);
	const [activeTabKey, setActiveTabKey] = useState('1');
	const [tlevel, setTlevel] = useState(1);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	const gridRef2 = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 
	/**
	 * api조회함수 호출
	 * @returns {void}
	 */
	const searchMasterList = async () => {
		let params: any;
		let searchBuyerkey: string;
		let searchDccode: string;
		let searchStoragetype: string;
		if (activeTabKey === '1') {
			params = form.getFieldsValue();

			searchBuyerkey = form.getFieldValue('buyerkey');
			searchDccode = form.getFieldValue('dccode');
			searchStoragetype = form.getFieldValue('storagetype');
		} else if (activeTabKey === '2') {
			const originalValues = form.getFieldsValue();

			params = Object.keys(originalValues).reduce((acc: any, key) => {
				if (key.endsWith('2')) {
					const newKey = key.slice(0, -1);
					acc[newKey] = originalValues[key];
				} else {
					acc[key] = originalValues[key];
				}
				return acc;
			}, {}); // 초기값으로 빈 객체 {} 사용
			searchBuyerkey = form.getFieldValue('buyerkey2');
			searchDccode = form.getFieldValue('dccode2');
			searchStoragetype = form.getFieldValue('storagetype2');
		}
		// 멀티검색 어노테이션 정제
		params.buyerkey = searchBuyerkey ? String(searchBuyerkey) : null;
		params.dccode = searchDccode ? String(searchDccode) : null;
		params.storagetype = searchStoragetype ? String(searchStoragetype) : null;

		// const isValid = await validateForm(form);
		// if (!isValid) {
		// 	return;
		// }

		// 날짜 check
		if (!params.requestdt) {
			showMessage({
				content: '입고일자를 입력해주세요.',
				modalType: 'info',
			});
			return;
		}
		// 발주추이 발주구분 check
		if (activeTabKey === '2' && (!params.purchasetype || params.purchasetype.length === 0)) {
			showMessage({
				content: '발주구분을 선택해주세요.',
				modalType: 'info',
			});
			return;
		}

		const fromDt = params.requestdt[0];
		const toDt = params.requestdt[1];

		const dateDifference = toDt.diff(fromDt, 'days');

		if (dateDifference > 31) {
			showMessage({
				content: '최대 31일까지 조회 가능합니다.',
				modalType: 'info',
			});
			return;
		}
		params.fromDate = fromDt.format('YYYYMMDD');
		params.toDate = toDt.format('YYYYMMDD');
		delete params.requestdt;

		// 발주현황
		if (activeTabKey === '1') {
			apiGetMasterList(params).then(res => {
				if (res.data) {
					setTotalCnt(res.data.length);
					const showData = convertToHierarchicalData(res.data);
					setGridData(showData);
				}
			});
		}
		// 발주추이
		else if (activeTabKey === '2') {
			params.typeList = params.purchasetype;
			delete params.purchasetype;
			apiGetGraphList(params).then(res => {
				if (res.data) {
					const gridData = res.data;

					// userDccodeList를 순회하며 필터링
					let codeList;
					if (params.dccode.length === 0) {
						codeList = userDccodeList.filter((item: any) => {
							return item.dccode;
						});
					} else {
						codeList = userDccodeList.filter((item: any) => {
							return params.dccode.includes(item.dccode);
						});
					}
					setDccodeList(codeList);
					// weights 객체의 내용을 변수에 저장
					const transformedGridData = gridData.map((item: any) => {
						const weightsData = item.weights;
						const transformedItem = {
							...item,
							...weightsData,
						};

						delete transformedItem.weights;

						return transformedItem;
					});
					setGridData2(transformedGridData);
				}
			});
		}
	};

	// 결과값 계층형 변환
	const convertToHierarchicalData = (flatData: DataItem[]): HierarchicalItem[] => {
		// 최종 결과 배열 (tlevel 0인 최상위 노드만 담김)
		const result: HierarchicalItem[] = [];

		// 각 레벨(tlevel)의 가장 최근에 추가된 부모 노드를 저장하는 Map
		// key: tlevel 값 (number), value: 해당 레벨의 부모 노드 객체
		const parentTracker = new Map<number, HierarchicalItem>();

		for (const item of flatData) {
			// 1. tlevel 값을 숫자로 변환
			const currentLevel = Number(item.tlevel);

			// 현재 처리 중인 아이템 객체 복사 (자식 배열을 추가하기 위함)
			const currentItem: HierarchicalItem = { ...item };

			// 2. 현재 레벨의 부모 레벨을 계산 (부모 레벨 = 현재 레벨 - 1)
			const parentLevel = currentLevel - 1;

			if (currentLevel === 0) {
				// 3. tlevel이 0인 경우: 최상위 부모 노드
				result.push(currentItem);
			} else {
				// 4. tlevel이 0보다 큰 경우: 자식 노드

				// 부모 레벨의 가장 최근 부모 노드를 가져옴
				const parentNode = parentTracker.get(parentLevel);

				if (parentNode) {
					// 부모 노드가 존재하는 경우
					if (!parentNode.children) {
						parentNode.children = [];
					}
					// 부모의 children 배열에 현재 아이템 추가
					parentNode.children.push(currentItem);
				} else {
					// 부모 노드를 찾을 수 없는 경우 (데이터 구조에 문제가 있을 수 있음)
					// 이 경우 최상위 레벨에 추가하거나, 해당 아이템을 건너뛸 수 있습니다.
					// 여기서는 최상위 레벨에 추가하여 데이터 손실을 방지합니다.
					result.push(currentItem);
				}
			}

			// 5. 현재 아이템을 현재 레벨의 '가장 최근 부모'로 등록/업데이트
			// 다음 루프에서 'currentLevel + 1'인 아이템이 이 아이템의 자식이 되도록 함
			parentTracker.set(currentLevel, currentItem);
		}

		return result;
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * 단계set
	 * @param value
	 * @param changedValues
	 * @param allValues
	 */
	const onChange = (changedValues: any, allValues: any) => {
		if (changedValues?.level) {
			gridRef.current.showItemsOnDepth(changedValues?.level);
			setTlevel(changedValues?.level);

			// 1. 각 레벨에서 "보여줘야 할" 컬럼들을 정의합니다.
			const columnsByLevel: any = {
				0: [],
				1: ['dccode'],
				2: ['dccode', 'buyername'],
				3: ['dccode', 'buyername', 'custkey', 'custkeyname'], // 2개 추가
				4: ['dccode', 'buyername', 'custkey', 'custkeyname', 'sku', 'skuname'], // 2개 추가
			};

			// 2. 전체 제어 대상 컬럼 리스트
			const allFields = ['dccode', 'buyername', 'custkey', 'custkeyname', 'sku', 'skuname'];

			// 3. 현재 레벨에 맞는 컬럼들을 가져옵니다. (없으면 빈 배열)
			const showFields = columnsByLevel[changedValues?.level - 1] || [];

			// 4. 전체 컬럼을 돌면서 보여줄지 숨길지 결정
			allFields.forEach(field => {
				if (showFields.includes(field)) {
					gridRef.current.showColumnByDataField(field);
				} else {
					gridRef.current.hideColumnByDataField(field);
				}
			});
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
			gridRef?.current.setSelectionByIndex(0);
		}

		const checkFields = [
			{ changedKey: 'buyerkey', resetKey: 'buyerkey' },
			{ changedKey: 'storagetype', resetKey: 'storagetype' },
			{ changedKey: 'buyerkey2', resetKey: 'buyerkey2' },
			{ changedKey: 'storagetype2', resetKey: 'storagetype2' },
		];

		checkFields.forEach(({ changedKey, resetKey }) => {
			if (changedValues[changedKey] && Array.isArray(allValues[changedKey]) && allValues[changedKey].includes('')) {
				form.setFieldValue(resetKey, '');
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		// 발주추이 발주구분 전체 초기 세팅
		form.setFieldValue('purchasetype2', 'ALL');
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={form} onValuesChange={onChange}>
				<OmPurchaseMonitoringSearch form={form} activeTabKey={activeTabKey} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<OmPurchaseMonitoringDetail
				ref={gridRef}
				gridRef2={gridRef2}
				gridData={gridData}
				gridData2={gridData2}
				dccodeList={dccodeList}
				activeTabKey={activeTabKey}
				setActiveTabKey={setActiveTabKey}
				tlevel={tlevel}
				totalCnt={totalCnt}
			/>
		</>
	);
};
export default OmPurchaseMonitoring;
