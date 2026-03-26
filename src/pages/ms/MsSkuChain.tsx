/*
 ############################################################################
 # FiledataField	: MsSkuChain.tsx
 # Description		: 기준정보 > 상품기준정보 > PLT변환값 마스터
 # Author			: JeongHyeongCheol
 # Since			: 25.06.26
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Utils

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import MsSkuChainDetail from '@/components/ms/skuChain/MsSkuChainDetail';
import MsSkuChainSearch from '@/components/ms/skuChain/MsSkuChainSearch';

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsSkuChain';
import { useAppSelector } from '@/store/core/coreHook';

// hooks

const MsSkuChain = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	//Antd Form 사용
	const [form] = Form.useForm();
	const [beforeDccode, setBeforeDccode] = useState(globalVariable.gDccode);
	const [searchDccode, setSearchDccode] = useState([globalVariable.gDccode]);

	// grid data
	const [gridData, setGridData] = useState([]);

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const onValuesChange = (changedValues: any, allValues: any) => {
		// 저장조건 전체 선택
		if (changedValues.storagetype && allValues.storagetype.includes('')) {
			form.setFieldValue('storagetype', '');
		}

		// dccode 변경 여부 확인
		if ('dccode' in changedValues) {
			const currentDccodes = changedValues.dccode || [];

			let finalValue = changedValues.dccode;

			// ----------------------------------------------------
			// 0000, 1000, 2170이 포함된 경우 처리
			// ----------------------------------------------------
			const isPlant0000 = currentDccodes.includes('0000');
			const isPlant0001 = currentDccodes.includes('0001');
			const isPlant0002 = currentDccodes.includes('0002');
			const isPlant1000 = currentDccodes.includes('1000');
			const isPlant2170 = currentDccodes.includes('2170');

			if (isPlant0000 || isPlant0001 || isPlant0002 || changedValues.dccode.length === 0) {
				setBeforeDccode('');
				return;
			}
			// 1000이나 2170이 둘 중 하나라도 포함되어 있는 경우
			else if (isPlant1000 || isPlant2170) {
				// 1000 또는 2170 중 하나만 선택
				if (isPlant1000 && beforeDccode !== '1000') {
					// 1000이 있으면 다른 값 무시하고 1000만 세팅
					finalValue = ['1000'];
					setBeforeDccode('1000');
				} else if (isPlant2170 && beforeDccode !== '2170') {
					// 2170이 있으면 다른 값 무시하고 2170만 세팅
					finalValue = ['2170'];
					setBeforeDccode('2170');
				} else {
					finalValue = currentDccodes.filter((item: any) => {
						return item !== '1000' && item !== '2170';
					});
					setBeforeDccode('');
				}

				// 현재 폼 값과 새로 세팅할 값이 다를 때만 업데이트
				const checkValue = allValues.dccode || [];
				if (JSON.stringify(checkValue.slice().sort()) !== JSON.stringify(finalValue.slice().sort())) {
					setTimeout(() => {
						form.setFieldsValue({
							dccode: finalValue,
						});
					}, 0);
				}
			}
			setSearchDccode([]);
			if (finalValue.length === 1) {
				setSearchDccode(finalValue);
			}
		}
	};
	/**
	 * 조회버튼
	 * @returns {void}
	 */
	const searchMasterList = () => {
		if (gridRef.current.getChangedData({ validationYn: false }).length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				searchMasterListRun();
			});
		} else {
			searchMasterListRun();
		}
	};

	/**
	 * API 조회
	 * @returns {void}
	 */
	const searchMasterListRun = () => {
		gridRef.current.clearGridData();

		const searchDccode = form.getFieldValue('dccode');
		const searchStoragetype = form.getFieldValue('storagetype');

		const params = form.getFieldsValue();
		params.dccode = searchDccode ? String(searchDccode) : null;
		params.storagetype = searchStoragetype ? String(searchStoragetype) : null;
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
		});
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 첫진입시 체크박스 체크
	useEffect(() => {
		form.setFieldValue('boxperpltYn', 1);
		form.setFieldValue('boxperpltYn_checkbox', true);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormResponsive
				form={form}
				onValuesChange={onValuesChange}
				// initialValues={{
				// 	boxperpltYn: 1, // Form의 initialValues로 초기값 설정
				// }}
			>
				<MsSkuChainSearch form={form} dccode={beforeDccode} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<MsSkuChainDetail ref={gridRef} searchDccode={searchDccode} gridData={gridData} search={searchMasterListRun} />
		</>
	);
};
export default MsSkuChain;
