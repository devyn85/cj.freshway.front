/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOOrdBase.tsx
 # Description		: 주문 > 주문등록 > 당일광역보충발주
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/
// Lib
import { Form } from 'antd';

// Util

// Component
import {
	apiGetBatchResultHeadList,
	apiGetBatchResultList,
	apiGetDailyDeadlineSto,
	apiGetMasterList,
} from '@/api/om/apiOmOrderCreationSTOOrdBase';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import OmOrderCreationSTOOrdBaseDetail from '@/components/om/orderCreationSTOOrdBase/OmOrderCreationSTOOrdBaseDetail';
import OmOrderCreationSTOOrdBaseSearch from '@/components/om/orderCreationSTOOrdBase/OmOrderCreationSTOOrdBaseSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import styled from 'styled-components';

// API Call Function
// hooks

const OmOrderCreationSTOOrdBase = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	//Antd Form 사용
	const [form] = Form.useForm();
	const [detailForm] = Form.useForm();

	// grid data
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [gridData3, setGridData3] = useState([]);
	const [gridData4, setGridData4] = useState([]);
	const [dccode, setDccode] = useState('');
	const [searchVal, setSearchVal] = useState({});
	const [searchParams, setSearchParams] = useState({});
	const [totalCnt, setTotalCnt] = useState(0);

	const [activeTabKey, setActiveTabKey] = useState('1');

	const editDccodeList = getCommonCodeList('WMS_MNG_DC')
		.filter((item: any) => {
			return item.comCd !== '1000' && item.comCd !== '2170';
		})
		.map((item: any) => {
			return {
				...item,
				editNm: '[' + item.comCd + ']' + item.cdNm,
			};
		});

	// 컴포넌트 접근을 위한 Ref
	const gridRef = useRef(null);
	const gridRef2 = useRef(null);
	const gridRef3 = useRef(null);
	// 유효성 체크 코드리스트
	const validateCode = ['dcA', 'dcB', 'dcC', 'dcD', 'dcE', 'dcF'];
	const CHECKBOX_FIELDS = ['stordyn', 'serialyn', 'onlyOrdqty', 'poyn', 'stoyn', 'kxyn', 'stqtyyn', 'crossyn'];
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 순위별 필수 선택 및 순서 유효성 검사
	const validateSupplyCenterSequence = (params: any) => {
		const validCenterCodes = [];
		let preCenterEmpty = false;

		if (activeTabKey !== '3') {
			for (let i = 0; i < validateCode.length; i++) {
				// +1 (for)
				const code = validateCode[i];
				const codeValue = params[code];

				// 1, 2순위 필수 검사
				if (i < 2 && !codeValue) {
					showMessage({
						content: i + 1 + '순위 센터는 필수 선택 입니다.',
						modalType: 'info',
					});
					return null;
				}

				if (i >= 2) {
					if (!codeValue) {
						preCenterEmpty = true;
						continue;
					}

					if (codeValue && preCenterEmpty) {
						showMessage({
							content: i + 1 + '순위 센터 적용을 위해서는 이전순위 센터는 필수 선택 입니다.',
							modalType: 'info',
						});
						return null;
					}
				}

				if (codeValue) {
					validCenterCodes.push(codeValue);
				}
			}
		}
		return validCenterCodes;
	};
	/**
	 * api조회함수 호출
	 * @returns {void}
	 */
	const searchMasterList = () => {
		gridRef?.current?.clearGridData();
		const params = form.getFieldsValue();
		params.deliverydate = form.getFieldValue('deliverydate').format('YYYYMMDD');

		// 공급센터 유효성
		for (const key of validateCode) {
			if (params.dccode === params[key]) {
				showMessage({
					content: `동일한 센터가 공급센터와 공급받는센터로 지정할 수 없습니다`,
					modalType: 'info',
				});
				return;
			}
		}

		// 순위별 필수 선택 및 순서 유효성 검사(복잡도 저하를 위해 함수화)
		const validCenterCodes = validateSupplyCenterSequence(params);
		if (validCenterCodes === null) {
			return;
		}

		// 동일 공급센터 선택여부 확인
		const uniqueCenterCodes = new Set(validCenterCodes);
		if (validCenterCodes.length !== uniqueCenterCodes.size) {
			// 중복이 발견된 경우
			let errmsg = '1,2,3,4,5,6순위 센터는 서로 다른 센터를 선택하셔야 합니다.\n';

			// 에러 메시지에 현재 선택된 센터 리스트를 추가
			validCenterCodes.forEach((code, index) => {
				const dc = getUserDccodeList().find((item: any) => {
					if (item.dccode === code) return item;
				});
				errmsg += `  ${index + 1}순위: ${dc.dcname}\n`;
			});

			showAlert(null, errmsg);
			return;
		}

		CHECKBOX_FIELDS.forEach(field => {
			// params[field]는 현재 true 또는 false (boolean)
			if (params[field] === true) {
				params[field] = '1';
			} else if (params[field] === false) {
				params[field] = '0';
			}
		});

		// const openCenterList = getCommonCodeList('OPENCENTER');

		// 공급받는 센터가 오픈센터에 존재하는지 확인
		// const isExist = openCenterList.some((center: any) => center.comCd === params.dccode);

		// if (isExist) {
		// 	showAlert(null, "STO는 '공급받는 센터'가 사용하는 시스템에서 생성 가능합니다.");
		// 	return;
		// } else {
		if (activeTabKey === '1') {
			apiGetMasterList(params).then(res => {
				if (res.data) {
					setGridData(res.data);
					setSearchParams(params);
				}
			});
		} else if (activeTabKey === '2') {
			apiGetBatchResultList(params).then((res: any) => {
				if (res.data) {
					setGridData2(res.date);
					setSearchParams(params);
				}
			});
		} else if (activeTabKey === '3') {
			apiGetBatchResultHeadList(params).then((res: any) => {
				if (res.data) {
					setGridData3(res.data);
					setSearchParams(params);
				}
			});
			// apiGetBatchResultDetailList(params).then((res: any) => {
			// 	if (res.data) {
			// 		setGridData4(res.data);
			// 		setSearchParams(params);
			// 	}
			// });
		}
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	// 공급센터 변경에 따른 headerData set
	const onValuesChange = (changedValues: any, allValues: any) => {
		const changedKeys = Object.keys(changedValues)[0];
		const changedVal = Object.values(changedValues)[0];
		// 이체일자, 수급센터 공급센터 수정시 그리드 초기화
		if (changedKeys.startsWith('dc') || changedKeys === 'deliverydate') {
			gridRef.current.clearGridData();
			if (gridRef2.current) gridRef2.current.clearGridData();
			if (gridRef3.current) gridRef3.current.clearGridData();
		}

		if (changedKeys === 'stoStoragetype') return;

		// const gridDataLength = gridRef.current.getGridData().length;
		// if (gridDataLength === 0) {
		if (changedKeys === 'dccode') {
			form.setFieldValue('setDistancetype', '');
			form.setFieldValue('distancetype', '');
			setDccode(form.getFieldValue('dccode'));
		}
		if (changedKeys === 'dccode' || changedKeys === 'custorderclosetype') {
			const params = { dccode: form.getFieldValue('dccode') };
			const dailyDeadlineSto = form.getFieldValue('custorderclosetype');
			apiGetDailyDeadlineSto(params).then(res => {
				['dcA', 'dcB', 'dcC', 'dcD', 'dcE', 'dcF'].forEach(field => {
					form.setFieldValue(field, null);
					const setKey = field + 'Name';
					const headerVal = {
						[field]: '',
						[setKey]: '미선택',
					};
					setSearchVal((prev: any) => ({
						...prev,
						...headerVal,
					}));
				});
				if (res.data && Array.isArray(res.data)) {
					// 서버 응답이 유효하고 배열일 경우에만 처리합니다.

					// 💡 핵심 로직: 응답 배열을 순회하며 priority에 따라 값을 세팅합니다.
					res.data.forEach((item: any) => {
						const priority = parseInt(item.fromPriority);
						// fromPriority가 1부터 6 사이의 유효한 값인지 확인합니다.
						if (priority >= 1 && priority <= 6 && dailyDeadlineSto === item.dcClosetype) {
							// 1 -> A, 2 -> B, ..., 6 -> F 로 변환합니다.
							// 'A'.charCodeAt(0) + priority - 1
							const formFieldCode = String.fromCharCode('A'.charCodeAt(0) + priority - 1);
							const formField = `dc${formFieldCode}`; // 예: 'dcA', 'dcB'

							const dccodeValue = item.fromDccode;
							// 해당 우선순위 필드에 fromDccode 값을 세팅합니다.
							if (dccodeValue) {
								form.setFieldValue(formField, dccodeValue);
								const dc = editDccodeList.find((item: any) => {
									if (item.comCd === dccodeValue) return item;
								});
								const setKey = formField + 'Name';
								const headerVal = {
									[formField]: dccodeValue,
									[setKey]: dc ? dc.cdNm : dccodeValue,
									...changedValues,
								};
								setSearchVal((prev: any) => ({
									...prev,
									...headerVal,
								}));
							}
						}
					});
				}
			});
		}
		// 공급센터 변경시
		else if (changedKeys.startsWith('dc')) {
			const dc = editDccodeList.find((item: any) => {
				if (item.comCd === changedVal) return item;
			});
			const setKey = changedKeys + 'Name';
			const headerVal = {
				...changedValues,
				[setKey]: dc?.cdNm,
			};
			setSearchVal((prev: any) => ({
				...prev,
				...headerVal,
			}));
		}
		// }
		// else {
		// 	gridRef.current.clearGridData();
		// 	if (changedKeys === 'dccode') {
		// 		setDccode(form.getFieldValue('dccode'));
		// 	}
		// 	if (changedKeys.startsWith('dc')) {
		// 		const dc = getUserDccodeList().find((item: any) => {
		// 			if (item.dccode === changedVal) return item;
		// 		});
		// 		const setKey = changedKeys + 'Name';
		// 		const headerVal = {
		// 			...changedValues,
		// 			[setKey]: dc.dcnameOnlyNm,
		// 		};
		// 		setSearchVal(headerVal);
		// 	}
		// }
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />
			{/* 검색 영역 정의 */}
			<SearchFormWrapper>
				<SearchFormResponsive form={form} onValuesChange={onValuesChange}>
					<OmOrderCreationSTOOrdBaseSearch form={form} activeTabKey={activeTabKey} />
				</SearchFormResponsive>
			</SearchFormWrapper>

			{/* 화면 상세 영역 정의 */}
			<OmOrderCreationSTOOrdBaseDetail
				activeTabKey={activeTabKey}
				setActiveTabKey={setActiveTabKey}
				ref={gridRef}
				gridRef2={gridRef2}
				gridRef3={gridRef3}
				form={detailForm}
				gridData={gridData}
				gridData2={gridData2}
				gridData3={gridData3}
				gridData4={gridData4}
				search={searchMasterList}
				dccode={dccode}
				searchVal={searchVal}
				searchParams={searchParams}
				totalCnt={totalCnt}
				setTotalCnt={setTotalCnt}
			/>
		</>
	);
};
export default OmOrderCreationSTOOrdBase;

const SearchFormWrapper = styled.div`
	.ant-form {
		ul.hide {
			max-height: calc(110px);
		}
		ul {
			li {
				&:nth-child(5),
				&:nth-child(6),
				&:nth-child(7),
				&:nth-child(8) {
					border-bottom: 0;
				}
				&:nth-child(9) {
					.ant-row.ant-form-item-row {
						.ant-col.ant-form-item-control {
							padding: 0;
						}
					}
				}
			}
		}

		.ant-row.ant-form-item-row {
			.ant-form-item-label {
				min-width: 99px;
				max-width: 99px;
			}
			.ant-checkbox-label {
				white-space: nowrap;
			}
		}
		.ant-checkbox + span {
			padding-inline-start: 4px;
			padding-inline-end: 4px;
		}
		.ant-row.ant-form-item-row {
			.ant-col.ant-form-item-control {
				padding: 4px;
			}
		}
	}
`;
