/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOOrdBaseFO.tsx
 # Description		: 당일광역보충발주(FO)
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 26.03.10
 ############################################################################
*/
// CSS

// Lib
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';
import OmOrderCreationSTOOrdBaseFODetail from '@/components/om/orderCreationSTOOrdBaseFO/OmOrderCreationSTOOrdBaseFODetail';
import OmOrderCreationSTOOrdBaseFODetail2 from '@/components/om/orderCreationSTOOrdBaseFO/OmOrderCreationSTOOrdBaseFODetail2';
import OmOrderCreationSTOOrdBaseFODetail3 from '@/components/om/orderCreationSTOOrdBaseFO/OmOrderCreationSTOOrdBaseFODetail3';
import OmOrderCreationSTOOrdBaseFOSearch from '@/components/om/orderCreationSTOOrdBaseFO/OmOrderCreationSTOOrdBaseFOSearch';

// Util
import { showAlert } from '@/util/MessageUtil';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiPostDcname, apiPostMasterList, apiPostSTOList } from '@/api/om/apiOmOrderCreationSTOOrdBaseFO';
import TabsArray from '@/components/common/TabsArray';

// Hooks

const OmOrderCreationSTOOrdBaseFO = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// 전역 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 컴포넌트 접근을 위한 Ref
	const refs: any = useRef(null);

	// 그리드 데이터
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);

	// 조회 총 건수
	const [totalCount, setTotalCount] = useState(0);
	const [totalCount2, setTotalCount2] = useState(0);
	const [totalCount3, setTotalCount3] = useState(0);

	// 탭 key
	const [currentTabKey, setCurrentTabKey] = useState('1');
	// 그리드 컬럼 표시용 물류센터명
	const [dcname, setDcname] = useState('');
	// 주문 수신 시 자동 배차 센터
	const dsAutodc = getCommonCodeList('AUTO_TM_DC');
	// 센터별 당일광역보충발주 공급센터
	const dsOrdbaseDcset = getCommonCodeList('OM_ORDBASE_DCSET');

	// searchForm data 초기화
	const [searchBox] = useState({
		deliverydate: dayjs(),
		deliverydate2: dayjs(),
		ignorecrossyn: '1',
		onlyordqty: null,
		stuseyn: '1',
		serialyn: '1',
		storagetype: null,
		fixdccode: null,
		ordcrossyn: '1',
		custorderclosetype: null,
		sku: null,
		sku2: null,
		skuexcept: null,
		distancetype: null,
		setdistancetype: null,
		stockcrossyn: null,
		dcA: null,
		poyn: null,
		stoyn: null,
		kxyn: null,
		toDccode: globalVariable.gDccode,
		fromDccode: null,
		toDccode2: globalVariable.gDccode,
		fromDccode2: null,
		docno: null,
		toCustkey: null,
		stqtyyn: '1',
		opqtyyn: '1',
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 물류센터 조회
	 * @param params
	 */
	const searchDc = async () => {
		//const searchParams = searchForm.getFieldsValue();
		const fromDccode = searchForm.getFieldValue('fromDccode');
		const params = {
			dccode: fromDccode,
		};

		// API 호출
		apiPostDcname(params).then(res => {
			if (res.data) {
				setDcname(res.data[0].dcname);
			}
		});
	};

	/**
	 * 목록 조회
	 */
	const searchMasterList = async () => {
		// 입력 값 검증
		const isValid = await validateForm(searchForm);
		if (!isValid) {
			return;
		}

		if (currentTabKey === '1') {
			// tab1 이체대상 조회
			const searchParams = searchForm.getFieldsValue();

			const toDccode = searchForm.getFieldValue('toDccode');
			const fromDccode = searchForm.getFieldValue('fromDccode');

			if (commUtil.isEmpty(toDccode)) {
				showAlert('', t('lbl.TO_DCCODE') + '값을 입력해 주세요.');
				return;
			}

			if (commUtil.isEmpty(fromDccode)) {
				showAlert('', t('lbl.FROM_DCCODE') + '값을 입력해 주세요.');
				return;
			}

			//공통코드 AUTO_TM_DC에 물류센터를 설정하는 방식
			const findedAutodc = dsAutodc.find((item: any) => item.comCd === toDccode);

			if (!findedAutodc || findedAutodc.data4 !== 'Y') {
				showAlert(null, '해당 공급받는센터는 본 메뉴를 사용할 수 없습니다.(현재 ' + toDccode + '센터)');
				return;
			}

			if (searchParams.fromDccode === searchParams.toDccode) {
				showAlert(
					null,
					'조회대상(' +
						searchParams.toDccode +
						'] 센터와 같은 공급센터[ ' +
						searchParams.fromDccode +
						']를 지정할 수 없습니다.',
				);
				return;
			}

			// 그리드 초기화
			refs.gridRef?.current?.clearGridData();
			refs.gridRef2?.current?.clearGridData();

			//const openCenterList = getCommonCodeList('OPENCENTER');

			// 조회 조건 설정
			const params = {
				deliverydate: dayjs(searchParams.deliverydate).format('YYYYMMDD'),
				dcA: searchParams.fromDccode,
				toDccode: searchParams.toDccode,
				sku: searchParams.sku,
				skuexcept: searchParams.skuexcept,
				storagetype: searchParams.storagetype,
				custorderclosetype: searchParams.custorderclosetype,
				serialyn: searchParams.serialyn,
				distancetype: searchParams.distancetype,
				setdistancetype: searchParams.setdistancetype,
				stuseyn: searchParams.stuseyn,
				ordcrossyn: searchParams.ordcrossyn,
				ignorecrossyn: searchParams.ignorecrossyn,
				stqtyyn: searchParams.stqtyyn,
				opqtyyn: searchParams.opqtyyn,
			};

			// API 호출
			apiPostMasterList(params).then(res => {
				setGridData(res.data);
				setTotalCount(res.data.length);
			});

			searchDc();
		} else if (currentTabKey === '3') {
			// tab3 이체대상현황 조회
			const searchParams = searchForm.getFieldsValue();

			// 그리드 초기화
			refs.gridRef3?.current?.clearGridData();

			//const openCenterList = getCommonCodeList('OPENCENTER');

			// 조회 조건 설정
			const params = {
				deliverydate: dayjs(searchParams.deliverydate2).format('YYYYMMDD'),
				sku: searchParams.sku2,
				fromDccode: searchParams.fromDccode2,
				toDccode: searchParams.toDccode2,
				docno: searchParams.docno,
				stoDocno: searchParams.stoDocno,
				toCustkey: searchParams.toCustkey,
			};

			// API 호출
			apiPostSTOList(params).then(res => {
				setGridData3(res.data);
				setTotalCount3(res.data.length);
			});
		}
	};

	/**
	 * 처리결과 조회
	 */
	const searchResultList = async () => {
		// 그리드 초기화
		refs.gridRef2?.current?.clearGridData();
	};

	/**
	 * 탭 클릭 이벤트
	 * @param {string} activeKey 탭 번호
	 */

	const onTabChange = (key: string) => {
		try {
			setCurrentTabKey(key);

			switch (key) {
				case '1':
					refs.gridRef.current?.resize('100%', '100%');
					break;

				case '2':
					refs.gridRef2.current?.resize('100%', '100%');
					break;

				case '3':
					refs.gridRef3.current?.resize('100%', '100%');
					break;

				default:
					break;
			}
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * 공급센터 조회 조건 변경 콜백
	 */
	const handleChangeFromDccode = () => {
		// 그리드 초기화
		if (currentTabKey === '1') {
			refs.gridRef?.current?.clearGridData();
			setTotalCount(0);
		}
	};

	/**
	 * 저장 성공 콜백 (Tab1에서 호출)
	 * @param {any} resultData 저장 결과 데이터
	 */
	const handleSaveSuccess = (resultData?: any) => {
		// Tab2로 이동
		onTabChange('2');
		setGridData2(resultData);
		setTotalCount2(resultData.length);
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: t('이체대상'),
			children: (
				<OmOrderCreationSTOOrdBaseFODetail
					ref={refs}
					gridData={gridData}
					totalCount={totalCount}
					searchForm={searchForm}
					callBackFn={handleSaveSuccess}
					dcname={dcname}
				/>
			),
		},
		{
			key: '2',
			label: t('처리결과'),
			children: (
				<OmOrderCreationSTOOrdBaseFODetail2
					ref={refs}
					gridData={gridData2}
					totalCount={totalCount2}
					searchForm={searchForm}
				/>
			),
		},
		{
			key: '3',
			label: t('이체대상현황'),
			children: (
				<OmOrderCreationSTOOrdBaseFODetail3
					ref={refs}
					gridData={gridData3}
					totalCount={totalCount3}
					searchForm={searchForm}
				/>
			),
		},
	];

	return (
		<>
			{/* 상단 타이틀 및 페이지 버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<OmOrderCreationSTOOrdBaseFOSearch
					form={searchForm}
					currentTabKey={currentTabKey}
					callBack={handleChangeFromDccode}
					dsOrdbaseDcset={dsOrdbaseDcset}
					gDccode={globalVariable.gDccode}
				/>
			</SearchFormResponsive>

			{/* 상세 영역 정의 */}
			<TabsArray onChange={onTabChange} activeKey={currentTabKey} items={tabItems} />
		</>
	);
};

export default OmOrderCreationSTOOrdBaseFO;
