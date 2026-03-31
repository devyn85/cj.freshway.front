// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { InputText, SelectBox } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { validateForm } from '@/util/FormUtil';
import { Form, Input } from 'antd';
import dayjs from 'dayjs';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetPartner } from '@/api/cm/apiCmSearch';
import { apiGetMaster, apiPostSaveMaster, apiPostSaveMasterList } from '@/api/ms/apiMsCarrier';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

const MsCarrierDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	/**
	 * 전화번호 및 팩스번호 정규식 패턴
	 * 기존: 010, 011, 016, 017, 018, 019
	 * 추가: 02, 031, 032, 033, 041, 042, 051, 052, 053, 054, 055, 061, 062, 063, 064, 070, 000, 080
	 * 비고1: 하이픈 포험, 미포함 커버 (기존방식에서 변경)
	 * 비고2: 3자리-4자리, 4자리-3자리 커버
	 * 비고3: 하이픈 없이 입력시 자동으로 하이픈 붙여주는 기능O (공통 개발 사항)
	 */
	const PHONE_PATTERN =
		/^(?:01[016-9]|02|031|032|033|041|042|051|052|053|054|055|061|062|063|064|070|080|000)(?:-?\d{3,4})-?\d{4}$/;

	// 하이픈이 있어도 되고 없어도 되는 전화번호 패턴 (기존 정책 유지하되 하이픈 선택적)
	const PHONE_PATTERN_WITHOUT_HYPHEN =
		/^(?:01[016-9]|02|031|032|033|041|042|051|052|053|054|055|061|062|063|064|070|080|000)(?:-?\d{3,4})-?\d{4}$|^(?:01[016-9]|02|031|032|033|041|042|051|052|053|054|055|061|062|063|064|070|080|000)\d{7,8}$/;

	// 다국어
	const { t } = useTranslation();

	const detailForm = props.detailForm;

	// 전역 스토어의 기본 storerKey 사용
	const storerKey = useAppSelector(state => state.global.globalVariable.gStorerkey);

	// 상세 Form 활성화 상태 관리
	const [formDisabled, setFormDisabled] = useState(true);

	// CmPartnerSearch value 상태 관리
	const [partnerSearchValue, setPartnerSearchValue] = useState('');

	// 필드별 disabled 상태 관리
	const [fieldDisabled, setFieldDisabled] = useState({
		normal: true,
		manager: false,
		readonly: true,
		disableCoreInfo: true, // 기존행에서만 사용, SUBC일 때 false, 일반일 때 true
	});

	const statusCodeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STATUS_CODE', value)?.cdNm;
	};

	const carrierTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARRIERTYPE', value)?.cdNm;
	};

	// 그리드 컬럼 정의
	const gridCol = [
		{
			dataField: 'carrierKey',
			headerText: t('lbl.CARRIERCODE'), // 운송사코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'description',
			headerText: t('lbl.CARRIERNAME'), // 운송사명
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'owner',
			headerText: t('lbl.OWNER_P'), // 사업주명
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'carrierType',
			labelFunction: carrierTypeLabelFunc,
			headerText: t('lbl.CARRIERTYPE'), // 운송사유형
			dataType: 'code',
			editable: false,
			required: true,
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'), // 사용여부
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				keyField: 'comCd',
				valueField: 'cdNm',
				list: getCommonCodeList('DEL_YN'),
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DEL_YN', value)?.cdNm;
			},
		},
		{
			dataField: 'phone1',
			headerText: t('lbl.PHONE1'), // 전화번호1
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'fax',
			headerText: t('lbl.FAX'), // 팩스번호
			dataType: 'string',
			editable: false,
		},
		// {
		// 	dataField: 'status',
		// 	labelFunction: statusCodeLabelFunc,
		// 	headerText: t('lbl.STATUS'), // 진행상태
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			dataField: 'addWho',
			headerText: t('lbl.REGISTER'), // 등록자
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.REGDATTM'), // 등록일시
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'editWho',
			headerText: t('lbl.EDITWHO'), // 수정자
			dataType: 'manager',
			managerDataField: 'editWho',
			editable: false,
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showRowNumColumn: true,
		enableFilter: true,

		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		// customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		// customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 운송사유형에 따른 필드 disabled 상태 계산
	 * @param {string} fieldType 필드 타입 ('readonly', 'normal', 'manager')
	 * @returns {boolean} disabled 상태
	 */
	const getCarrierTypeDisabled = (fieldType: 'normal' | 'manager' | 'readonly' | 'disableCoreInfo') => {
		return fieldDisabled[fieldType];
	};

	/**
	 * 그리드 이벤트 설정
	 */
	let prevRowIndex: any = null;
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (props.data && props.data.length > 0) {
				gridRef?.current.setSelectionByIndex(0);
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			// gridRef.current.addCheckedRowsByValue('carrierKey', event.item.carrierKey);
			// gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});

		/**
		 * 그리드 셀 선택전에 실행
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionConstraint', (event: any) => {
			const { toRowIndex } = event;

			if (detailForm.getFieldValue('rowStatus') === 'U') {
				handleBlockedSelection(toRowIndex);
				return false;
			}
		});

		// selectionConstraint에서 호출될 함수
		const handleBlockedSelection = (rowIndex: any) => {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				gridRef?.current.setSelectionByIndex(rowIndex);
			});
		};

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			const selectedRow = gridRef?.current.getSelectedRows();
			if (!selectedRow || selectedRow.length === 0) {
				setFormDisabled(true);
				return;
			}

			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell?.item?._$uid;

			const selectedData = selectedRow[0];

			// 신규 행인지 확인 (rowStatus가 'I'이거나 serialKey가 없는 경우)
			const isNewRow = selectedData?.rowStatus === 'I' || !selectedData?.serialKey;

			if (isNewRow) {
				// 신규 행은 form 활성화하고 초기값 설정
				setFormDisabled(false);
				detailForm.resetFields();
				detailForm.setFieldsValue({
					rowStatus: 'I',
					carrierType: '',
					status: detailForm.getFieldValue('status') || '00', // 현재 선택된 값 또는 기본값
					delYn: 'N',
				});
				setPartnerSearchValue(''); // 신규 행은 값 초기화
				return;
			}

			// 기존 저장된 데이터이므로 상세 활성화
			setFormDisabled(false);

			// 검색 조건에서 파라미터들 가져오기
			const searchParams = props.form.getFieldsValue();

			const params = {
				storerKey: selectedData.storerKey,
				carrierKey: selectedData.carrierKey,
				carrierType: selectedData.carrierType,
				carrierName: searchParams.carrierName,
				// carrierCode: searchParams.carrierCode, // CmCarrierSearch에서 설정되는 값
				statusCode: searchParams.statusCode,
			};

			detailForm.resetFields();

			apiGetMaster(params)
				.then(res => {
					const dataFromDB = {
						...res.data,
						addDate: res.data.addDate ? dayjs(res.data.addDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') : '',
						editDate: res.data.editDate ? dayjs(res.data.editDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss') : '',
						rowStatus: 'R',
						carrierName: res.data.carrierKey,
					};

					detailForm.setFieldsValue(dataFromDB);

					// CmPartnerSearch value 업데이트
					const carrierKey = dataFromDB.carrierKey;
					// setPartnerSearchValue(carrierKey && description ? `[${carrierKey}]${description}` : '');
					setPartnerSearchValue(carrierKey ? `${carrierKey}` : '');

					/**
					 * 0926 변경사항
					 * 목록에서 선택한 기존행의 carrierKey가 "SUBC"로 시작하면
					 * 운송사유형, 사업주명, 운송사코드, 운송사명, 등록자, 등록일시, 수정자, 수정일시를 제외하고
					 * 나머지 인풋 활성화
					 */
					const isSubcCarrier = carrierKey && carrierKey.startsWith('SUBC');
					if (isSubcCarrier) {
						// SUBC로 시작하는 경우: 4개 필드 제외하고 나머지 활성화
						setFieldDisabled({
							normal: false,
							manager: false,
							readonly: true,
							disableCoreInfo: true, // 기존행이므로 핵심 필드들 비활성화
						});
					} else {
						// 일반 경우: 관리사원 필드만 수정 가능
						setFieldDisabled({
							normal: true,
							manager: false,
							readonly: true,
							disableCoreInfo: true, // 기존행이므로 핵심 필드들 비활성화
						});
					}
				})
				.catch(() => {
					setFormDisabled(true);
					showMessage({
						content: t('msg.MSG_COM_ERR_001'),
						modalType: 'error',
					});
				});
		});
	};

	/**
	 * 상세저장
	 * @returns {void}
	 */
	const saveCarrierDetail = async () => {
		// 변경 여부 검증 (폼 검증보다 먼저 체크)
		const rowStatus = detailForm.getFieldValue('rowStatus');
		if (rowStatus !== 'I' && rowStatus !== 'U') {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 입력 값 검증
		const isValid = await validateForm(detailForm);
		if (!isValid) {
			return;
		}

		// 신규, 수정 모두 중복 검증
		if (rowStatus === 'I' || rowStatus !== 'U') {
			const currentFormData = detailForm.getFieldsValue(true);
			const currentCarrierKey = currentFormData.carrierKey;
			const currentCarrierType = currentFormData.carrierType;

			// 그리드 데이터 조회
			const gridData = gridRef.current.getGridData();

			// 그리드에 데이터가 있는 경우에만 중복 검증
			if (gridData && gridData.length > 0) {
				const isDuplicate = gridData.some(
					(row: any) => row.carrierKey === currentCarrierKey && row.carrierType === currentCarrierType,
				);

				if (isDuplicate) {
					showAlert(null, '동일한 운송사 코드와 유형 항목이 이미 존재합니다.');
					return;
				}
			}
		}

		const params = detailForm.getFieldsValue(true);

		// carrierName에 있는 코드값을 carrierKey로 복사
		if (params.carrierName && !params.carrierKey) {
			params.carrierKey = params.carrierName;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const saveData = { ...params, storerKey };

			// 신규/수정에 따라 다른 API 호출
			const apiCall =
				rowStatus === 'I'
					? apiPostSaveMasterList(saveData) // 신규 - MasterList API 사용
					: apiPostSaveMaster(saveData); // 수정 - Master API 사용

			apiCall
				.then(res => {
					if (res.statusCode === 0) {
						detailForm.setFieldValue('rowStatus', 'R');

						// 신규 저장인 경우 그리드에 행 추가, 수정인 경우 기존 행 업데이트
						if (rowStatus === 'I') {
							// 신규 저장 후 그리드에 추가할 데이터 준비
							const newRowData = { ...saveData, ...params };
							gridRef.current.addRow(newRowData);
							const totalRowCount = gridRef.current.getRowCount();
							gridRef.current.setSelectionByIndex(totalRowCount - 1);
						} else {
							// 기존 행 업데이트
							gridRef.current.setSelectedRowValue({ ...params });
						}

						// AUIGrid 변경이력 Cache 삭제
						gridRef.current.resetUpdatedItems();

						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn?.(); // 콜백 함수 호출
							},
						});
					}
				})
				.catch(error => {
					// catch 블록에서는 별도 처리 없이 로그만 남김 (중복 알럿 방지)
				});
		});
	};

	/**
	 * 신규 행 추가 함수
	 */
	const addNewRow = () => {
		// 변경사항이 있는지 확인
		if (detailForm.getFieldValue('rowStatus') === 'U' || gridRef.current.getChangedData().length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				addNewRowExecution();
			});
		} else {
			addNewRowExecution();
		}
	};

	/**
	 * 신규 행 추가 실행
	 */
	const addNewRowExecution = () => {
		// Form을 신규 상태로 설정 (그리드에는 행 추가하지 않음)
		setFormDisabled(false);
		detailForm.resetFields();
		detailForm.setFieldsValue({
			rowStatus: 'I',
			carrierType: '',
			status: detailForm.getFieldValue('status') || '00', // 현재 선택된 값 또는 기본값
			delYn: 'N',
		});
		setPartnerSearchValue(''); // 신규 행은 값 초기화
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 */
	const onValuesChange = () => {
		if (detailForm.getFieldValue('rowStatus') !== 'I') {
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	/**
	 * 그리드 저장 함수
	 */
	const saveGridList = async () => {
		const changed = gridRef.current.getChangedData({ validationYn: false });
		if (!changed || changed.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 필수값 검증
		if (!gridRef.current.validateRequiredGridData()) return;

		// 표준화된 저장 확인 메시지 (신규/수정/삭제 건수 표시)
		gridRef.current.showConfirmSave(() => {
			// 변경된 데이터를 배열로 처리 (기존 API 구조에 맞게)
			const savePromises = changed.map((row: any) => {
				const saveData = { ...row, storerKey };
				return apiPostSaveMasterList(saveData);
			});

			Promise.all(savePromises)
				.then(results => {
					// 모든 결과가 성공(statusCode === 0)인지 확인
					const hasError = results.some(res => res.statusCode !== 0);
					if (!hasError) {
						// 모든 저장이 성공한 경우
						// AUIGrid 변경이력 Cache 삭제
						gridRef.current.resetUpdatedItems();

						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn?.(); // 콜백 함수 호출 (조회 재실행)
							},
						});
					} else {
						// 오류가 있는 경우 첫 번째 오류 메시지 표시
						const errorResult = results.find(res => res.statusCode !== 0);
						showMessage({
							content: errorResult?.statusMessage || '저장 중 오류가 발생했습니다.',
							modalType: 'error',
						});
					}
				})
				.catch(error => {
					// catch 블록에서는 별도 처리 없이 로그만 남김 (중복 알럿 방지)
				});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'save',
				callBackFn: saveGridList,
			},
		],
	};

	// 표 버튼 설정 (상세 저장만)
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'pre',
				isActionEvent: false,
				callBackFn: () => {
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							gridRef.current.setPrevRowSelected();
						});
					} else {
						gridRef.current.setPrevRowSelected();
					}
				},
			},
			{
				btnType: 'post',
				isActionEvent: false,
				callBackFn: () => {
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							gridRef.current.setNextRowSelected();
						});
					} else {
						gridRef.current.setNextRowSelected();
					}
				},
			},
			{
				btnType: 'new',
				callBackFn: addNewRow,
			},
			{
				btnType: 'save',
				btnLabel: '저장',
				callBackFn: saveCarrierDetail,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// 협력사 코드 감시
	const carrierKey = Form.useWatch('carrierKey', detailForm);

	// 운송사유형 감시
	const carrierType = Form.useWatch('carrierType', detailForm);

	// rowStatus 감시
	const rowStatus = Form.useWatch('rowStatus', detailForm);
	/**
	 * 협력사 코드 변경 감지 및 상세 정보 조회
	 */
	useEffect(() => {
		if (carrierKey && carrierKey.trim()) {
			// 협력사 API를 통해 상세 정보 조회
			apiGetPartner({ custKey: carrierKey }).then(res => {
				if (res.data) {
					const detailPartnerData = res.data;

					// 상세 영역에 협력사 정보 맵핑
					const newCarrierKey = detailPartnerData.custKey || carrierKey;
					const newDescription = detailPartnerData.description || '';

					detailForm.setFieldsValue({
						carrierName: newCarrierKey,
						carrierKey: newCarrierKey,
						description: newDescription,
						owner: detailPartnerData.owner || detailPartnerData.description || '',
						address1: detailPartnerData.address1 || '',
						address2: detailPartnerData.address2 || '',
						phone1: detailPartnerData.phone1 || '',
						phone2: detailPartnerData.phone2 || '',
						fax: detailPartnerData.fax || '',
						zipcode: detailPartnerData.zipcode || '',
						vatno: detailPartnerData.vatNo || '',
						vatowner: detailPartnerData.vatOwner || '',
						vattype: detailPartnerData.vatType || '',
						vatcategory: detailPartnerData.vatCategory || '',
						vataddress1: detailPartnerData.vatAddress1 || '',
						vataddress2: detailPartnerData.vatAddress2 || '',
					});

					// CmPartnerSearch value 업데이트
					setPartnerSearchValue(newCarrierKey ? `${newCarrierKey}` : '');
				}
			});
		}
	}, [carrierKey]);

	/**
	 * 운송사유형 변경 감지 및 필드 제어
	 */
	useEffect(() => {
		// 신규 입력 상태가 아니면 실행하지 않음
		if (detailForm.getFieldValue('rowStatus') !== 'I') return;

		if (carrierType) {
			// 이전 값과 다른 경우에만 폼 초기화 (운송사유형 오락가락 시)
			const currentValues = detailForm.getFieldsValue();
			const hasOtherData =
				currentValues.carrierKey || currentValues.description || currentValues.owner || currentValues.phone1;

			// 기존 데이터가 있는 상태에서 운송사유형을 변경하면 폼 clear
			if (hasOtherData) {
				// 운송사유형을 제외한 모든 필드 초기화
				detailForm.setFieldsValue({
					carrierName: '',
					carrierKey: '',
					description: '',
					owner: '',
					address1: '',
					address2: '',
					phone1: '',
					phone2: '',
					fax: '',
					zipcode: '',
					vatno: '',
					vatowner: '',
					vattype: '',
					vatcategory: '',
					vataddress1: '',
					vataddress2: '',
					empname1: '',
					empphone1: '',
					empname2: '',
					empphone2: '',
					status: '00',
					delYn: 'N',
				});
				setPartnerSearchValue('');
			}
		}
	}, [carrierType]);

	/**
	 * 운송사유형이나 rowStatus 변경 시 필드 disabled 상태 업데이트
	 */
	useEffect(() => {
		// 관리 사원 관련 필드는 항상 활성화
		const managerDisabled = false;

		// readonly 필드는 항상 비활성화
		const readonlyDisabled = true;

		// 신규 입력이 아니면 모든 필드 비활성화
		if (rowStatus !== 'I') {
			setFieldDisabled({
				normal: true,
				manager: managerDisabled,
				readonly: readonlyDisabled,
				disableCoreInfo: false,
			});
			return;
		}

		// 2차 운송사(subc) 선택 시: readonly 필드 제외하고 모든 필드 활성화
		if (carrierType === 'SUBC') {
			setFieldDisabled({
				normal: false,
				manager: managerDisabled,
				readonly: readonlyDisabled,
				disableCoreInfo: false,
			});
			return;
		}

		// 운송사(local) 선택 시: 협력사코드만 활성화
		if (carrierType === 'LOCAL') {
			setFieldDisabled({
				normal: true,
				manager: managerDisabled,
				readonly: readonlyDisabled,
				disableCoreInfo: false,
			});
			return;
		}

		// 운송사유형이 선택되지 않은 경우: 비활성화
		setFieldDisabled({
			normal: true,
			manager: managerDisabled,
			readonly: readonlyDisabled,
			disableCoreInfo: false,
		});
	}, [carrierType]); // rowStatus 의존성 제거 - carrierType 변경 시에만 실행

	/**
	 * rowStatus 변경 시 필드 제어 (그리드 행 선택 시에만)
	 */
	useEffect(() => {
		// 관리 사원 관련 필드는 항상 활성화
		const managerDisabled = false;
		// readonly 필드는 항상 비활성화
		const readonlyDisabled = true;

		// 신규 입력이 아닌 경우에만 필드 비활성화 (읽기 전용 상태)
		if (rowStatus === 'R') {
			setFieldDisabled({
				normal: true,
				manager: managerDisabled,
				readonly: readonlyDisabled,
				disableCoreInfo: false,
			});
		}
	}, [rowStatus]);

	/**
	 * CmPartnerSearch에서 협력사 선택 후 필드 비활성화
	 */
	useEffect(() => {
		// 신규 입력 상태이고 협력사가 선택된 경우
		if (detailForm.getFieldValue('rowStatus') === 'I' && carrierKey && carrierKey.trim()) {
			// 협력사 선택 후에는 필드를 다시 비활성화 (엣지케이스 처리)
			// 단, 운송사유형은 계속 활성화 상태 유지
		}
	}, [carrierKey]);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur && props.data) {
			gridRefCur.setGridData(props.data);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);

				// 첫 번째 행 자동 선택 (selectionChange에서 상세조회 처리)
				gridRefCur.setSelectionByIndex(0);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<>
					<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</GridAutoHeight>
				</>,
				<>
					<AGrid style={{ padding: '10px 0', marginBottom: 0, height: 'auto', flex: 'none' }}>
						<TableTopBtn tableTitle={t('lbl.DETAIL_TAB')} tableBtn={tableBtn}>
							<span className="msg" style={{ whiteSpace: 'break-spaces' }}>
								※ 2차 운송사 거래처등록이 안되어있는 신규입력 시 동일 회사가 있는지 조회하시기 바랍니다.
							</span>
						</TableTopBtn>
					</AGrid>
					<Form form={detailForm} onValuesChange={onValuesChange}>
						<ScrollBox>
							<div>
								<UiDetailViewArea>
									<UiDetailViewGroup className="grid-column-2">
										<Form.Item name="rowStatus" hidden>
											<Input />
										</Form.Item>
										<li>
											{/* 운송사유형 */}
											<SelectBox
												label={t('lbl.CARRIERTYPE')}
												name="carrierType"
												options={getCommonCodeList('CARRIERTYPE', '--- 선택---', '')}
												fieldNames={{ label: 'cdNm', value: 'comCd' }}
												placeholder="운송사유형 선택"
												required={true}
												disabled={
													getCarrierTypeDisabled('disableCoreInfo') || detailForm.getFieldValue('rowStatus') !== 'I'
												}
												rules={[
													{
														required: true,
														message: t('msg.MSG_COM_VAL_054', [t('lbl.CARRIERTYPE')]),
													},
												]}
											/>
										</li>
										<li>
											{/* 사업주명 */}
											<InputText
												label={t('lbl.OWNER_P')}
												name="owner"
												disabled={getCarrierTypeDisabled('disableCoreInfo') || getCarrierTypeDisabled('normal')}
											/>
										</li>
										<li>
											{/* 협력사코드 */}
											<CmPartnerSearch
												form={detailForm}
												// selectionMode="singleRow"
												selectionMode="multipleCells"
												name="carrierName"
												code="carrierKey"
												returnValueFormat="code"
												label={t('lbl.CARRIERCODE')}
												// 20250923 변경사항: 신규행 추가 상태에서 운송사 유형을 2차 운송사(SUBC) 선택 시 활성화 상태로 변경
												// 20250926 변경사항: 기존행 읽기 상태에서 운송사 유형이 SUBC*일 경우 운송사유형,사업주명,운송사코드,운송사명(해당 4개 항목을 coreInfo로 지정), 등록자, 등록일시, 수정자, 수정일시를 제외하고 disabled를 해제함
												disabled={getCarrierTypeDisabled('disableCoreInfo') || !detailForm.getFieldValue('carrierType')}
												// value={partnerSearchValue}
												onConfirm={() => {
													// 협력사 팝업에서 선택 시 관리 사원 필드 제외하고 나머지 비활성화
													setFieldDisabled({
														normal: true,
														manager: false,
														readonly: true,
														disableCoreInfo: true,
													});
												}}
											/>
										</li>
										<li>
											{/* 운송사명 */}
											<InputText
												label={t('lbl.CARRIERNAME')}
												name="description"
												// placeholder="운송사명 입력"
												disabled={getCarrierTypeDisabled('disableCoreInfo') || getCarrierTypeDisabled('normal')}
												required={true}
												rules={[
													{
														required: true,
														message: t('msg.MSG_COM_VAL_054', [t('lbl.CARRIERNAME')]),
													},
												]}
											/>
										</li>
										<li>
											{/* 전화번호1 */}
											<InputText
												label={t('lbl.PHONE1')}
												name="phone1"
												disabled={getCarrierTypeDisabled('normal')}
												rules={
													fieldDisabled.disableCoreInfo
														? null
														: [
																{
																	pattern: PHONE_PATTERN_WITHOUT_HYPHEN,
																	message: '올바른 전화번호 형식이 아닙니다.',
																},
														  ]
												}
											/>
										</li>
										<li>
											{/* 전화번호2 */}
											<InputText
												label={t('lbl.PHONE2')}
												name="phone2"
												disabled={getCarrierTypeDisabled('normal')}
												rules={[
													{
														pattern: PHONE_PATTERN,
														message: '올바른 전화번호 형식이 아닙니다.',
													},
												]}
											/>
										</li>
										<li>
											{/* 우편번호 */}
											<InputText
												label={t('lbl.ZIP_NO')}
												name="zipcode"
												disabled={getCarrierTypeDisabled('normal')}
												// required={true}
												maxLength={5}
												rules={[
													// {
													// 	required: true,
													// 	message: t('msg.MSG_COM_VAL_054', [t('lbl.ZIPCODE')]),
													// },
													{
														pattern: /^\d{1,5}$/,
														message: '우편번호는 숫자 5자리까지만 입력 가능합니다.',
													},
												]}
											/>
										</li>
										<li>
											{/* 팩스번호 */}
											<InputText
												label={t('lbl.FAX')}
												name="fax"
												disabled={getCarrierTypeDisabled('normal')}
												rules={[
													{
														pattern: PHONE_PATTERN,
														message: '올바른 전화번호 형식이 아닙니다.',
													},
												]}
											/>
										</li>
										<li>
											{/* 기본주소 */}
											<InputText
												label={t('lbl.ADDRESS1')}
												name="address1"
												disabled={getCarrierTypeDisabled('normal')}
												// required={true}
												// rules={[
												// 	{
												// 		required: true,
												// 		message: t('msg.MSG_COM_VAL_054', [t('lbl.ADDRESS1')]),
												// 	},
												// ]}
											/>
										</li>
										<li>
											{/* 상세주소 */}
											<InputText
												label={t('lbl.ADDRESS2')}
												name="address2"
												disabled={getCarrierTypeDisabled('normal')}
											/>
										</li>
										<li>
											{/* 사업자 등록 번호 */}
											<InputText label={t('lbl.VATNO_1')} name="vatno" disabled={getCarrierTypeDisabled('normal')} />
										</li>
										<li>
											{/* 사업자 등록 사업주명 */}
											<InputText
												label={t('lbl.VATOWNER')}
												name="vatowner"
												disabled={getCarrierTypeDisabled('normal')}
											/>
										</li>
										<li>
											{/* 사업자 등록 업태 */}
											<InputText label={t('lbl.VATTYPE')} name="vattype" disabled={getCarrierTypeDisabled('normal')} />
										</li>
										<li>
											{/* 사업자 등록 종목 */}
											<InputText
												label={t('lbl.VATCATEGORY')}
												name="vatcategory"
												disabled={getCarrierTypeDisabled('normal')}
											/>
										</li>
										<li>
											{/* 사업자 등록 기본주소 */}
											<InputText
												label={t('lbl.VATADDRESS1')}
												name="vataddress1"
												disabled={getCarrierTypeDisabled('normal')}
											/>
										</li>
										<li>
											{/* 사업자 등록 상세주소 */}
											<InputText
												label={t('lbl.VATADDRESS2')}
												name="vataddress2"
												placeholder="사업자 등록 상세주소 입력"
												disabled={getCarrierTypeDisabled('normal')}
											/>
										</li>
										<li>
											{/* 관리 사원명1 */}
											<InputText
												label={t('lbl.EMPNAME1')}
												name="empname1"
												placeholder="관리 사원명1 입력"
												disabled={getCarrierTypeDisabled('manager')}
											/>
										</li>
										<li>
											{/* 관리 사원 전화번호1 */}
											<InputText
												label={t('lbl.EMPPHONE1')}
												name="empphone1"
												placeholder="관리 사원 전화번호1 입력"
												disabled={getCarrierTypeDisabled('manager')}
												rules={[
													{
														pattern: PHONE_PATTERN,
														message: '올바른 전화번호 형식이 아닙니다.',
													},
												]}
												onBlur={(e: any) => {
													const formatted = dataRegex.formatPhone(e.target.value);
													detailForm.setFieldsValue({ empphone1: formatted });
												}}
											/>
										</li>
										<li>
											{/* 관리 사원명2 */}
											<InputText
												label={t('lbl.EMPNAME2')}
												name="empname2"
												placeholder="관리 사원명2 입력"
												disabled={getCarrierTypeDisabled('manager')}
											/>
										</li>
										<li>
											{/* 관리 사원 전화번호2 */}
											<InputText
												label={t('lbl.EMPPHONE2')}
												name="empphone2"
												placeholder="관리 사원 전화번호2 입력"
												disabled={getCarrierTypeDisabled('manager')}
												// rules={[{ pattern: /^01[016789]\d{7,8}$/, message: '올바른 휴대폰 번호 형식이 아닙니다.' }]}
												rules={[
													{
														/**
														 * 기존: 010, 011, 016, 017, 018, 019
														 * 추가: 02, 031, 032, 033, 041, 042, 051, 052, 053, 054, 055, 061, 062, 063, 064, 070
														 * 비고1: 하이픈 포험, 미포함 커버 (기존방식에서 변경)
														 * 비고2: 3자리-4자리, 4자리-3자리 커버
														 * 비고3: 하이픈 없이 입력시 자동으로 하이픈 붙여주는 기능O (공통 개발 사항)
														 */
														pattern: PHONE_PATTERN,
														message: '올바른 전화번호 형식이 아닙니다.',
													},
												]}
												onBlur={(e: any) => {
													const formatted = dataRegex.formatPhone(e.target.value);
													detailForm.setFieldsValue({ empphone2: formatted });
												}}
											/>
										</li>
										{/* 진행상태 */}
										{/* <li>
									<SelectBox
										label={t('lbl.STATUS')}
										name="status"
										options={getCommonCodeList('STATUS_CODE')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										placeholder="진행상태 선택"
										disabled={getCarrierTypeDisabled('normal')}
									/>
								</li> */}
										<li>
											{/* 
									영문약어
									- 규칙
										1. 영문 약어는 3글자까지
										2. 기존 행 수정불가, 신규 행에서만 입력 가능
										3. 영문 약어는 대문자만 입력가능 (입력할 때 대문자로 자동 변환)
										4. 운송사 유형이 1차 운송사일경우 disabled처리
								*/}

											<InputText
												label={t('lbl.ENG_ABBR')}
												name="memo"
												required={true}
												disabled={rowStatus !== 'I' || carrierType !== 'SUBC'}
												rules={
													rowStatus === 'I' && carrierType === 'SUBC'
														? [
																{
																	pattern: /^([A-Z]{3})$/,
																	message: '영문 약어는 영문 대문자 세 글자여야 합니다.',
																},
														  ]
														: null
												}
											/>
										</li>
										<li>
											{/* 삭제여부 */}
											<SelectBox
												label={t('lbl.DEL_YN')}
												name="delYn"
												options={getCommonCodeList('DEL_YN')}
												fieldNames={{ label: 'cdNm', value: 'comCd' }}
												placeholder="삭제여부 선택"
												disabled={getCarrierTypeDisabled('normal')}
											/>
										</li>
										<li>
											{/* 등록일자 */}
											<InputText
												label={t('lbl.ADDDATE')}
												name="addDate"
												disabled={getCarrierTypeDisabled('readonly')}
											/>
										</li>
										<li>
											{/* 생성인 */}
											<InputText label={t('lbl.ADDWHO')} name="addWho" disabled={getCarrierTypeDisabled('readonly')} />
										</li>
										<li>
											{/* 최종변경시간 */}
											<InputText
												label={t('lbl.EDITDATE')}
												name="editDate"
												disabled={getCarrierTypeDisabled('readonly')}
											/>
										</li>
										<li>
											{/* 최종변경자 */}
											<InputText
												label={t('lbl.EDITWHO')}
												name="editWho"
												disabled={getCarrierTypeDisabled('readonly')}
											/>
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</div>
						</ScrollBox>
					</Form>
				</>,
			]}
		/>
	);
});

export default MsCarrierDetail;
