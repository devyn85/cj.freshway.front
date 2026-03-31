/*
 ############################################################################
 # FiledataField	: CmSearchPopup.tsx
 # Description		: 공통 조회 팝업
 # Author			: jh.jang
 # Since			: 25.07.02
 ############################################################################
*/
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// component
import CmStorerKeySelectBox from '@/components/cm/user/CmStorerKeySelectBox';
import { InputText, SearchForm, SearchFormResponsive } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

// API Call Function
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { getSearchPopupApiFunction, getSearchPopupTitle } from '@/util/searchPopupConfigUtil';

interface PropsType {
	label?: string;
	type?: string;
	callBack?: any;
	close?: any;
	codeName?: string;
	customDccode?: string; // 추가: customDccode 필드(검색조건의 물류센터 적용)
	data?: any;
}

const CmSearchPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gridRef = useRef(null);

	const throttle = useThrottle();

	// scroll Paging
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const [searchBox] = useState({
		codeName: '',
	});

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const userDccodeList = getUserDccodeList('') ?? [];
	const [multiSelectCount, setMultiSelectCount] = useState(0);

	const gridId = uuidv4() + '_gridWrap';

	const gridCol =
		props.type === 'cust'
			? [
					{
						// 본점코드
						headerText: t('lbl.BRAND_CUSTKEY'),
						dataField: 'hqCustKey',
						cellMerge: true,
						dataType: 'code',
						labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
							// 쉼표 없이 숫자만 표시, 빈 값(-1)은 빈 문자열로
							return value === -1 || value === '' || value == null ? '' : String(value);
						},
					},
					{
						// 본점명
						headerText: t('lbl.BRAND_CUSTNAME2'),
						dataField: 'hqName',
						cellMerge: true,
						dataType: 'default',
					},
					{
						// 판매처코드
						headerText: t('lbl.TO_VATNO'),
						dataField: 'saleCustKey',
						cellMerge: true,
						dataType: 'code',
					},
					{
						// 판매처명
						headerText: t('lbl.TO_VATOWNER'),
						dataField: 'saleName',
						cellMerge: true,
						dataType: 'default',
					},
					{
						// 관리처코드
						headerText: t('lbl.FROM_CUSTKEY_RT'),
						dataField: 'mngCustkey',
						cellMerge: true,
						dataType: 'code',
					},
					{
						// 관리처명
						headerText: t('lbl.FROM_CUSTNAME_RT'),
						dataField: 'mngName',
						cellMerge: true,
						dataType: 'default',
					},

					{
						// 센터코드/명
						headerText: t('lbl.CENTER_CODENAME'),
						dataField: 'dlvDccode',
						dataType: 'code',
						// 넘어오는 코드로 "[물류센터코드]물류센터명" 형태로 표시
						labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
							return value === -1 || value === '' || value == null
								? ''
								: getUserDccodeList().find((item: any) => item.dccode === value)?.dcname;
						},
					},
					{
						// 기본주소
						headerText: t('lbl.ADDRESS1'),
						dataField: 'address1',
						dataType: 'default',
					},
					{
						// 기본주소
						headerText: t('lbl.ADDRESS2'),
						dataField: 'address2',
						dataType: 'default',
						visible: false,
					},
			  ]
			: [
					{
						headerText:
							props.type === 'carPOP' || ['carPOP2', 'carPOP3', 'individualDispatchPOP'].includes(props.type)
								? '차량번호'
								: '코드',
						dataField: 'code',
						dataType: 'code',
					},
					{
						headerText:
							props.type === 'carPOP' || ['carPOP2', 'carPOP3', 'individualDispatchPOP'].includes(props.type)
								? 'POP번호'
								: '명',
						dataField: 'name',
					},
					{
						headerText: '코드',
						dataField: 'tcCode',
						dataType: 'code',
						visible: false,
					},
					{
						headerText: '기본단위',
						dataField: 'baseuom',
						visible: props.type === 'sku_2' ? true : false,
					},
					{
						headerText: '입수량',
						dataField: 'qtyPerBox',
						visible: props.type === 'sku_2' ? true : false,
					},
					{
						headerText: '명',
						dataField: 'tcName',
						visible: false,
					},
					{
						headerText: '사용자ID',
						dataField: 'userId',
						visible: false,
					},
					{
						headerText: '사용자명',
						dataField: 'userNm',
						visible: false,
					},
					{
						headerText: '전화번호',
						dataField: 'handphoneNo',
						visible: false,
					},
					{
						headerText: '이메일',
						dataField: 'mailId',
						visible: false,
					},

					// 추천실착지코드 추가
					{
						headerText: '고객코드',
						dataField: 'custkey',
						dataType: 'code',
						visible: false,
					},
					{
						headerText: '고객명',
						dataField: 'custname',
						visible: false,
					},
					{
						headerText: '주소',
						dataField: 'address1',
						visible: false,
					},
					{
						headerText: '상세주소',
						dataField: 'address2',
						visible: false,
					},
					{
						headerText: '추천실착지코드',
						dataField: 'truthcustkey',
						visible: false,
					},
					{
						headerText: '추천실착지명',
						dataField: 'truthcustname',
						visible: false,
					},
					{
						headerText: '추천주소',
						dataField: 'truthaddress1',
						visible: false,
					},
					{
						headerText: '추천상세주소',
						dataField: 'truthaddress2',
						visible: false,
					},
					{
						headerText: '유사도',
						dataField: 'similarity',
						visible: false,
					},
					{
						headerText: '계약유형',
						dataField: 'contractType',
						dataType: 'code',
						visible: ['carPOP2', 'carPOP3', 'individualDispatchPOP'].includes(props.type),
						labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
							const list = getCommonCodeList('CONTRACTTYPE');
							// value가 null, undefined, '' 인 경우 모두 빈 문자열('')로 취급하여 비교
							const targetValue = value ?? '';
							const match = list.find(i => i.comCd == targetValue);
							return match ? match.cdNm : value;
						},
					},
					{
						headerText: '운송사코드',
						dataField: 'courier',
						dataType: 'code',
						visible: props.type === 'carPOP3' || props.type === 'individualDispatchPOP' ? true : false,
					},
					{
						headerText: '운송사명',
						dataField: 'couriername',
						dataType: 'code',
						visible: props.type === 'carPOP3' || props.type === 'individualDispatchPOP' ? true : false,
					},
					{
						headerText: '2차운송사코드',
						dataField: 'caragentkey',
						dataType: 'code',
						visible: props.type === 'carPOP3' || props.type === 'individualDispatchPOP' ? true : false,
					},
					{
						headerText: '2차운송사명',
						dataField: 'caragentname',
						dataType: 'code',
						visible: props.type === 'carPOP3' || props.type === 'individualDispatchPOP' ? true : false,
					},
			  ];

	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
	};

	const title = getSearchPopupTitle(props.type);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = useCallback(() => {
		setCurrentPage(1);
		gridRef.current.clearGridData();
		const params =
			props.type === 'cust'
				? {
						name: form.getFieldValue('codeName'),
						multiSelect: form.getFieldValue('multiSelect'),
						dlvSearchVal: form.getFieldValue('dlvSearchVal'),
						saleCustSearchVal: form.getFieldValue('saleCustSearchVal'),
						childCustSearchVal: form.getFieldValue('childCustSearchVal'),
				  }
				: form.getFieldValue('codeName');
		searchScroll(true, params);
	}, []);

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ codeName: '' });
		gridRef.current.clearGridData();
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		callBack(selectedRow);
	};

	/**
	 * 확인
	 */
	const checkRowData = () => {
		const checkedRow = gridRef.current.getSelectedRows();
		if (checkedRow.length === 0) {
			props.close();
			return;
		}
		callBack(checkedRow);
	};

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value: string | any) => {
		const tt = currentPage - 1;

		const params: any = {
			name: value,
			// dccode: gDccode,
			dccode: props.customDccode ? props.customDccode : gDccode,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPage !== 1,
			userNm: props.type === 'user' ? value : '',
			customDccode: props.customDccode ? props.customDccode : '', // 추가: customDccode 파라미터 설정
			...(props.data ?? {}),
		};

		const apiFunction = getSearchPopupApiFunction(props.type);

		if (!apiFunction) {
			return;
		}

		const paramsByType = { ...params };

		if (props.type === 'cust') {
			paramsByType.expandedColumns = 'Y';
			paramsByType.name = value.name || '';
			paramsByType.multiSelect = value.multiSelect || '';
			paramsByType.dlvSearchVal = value.dlvSearchVal || '';
			paramsByType.saleCustSearchVal = value.saleCustSearchVal || '';
			paramsByType.childCustSearchVal = value.childCustSearchVal || '';
		}

		switch (props.type) {
			case 'allOrganize':
				paramsByType.dccode = '';
				break;
			case 'directDlv':
				paramsByType.dccode = props.codeName;
				break;
		}
		apiFunction(paramsByType).then((res: any) => {
			settingSelectData(res.data);
		});
	}, 500);

	/**
	 * response 데이터 grid에 설정
	 * @param {Array} data grid에 설정할 데이터
	 */
	const settingSelectData = (data: any) => {
		if (data.list?.length > 0) {
			if (currentPage === 1) {
				setTotalCount(data.totalCount);
			}
			const gridData = data.list;

			gridRef.current.appendData(gridData);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		} else {
			setTotalCount(0);
			gridRef.current.setGridData([]);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		}
	};

	/**
	 * 다중선택 붙여넣기
	 * @param  {any} event 이벤트
	 */
	const handlePaste = (event: any) => {
		event.preventDefault(); // 기본 붙여넣기 동작 방지

		const pastedText = event.clipboardData.getData('text/plain');
		let transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

		//transformedText 제일 끝 문자가 ','로 끝나면 제거
		if (transformedText.endsWith(',')) {
			transformedText = transformedText.slice(0, -1);
		}

		// 중복 문자열 제거
		transformedText = [...new Set(transformedText.split(','))].join(',');

		const multiCnt = transformedText.split(',').length;

		if (multiCnt > 5000) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
		form.setFieldsValue({ multiSelect: transformedText });
	};

	const onChangeMultiSelect = (e: any) => {
		let value = e.target.value;
		if (value === '') {
			setMultiSelectCount(0);
			return;
		}

		//value 제일 끝 문자가 ','로 끝나면 제거하고 카운트
		if (value.endsWith(',')) {
			value = value.slice(0, -1);
		}

		const multiCnt = value.split(',').length;

		if (multiCnt > 5000) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', function () {
			selectRowData();
		});
	}, []);

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPage: any) => currentPage + 1);
		},
		totalCount,
	});

	/**
	 * 발주직송그룹에서진입
	 */
	useEffect(() => {
		if (props.codeName) {
			if (props.type === 'cust') {
				form.setFieldValue('multiSelect', props.codeName);
			} else {
				form.setFieldValue('codeName', props.codeName);
			}
			const params =
				props.type === 'cust'
					? {
							name: form.getFieldValue('codeName'),
							multiSelect: form.getFieldValue('multiSelect'),
							dlvSearchVal: form.getFieldValue('dlvSearchVal'),
							saleCustSearchVal: form.getFieldValue('saleCustSearchVal'),
							childCustSearchVal: form.getFieldValue('childCustSearchVal'),
					  }
					: props.codeName;
			searchScroll(true, params);
		}
	}, [props.codeName]);

	/**
	 * 사용자팝업
	 */
	useEffect(() => {
		if (props.type === 'user') {
			gridRef.current.showColumnByDataField('userId');
			gridRef.current.showColumnByDataField('userNm');
			gridRef.current.showColumnByDataField('handphoneNo');
			gridRef.current.showColumnByDataField('mailId');

			gridRef.current.hideColumnByDataField('code');
			gridRef.current.hideColumnByDataField('name');
			gridRef.current.hideColumnByDataField('tcCode');
			gridRef.current.hideColumnByDataField('tcName');
			gridRef.current.hideColumnByDataField('custkey');
			gridRef.current.hideColumnByDataField('address1');
			gridRef.current.hideColumnByDataField('address2');
			gridRef.current.hideColumnByDataField('truthcustkey');
			gridRef.current.hideColumnByDataField('truthaddress1');
			gridRef.current.hideColumnByDataField('truthaddress2');
			gridRef.current.hideColumnByDataField('similarity');
			gridRef.current.hideColumnByDataField('truthcustname');
			gridRef.current.hideColumnByDataField('custname');

			gridRef.current.hideColumnByDataField('courier');
			gridRef.current.hideColumnByDataField('couriername');
			gridRef.current.hideColumnByDataField('caragentkey');
			gridRef.current.hideColumnByDataField('caragentname');
		} else if (props.type === 'tc') {
			gridRef.current.showColumnByDataField('tcCode');
			gridRef.current.showColumnByDataField('tcName');

			gridRef.current.hideColumnByDataField('userId');
			gridRef.current.hideColumnByDataField('userNm');
			gridRef.current.hideColumnByDataField('handphoneNo');
			gridRef.current.hideColumnByDataField('mailId');
			gridRef.current.hideColumnByDataField('code');
			gridRef.current.hideColumnByDataField('name');
			gridRef.current.hideColumnByDataField('custkey');
			gridRef.current.hideColumnByDataField('address1');
			gridRef.current.hideColumnByDataField('address2');

			gridRef.current.hideColumnByDataField('truthcustkey');
			gridRef.current.hideColumnByDataField('truthcustname');
			gridRef.current.hideColumnByDataField('custname');
			gridRef.current.hideColumnByDataField('truthaddress1');
			gridRef.current.hideColumnByDataField('truthaddress2');
			gridRef.current.hideColumnByDataField('similarity');

			gridRef.current.hideColumnByDataField('courier');
			gridRef.current.hideColumnByDataField('couriername');
			gridRef.current.hideColumnByDataField('caragentkey');
			gridRef.current.hideColumnByDataField('caragentname');
		} else if (props.type === 'truthcustkey') {
			gridRef.current.showColumnByDataField('custkey');
			gridRef.current.showColumnByDataField('custname');
			gridRef.current.showColumnByDataField('address1');
			gridRef.current.showColumnByDataField('address2');
			gridRef.current.showColumnByDataField('truthcustkey');
			gridRef.current.showColumnByDataField('truthcustname');
			gridRef.current.showColumnByDataField('truthaddress1');
			gridRef.current.showColumnByDataField('truthaddress2');
			gridRef.current.showColumnByDataField('similarity');

			gridRef.current.hideColumnByDataField('tcCode');
			gridRef.current.hideColumnByDataField('tcName');
			gridRef.current.hideColumnByDataField('userId');
			gridRef.current.hideColumnByDataField('userNm');
			gridRef.current.hideColumnByDataField('handphoneNo');
			gridRef.current.hideColumnByDataField('mailId');
			gridRef.current.hideColumnByDataField('code');
			gridRef.current.hideColumnByDataField('name');

			gridRef.current.hideColumnByDataField('courier');
			gridRef.current.hideColumnByDataField('couriername');
			gridRef.current.hideColumnByDataField('caragentkey');
			gridRef.current.hideColumnByDataField('caragentname');
		} else if (props.type === 'carPOP3' || props.type === 'individualDispatchPOP') {
			gridRef.current.showColumnByDataField('code');
			gridRef.current.showColumnByDataField('name');

			gridRef.current.hideColumnByDataField('userId');
			gridRef.current.hideColumnByDataField('userNm');
			gridRef.current.hideColumnByDataField('handphoneNo');
			gridRef.current.hideColumnByDataField('mailId');
			gridRef.current.hideColumnByDataField('tcCode');
			gridRef.current.hideColumnByDataField('tcName');
			gridRef.current.hideColumnByDataField('custkey');
			gridRef.current.hideColumnByDataField('address1');
			gridRef.current.hideColumnByDataField('address2');
			gridRef.current.hideColumnByDataField('truthcustkey');
			gridRef.current.hideColumnByDataField('truthaddress1');
			gridRef.current.hideColumnByDataField('truthaddress2');
			gridRef.current.hideColumnByDataField('similarity');
			gridRef.current.hideColumnByDataField('truthcustname');
			gridRef.current.hideColumnByDataField('custname');

			gridRef.current.hideColumnByDataField('courier');
			gridRef.current.hideColumnByDataField('caragentkey');
		} else {
			gridRef.current.showColumnByDataField('code');
			gridRef.current.showColumnByDataField('name');

			gridRef.current.hideColumnByDataField('userId');
			gridRef.current.hideColumnByDataField('userNm');
			gridRef.current.hideColumnByDataField('handphoneNo');
			gridRef.current.hideColumnByDataField('mailId');
			gridRef.current.hideColumnByDataField('tcCode');
			gridRef.current.hideColumnByDataField('tcName');
			gridRef.current.hideColumnByDataField('custkey');
			gridRef.current.hideColumnByDataField('address1');
			gridRef.current.hideColumnByDataField('address2');
			gridRef.current.hideColumnByDataField('truthcustkey');
			gridRef.current.hideColumnByDataField('truthaddress1');
			gridRef.current.hideColumnByDataField('truthaddress2');
			gridRef.current.hideColumnByDataField('similarity');
			gridRef.current.hideColumnByDataField('truthcustname');
			gridRef.current.hideColumnByDataField('custname');

			gridRef.current.hideColumnByDataField('courier');
			gridRef.current.hideColumnByDataField('couriername');
			gridRef.current.hideColumnByDataField('caragentkey');
			gridRef.current.hideColumnByDataField('caragentname');
		}
	}, [props.type]);

	/**
	 * 스크롤하여 페이지 이동되면 데이터 조회
	 */
	useEffect(() => {
		if (currentPage > 1) {
			const param =
				props.type === 'cust'
					? {
							name: form.getFieldValue('codeName'),
							multiSelect: form.getFieldValue('multiSelect'),
							dlvSearchVal: form.getFieldValue('dlvSearchVal'),
							saleCustSearchVal: form.getFieldValue('saleCustSearchVal'),
							childCustSearchVal: form.getFieldValue('childCustSearchVal'),
					  }
					: form.getFieldValue('codeName');
			searchScroll(true, param);
		}
	}, [currentPage]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={props.label || title} func={titleFunc} />
			{props.type === 'cust' ? (
				<SearchFormResponsive form={form} initialValues={searchBox} groupClass="grid-column-2" isAlwaysVisible>
					<li>
						{/* 물류센터 */}
						<CmGMultiDccodeSelectBox
							name="dccode"
							label={t('lbl.DCCODE')}
							mode="multiple"
							placeholder="선택해주세요"
							// rules={[{ required: true, validateTrigger: 'none' }]}
							initval={userDccodeList.map((item: any) => item.dccode)}
						/>
					</li>
					{/* 본점 고객코드/명 */}
					<li>
						<InputText
							width={80}
							name="dlvSearchVal"
							placeholder={t('msg.MSG_COM_VAL_006', ['본점 고객코드 또는 이름'])}
							onPressEnter={onClickSearchButton}
							label={t('lbl.DLVCODENAME')}
							onPaste={(event: any) => {
								event.preventDefault(); // 기본 붙여넣기 동작 방지

								// 붙여넣기시 첫번째 코드만 설정
								const pastedText = event?.clipboardData?.getData('text/plain');
								if (commUtil.isNotEmpty(pastedText)) {
									const transformedText = pastedText.replaceAll(/(?:\r\n|\r|\n)/g, ',');
									const first = transformedText.split(',')[0];
									form.setFieldsValue({ ['dlvSearchVal']: first });
								}
							}}
						/>
					</li>
					{/* 판매처 고객코드/명 */}
					<li>
						<InputText
							width={80}
							name="saleCustSearchVal"
							placeholder={t('msg.MSG_COM_VAL_006', ['판매처 고객코드 또는 이름'])}
							onPressEnter={onClickSearchButton}
							label={t('lbl.SALECUSTCODENAME')}
							onPaste={(event: any) => {
								event.preventDefault(); // 기본 붙여넣기 동작 방지

								// 붙여넣기시 첫번째 코드만 설정
								const pastedText = event?.clipboardData?.getData('text/plain');
								if (commUtil.isNotEmpty(pastedText)) {
									const transformedText = pastedText.replaceAll(/(?:\r\n|\r|\n)/g, ',');
									const first = transformedText.split(',')[0];
									form.setFieldsValue({ ['saleCustSearchVal']: first });
								}
							}}
						/>
					</li>
					{/* 관리처 고객코드/명 */}
					<li>
						<InputText
							width={80}
							// name="childCustSearchVal"
							name="multiSelect"
							placeholder={t('msg.MSG_COM_VAL_006', ['관리처 고객코드 또는 이름'])}
							label={t('lbl.CHILDCUSTCODENAME')}
							onPaste={handlePaste}
							onChange={onChangeMultiSelect}
							onPressEnter={onClickSearchButton}
							count={{
								show: true,
								max: 5000,
								strategy: () => multiSelectCount,
							}}
						/>
					</li>
				</SearchFormResponsive>
			) : (
				<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
					{props.type !== 'truthcustkey' && (
						<UiFilterArea>
							<UiFilterGroup className="grid-column-2">
								<li>
									<CmStorerKeySelectBox nameKey="storerKey" label={t('lbl.STORERKEY')} />
								</li>
								<li>
									<InputText
										width={80}
										name={'codeName'}
										placeholder={t('msg.MSG_COM_VAL_006', ['코드 또는 이름'])}
										onPressEnter={onClickSearchButton}
										label={props.type === 'user' ? 'ID 또는 이름' : '코드 또는 이름'}
									/>
								</li>
							</UiFilterGroup>
						</UiFilterArea>
					)}
				</SearchForm>
			)}

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={props.close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmSearchPopup;
