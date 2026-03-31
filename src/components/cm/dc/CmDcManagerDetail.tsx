// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { InputNumber, InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Col, Form, Input } from 'antd';
import dayjs from 'dayjs';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import CmMapPopup from '@/components/cm/popup/CmMapPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// API Call Function
import { apiGetMaster, apiPostSaveMaster } from '@/api/cm/apiCmDcManager';

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { fetchUserAuthInfo } from '@/store/core/userStore';
import styled from 'styled-components';

const CmDcManagerDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 컴포넌트 접근을 위한 Ref
	const detailForm = props.detailForm;
	const refModal = useRef(null); // CustomModal 제어용 ref

	const [formDisabled, setFormDisabled] = useState(true);
	const [searchAddr, setSearchAddr] = useState('');
	const [searchLatLng, setSearchLatLng] = useState([0, 0]);
	const [addressInfo, setAddressInfo] = useState('');
	const [latLng, setLatLng] = useState(['0', '0']);
	const [radius, setRadius] = useState('');
	const [stytime, setStytime] = useState('');

	const openModal = () => {
		refModal.current?.handlerOpen();
	};

	// 그리드 초기화
	const gridCol = [
		// {
		// 	dataField: 'serialKey',
		// 	headerText: t('lbl.SERIALKEY'),
		// 	dataType: 'string',
		// },
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'string',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'arrOrd',
			headerText: '정렬순서',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				// validator: (oldValue: any, newValue: any) => {
				// 	const data = gridRef?.current.getGridData();
				// 	//정렬순서가 중복되는지 확인
				// 	const isDuplicate = data.some((item: any) => item.arrOrd === Number(newValue));
				// 	return { validate: !isDuplicate };
				// },
			},
			editable: false,
		},
		{
			dataField: 'displayYn',
			headerText: '노출여부',
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN', value)?.cdNm;
			},
		},
		// {
		// 	dataField: 'dcType',
		// 	headerText: t('lbl.DCTYPE'),
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('DCTYPE', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// 	editable: false,
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return getCommonCodebyCd('DCTYPE', value)?.cdNm;
		// 	},
		// },
		// {
		// 	dataField: 'vatNo',
		// 	headerText: '사업자 등록번호',
		// 	dataType: 'string',
		// 	editable: false,
		// },
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STATUS_CODE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STATUS_CODE', value)?.cdNm;
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('DEL_YN', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DEL_YN', value)?.cdNm;
			},
		},
		// {
		// 	dataField: 'smsYn',
		// 	headerText: t('lbl.SMS_YN'),
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: getCommonCodeList('YN', ''),
		// 		keyField: 'comCd', // key 에 해당되는 필드명
		// 		valueField: 'cdNm',
		// 	},
		// 	editable: false,
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return getCommonCodebyCd('YN', value)?.cdNm;
		// 	},
		// },
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		enableDrag: true,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDragByCellDrag: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellDoubleClick', (event: any) => {
			// 선택된 셀(행)의 상세 정보를 조회한다.
			//searchDtl(event.item);
		});

		/**
		 * 그리드 셀 선택전에 실행
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionConstraint', (event: any) => {
			const { toRowIndex } = event;

			if (detailForm.getFieldValue('rowStatus') === 'U') {
				// selectionConstraint에서는 즉시 false를 반환하여 선택을 일단 막음
				// 그 후 별도의 함수에서 confirm을 띄우고 수동으로 선택 처리
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
			const params = selectedRow[0];

			// serialKey 같으면 상세조회 하지 않음
			if (selectedRow[0].serialKey === detailForm.getFieldValue('serialKey')) {
				return false;
			}

			if (event.primeCell.columnIndex > 1) {
				return false;
			}

			apiGetMaster(params).then(res => {
				detailForm.resetFields();

				const dataFromDB = {
					...res.data,
					dcCode: res.data.dcCode,
					samedayTime: res.data.procSamedayArrivedtime
						? [dayjs(res.data.procSamedayIntime, 'HH:mm'), dayjs(res.data.procSamedayArrivedtime, 'HH:mm')]
						: [],
					storageTime: res.data.procStorageArrivedtime
						? [dayjs(res.data.procStorageIntime, 'HH:mm'), dayjs(res.data.procStorageArrivedtime, 'HH:mm')]
						: [],
					stytime: res.data.stytime ? dayjs(padTime(res.data.stytime), 'HHmm') : '',
				};
				setLatLng([res.data.latitude?.toString() || '', res.data.longitude?.toString() || '']);
				setRadius(res.data.radius);
				setStytime(res.data.stytime);
				setFormDisabled(false);
				detailForm.setFieldsValue(dataFromDB);
			});
		});

		const moveElement = (array: any[], oldIndex: number, newIndex: number) => {
			// 인덱스 범위를 벗어나는 경우를 방지
			if (newIndex >= array.length) {
				let k = newIndex - array.length + 1;
				while (k--) {
					array.push(undefined);
				}
			}

			// oldIndex에서 요소를 제거하고, newIndex에 추가합니다.
			array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
			return array;
		};

		/**
		 * 그리드 드랍종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('dropEnd', (event: any) => {
			const gridData = gridRef.current.getGridData();
			const newGridData = moveElement(gridData, event.fromRowIndex, event.toRowIndex);

			newGridData.forEach((element, index) => {
				const targetIndex = gridData.findIndex((item: any) => item.dcCode === element.dcCode);
				if (targetIndex > -1) {
					if (gridRef.current.getCellValue(targetIndex, 'arrOrd') === index + 1) {
						return;
					}
					gridRef.current.setCellValue(targetIndex, 'arrOrd', index + 1);
				}
			});
		});
	};

	// const initDetailForm = () => {
	// 	detailForm.resetFields();
	// 	detailForm.setFieldsValue({ rowStatus: 'I' });
	// 	setFormDisabled(false); // 신규일 때 입력 가능하게 변경
	// };

	/**
	 * 상세저장
	 * @returns {void}
	 */
	const saveMaster = async () => {
		// 입력 값 검증
		const isValid = await validateForm(detailForm);
		if (!isValid) {
			return;
		}

		// 변경 여부 검증
		if (detailForm.getFieldValue('rowStatus') === 'R') {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		const params = {
			...detailForm.getFieldsValue(true),
			procSamedayIntime:
				detailForm.getFieldValue('samedayTime') !== undefined && detailForm.getFieldValue('samedayTime').length === 2
					? detailForm.getFieldValue('samedayTime')[0].format('HH:mm')
					: '',
			procSamedayArrivedtime:
				detailForm.getFieldValue('samedayTime') !== undefined && detailForm.getFieldValue('samedayTime').length === 2
					? detailForm.getFieldValue('samedayTime')[1].format('HH:mm')
					: '',
			procStorageIntime:
				detailForm.getFieldValue('storageTime') !== undefined && detailForm.getFieldValue('storageTime').length === 2
					? detailForm.getFieldValue('storageTime')[0].format('HH:mm')
					: '',
			procStorageArrivedtime:
				detailForm.getFieldValue('storageTime') !== undefined && detailForm.getFieldValue('storageTime').length === 2
					? detailForm.getFieldValue('storageTime')[1].format('HH:mm')
					: '',
			stytime:
				detailForm.getFieldValue('stytime') === '' || detailForm.getFieldValue('stytime') === null
					? ''
					: detailForm.getFieldValue('stytime').format('HHmm'),
		};

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveMaster([params])
				.then(() => {
					detailForm.setFieldValue('rowStatus', 'R');
					gridRef.current.setSelectedRowValue({ ...params });
					// AUIGrid 변경이력 Cache 삭제
					gridRef.current.resetUpdatedItems();

					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				})
				.finally(() => {
					fetchUserAuthInfo();
				});
		});
	};

	// 중복 체크 함수
	const hasDuplicates = (arr: any, key: any) => {
		const uniqueValues = new Set();
		for (const obj of arr) {
			if (obj[key] === undefined || obj[key] === null) {
				continue;
			}
			if (uniqueValues.has(obj[key])) {
				return true;
			}
			uniqueValues.add(obj[key]);
		}
		return false;
	};

	// 시간정보정제
	const padTime = (timeStr: string) => {
		// 1. 콜론(':')을 제거 (예: '10:00' -> '1000', '9:30' -> '930')
		const cleanStr = String(timeStr).replace(/:/g, '');

		// 2. 4자리로 만들고 앞을 '0'으로 채움 (예: '930' -> '0930')
		return cleanStr.padStart(4, '0');
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 정렬순서가 중복입력 되었는지 확인
		const data = gridRef?.current.getGridData();
		if (hasDuplicates(data, 'arrOrd')) {
			showMessage({
				content: '중복된 정렬순서가 있습니다.',
				modalType: 'info',
			});
			return;
		}

		if (!gridRef.current.validateRequiredGridData()) return;

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMaster(updatedItems).then(res => {
				// 전체 체크 해제
				gridRef.current.setAllCheckedRows(false);
				// AUIGrid 변경이력 Cache 삭제
				gridRef.current.resetUpdatedItems();
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn?.(); // 콜백 함수 호출
						},
					});
				}
			});
		});
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		if (detailForm.getFieldValue('rowStatus') !== 'I') {
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'pre', // 이전
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					// Form 변경 감지 체크
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							// 그리드 이전 Row 선택 Function
							gridRef.current.setPrevRowSelected();
						});
					} else {
						gridRef.current.setPrevRowSelected();
					}
				},
			},
			{
				btnType: 'post', // 다음
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					// Form 변경 감지 체크
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							// 다음 Row 선택 Function
							gridRef.current.setNextRowSelected();
						});
					} else {
						gridRef.current.setNextRowSelected();
					}
				},
			},
			// {
			// 	btnType: 'new', // 신규
			// 	callBackFn: initDetailForm,
			// },
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};

	const popupCloseEvent = () => {
		return;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		if (searchLatLng[0] === 0) {
			return;
		}
		detailForm.setFieldsValue({ latitude: searchLatLng[0] });
		detailForm.setFieldsValue({ longitude: searchLatLng[1] });
		detailForm.setFieldValue('rowStatus', 'U');
		setLatLng([searchLatLng[0].toString() || '', searchLatLng[1].toString() || '']);
		refModal.current.handlerClose();
	}, [searchLatLng]);

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<CustomForm
						key="CmDcManagerDetail-form"
						form={detailForm}
						onValuesChange={onValuesChange}
						initialValues={{
							rowStatus: 'R',
							smsYn: null,
							delYn: null,
							dcType: null,
							status: null,
							courier: null,
							country: null,
						}}
						disabled={formDisabled}
						className="contain-wrap"
					>
						<AGrid>
							<TableTopBtn tableTitle={'상세정보'} tableBtn={tableBtn} className="fix-title" />
						</AGrid>
						<ScrollBox>
							<div>
								<AGrid>
									<UiDetailViewArea>
										{/* 기본 정보 */}
										<UiDetailViewGroup className="grid-column-2">
											{/* 숨김 필드 */}
											<Form.Item name="serialKey" hidden>
												<Input />
											</Form.Item>
											<li>
												<InputText
													name="dcCode"
													label={t('lbl.DCCODE')}
													// required
													// rules={[{ required: true, validateTrigger: 'none' }]}
													disabled
												/>
											</li>
											{/* 센터 코드 */}
											<li>
												<InputText
													name="dcName"
													label={t('lbl.DCNAME')}
													// required
													// rules={[{ required: true, validateTrigger: 'none' }]}
													disabled
												/>
											</li>
											{/* 센터명 */}
											<li>
												<Rangepicker
													name="samedayTime"
													label={'일배 입고시간'}
													format="HH:mm"
													picker="time"
													placeholder={'시분 선택'}
													showNow={false}
													allowClear
													disabled={formDisabled}
													order={false}
													onChange={onValuesChange}
												/>
											</li>
											{/* 조달-일배(도착시간) */}
											<li>
												<Rangepicker
													name="storageTime"
													label={'저장 입고시간'}
													format="HH:mm"
													picker="time"
													placeholder={'시분 선택'}
													showNow={false}
													allowClear
													disabled={formDisabled}
													order={false}
													onChange={onValuesChange}
												/>
											</li>
											{/* 조달-저장(도착시간) */}
											<li>
												<InputText name="connServer" label={'접속서버'} disabled />
											</li>
											{/* 접속 서버 */}
											<li>
												<InputText name="connDb" label={'접속데이터베이스'} disabled />
											</li>
											{/* 접속 데이터베이스 */}
											<li>
												<InputText name="connType" label={'접속유형'} disabled />
											</li>
											{/* 접속 유형 */}
											<li>
												<SelectBox
													name="smsYn"
													label={t('lbl.SMS_YN')}
													options={getCommonCodeList('YN', '--- 선택 ---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													disabled
												/>
											</li>
											{/* SMS 관리 여부 */}
											<li>
												<SelectBox
													name="dcType"
													label={t('lbl.DCTYPE')}
													options={getCommonCodeList('DCTYPE', '--- 선택 ---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													disabled
												/>
											</li>
											{/* 센터 유형 */}
											<li>
												<InputText name="billToCustKey" label={t('lbl.BILLTOCUSTKEY')} disabled />
											</li>
											{/* 대금 청구 거래처 */}
											<li>
												<InputText name="description" label={t('lbl.DESCRIPTION')} disabled />
											</li>
											{/* 내역 */}
											<li>
												<InputText name="dcGroup" label={t('lbl.DCGROUP')} disabled />
											</li>
											{/* 센터 그룹 */}
											<li>
												<InputNumber name="priority" label={t('lbl.PRIORITY')} min={0} disabled />
											</li>
											{/* 회차 */}
											<li>
												<InputText name="districtType" label={t('lbl.DISTRICTTYPE')} disabled />
											</li>
											{/* 권역 구분 */}
											<li>
												<InputText name="districtCode" label={t('lbl.DISTRICTCODE')} disabled />
											</li>
											{/* 권역 코드 */}
											<li>
												<InputText name="route" label={t('lbl.ROUTE')} disabled />
											</li>
											{/* 경유지 */}
											<li>
												<SelectBox
													name="courier"
													label={t('lbl.COURIER')}
													options={getCommonCodeList('COURIER', '--- 선택 ---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													disabled
												/>
											</li>
											{/* 기본 배송 택배사 */}
											<li>
												<InputText name="invoiceType" label={t('lbl.INVOICETYPE')} disabled />
											</li>
											{/* 납품서 유형 */}
											<li>
												<InputText name="dlvDcCode" label={t('lbl.DLV_DCCODE')} disabled />
											</li>
											{/* 주 출고처 */}
											<li>
												<InputText name="owner" label={t('lbl.OWNER')} disabled />
											</li>
											{/* 사업주명 */}
											<li>
												<InputNumber name="arrOrd" label={'정렬순서'} min={0} disabled />
											</li>
											{/* 정렬순서 */}
											{/* <li>
										<SelectBox
											name="realDcYn"
											label={'실센터여부'}
											options={getCommonCodeList('YN', '--- 선택 ---')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li> */}
											{/* 실센터여부 */}
											<li>
												<SelectBox
													name="displayYn"
													label={'노출여부'}
													options={getCommonCodeList('YN', '--- 선택 ---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
											</li>
											{/* 노출여부 */}
											<li>
												<InputNumber name="rolltainerWeight" label={'롤테이너적재중량(kg)'} min={0} precision={0} />
											</li>
											{/* 롤테이너 적재 중량(kg) */}
											<li>
												<InputNumber name="rolltainerCube" label={'롤테이너적재체적(㎥)'} min={0} precision={0} />
											</li>
											{/* 롤테이너 적재 체적(㎥) */}
										</UiDetailViewGroup>
									</UiDetailViewArea>

									<UiDetailViewArea>
										{/* 주소 및 배송 정보 */}
										<UiDetailViewGroup className="grid-column-2">
											<li>
												<SelectBox
													name="country"
													label={t('lbl.COUNTRY')}
													options={getCommonCodeList('COUNTRY', '--- 선택 ---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													disabled
												/>
											</li>
											{/* 국가 코드 */}
											<li>
												<InputText name="state" label={t('lbl.STATE')} disabled />
											</li>
											{/* 주/도 */}
											<li>
												<InputText name="city" label={t('lbl.CITY')} disabled />
											</li>
											{/* 시/읍/면 */}
											<li>
												<InputText name="zipCode" label={t('lbl.ZIPCODE')} disabled />
											</li>
											{/* 우편번호 */}
											<li style={{ gridColumn: '1 / span 2' }}>
												<InputText name="address1" label={t('lbl.ADDRESS1')} disabled />
											</li>
											{/* 기본 주소 */}
											<li>
												<InputText
													name="address2"
													label={t('lbl.ADDRESS2')}
													onChange={(e: any) => setSearchAddr(e.target.value)}
													disabled
												/>
											</li>
											{/* 상세 주소 */}
											<li className="range-align">
												<Col span={18} className="pd0">
													<InputNumber name="latitude" label={t('위경도')} readOnly />
												</Col>
												<span>,</span>
												<Col span={6} className="pd0">
													<InputNumber name="longitude" readOnly />
												</Col>
												<span>
													<Button name="map" onClick={openModal}>
														지도
													</Button>
												</span>
											</li>
											{/* 위경도 */}
											<li>
												<InputNumber label={'반경'} name="radius" />
											</li>
											<li>
												<DatePicker
													label="체류시간"
													name="stytime"
													format="HH:mm"
													picker="time"
													placeholder={'시분 선택'}
													showNow={false}
													allowClear
													// required
												/>
											</li>
											<li>
												<InputText name="phone1" label={t('lbl.PHONE1')} disabled />
											</li>
											{/* 전화번호1 */}
											<li>
												<InputText name="phone2" label={t('lbl.PHONE2')} disabled />
											</li>
											{/* 전화번호2 */}
											<li>
												<InputText name="fax" label={t('lbl.FAX')} disabled />
											</li>
											{/* 팩스번호 */}
										</UiDetailViewGroup>
									</UiDetailViewArea>

									<UiDetailViewArea>
										{/* 사업자 정보 */}
										<UiDetailViewGroup className="grid-column-2">
											<li>
												<InputText name="vatNo" label={'사업자 등록번호'} disabled />
											</li>
											{/* 사업자 등록 번호 */}
											<li>
												<InputText name="vatOwner" label={t('lbl.VATOWNER')} disabled />
											</li>
											{/* 사업자 등록 사업주명 */}
											<li>
												<InputText name="vatType" label={t('lbl.VATTYPE')} disabled />
											</li>
											{/* 사업자 등록 업태 */}
											<li>
												<InputText name="vatCategory" label={t('lbl.VATCATEGORY')} disabled />
											</li>
											{/* 사업자 등록 종목 */}
											<li style={{ gridColumn: '1 / span 2' }}>
												<InputText name="vatAddress1" label={t('lbl.VATADDRESS1')} disabled />
											</li>
											{/* 사업자 등록 기본 주소 */}
											<li style={{ gridColumn: '1 / span 2' }}>
												<InputText name="vatAddress2" label={t('lbl.VATADDRESS2')} disabled />
											</li>
											{/* 사업자 등록 상세 주소 */}
											<li>
												<InputText name="vatPhone" label={t('lbl.VATPHONE')} disabled />
											</li>
											{/* 사업자 등록 전화번호 */}
											<li>
												<InputText name="vatFax" label={t('lbl.VATFAX')} disabled />
											</li>
											{/* 사업자 등록 팩스번호 */}
										</UiDetailViewGroup>
									</UiDetailViewArea>

									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-2">
											<li>
												<InputText name="empName1" label={t('lbl.EMPNAME1')} disabled />
											</li>
											{/* 관리 사원명1 */}
											<li>
												<InputText name="empPhone1" label={t('lbl.EMPPHONE1')} disabled />
											</li>
											{/* 관리 사원 전화번호1 */}
											<li>
												<InputText name="empName2" label={t('lbl.EMPNAME2')} disabled />
											</li>
											{/* 관리 사원명2 */}
											<li>
												<InputText name="empPhone2" label={t('lbl.EMPPHONE2')} disabled />
											</li>
											{/* 관리 사원 전화번호2 */}
										</UiDetailViewGroup>
									</UiDetailViewArea>
									<UiDetailViewArea>
										{/* 운영 정보 */}
										<UiDetailViewGroup className="grid-column-2">
											<li>
												<InputText name="startDate" label={t('lbl.STARTDATE')} disabled />
											</li>
											{/* 거래 시작 일자 */}
											<li>
												<InputText name="endDate" label={t('lbl.ENDDATE')} disabled />
											</li>
											{/* 거래 종료 일자 */}
											<li>
												<InputText name="openTime" label="업무 시작 시간" disabled />
											</li>
											{/* 업무 시작 시간 */}
											<li>
												<InputText name="closingTime" label="업무 종료 시간" disabled />
											</li>
											{/* 업무 종료 시간 */}
											<li>
												<InputText name="ifFileName" label={t('lbl.IFFILENAME')} disabled />
											</li>
											{/* 인터페이스 파일명 */}
											<li>
												<InputText name="floatMask" label={t('lbl.FLOATMASK')} disabled />
											</li>
											{/* 기본 표시 FLOAT MASK */}
											<li>
												<InputText name="memo" label={t('lbl.MEMO')} disabled />
											</li>
											{/* 기타 사항 */}
											<li>
												<SelectBox
													name="status"
													label={t('lbl.STATUS')}
													options={getCommonCodeList('STATUS_CODE', '--- 선택 ---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													disabled
												/>
											</li>
											{/* 상태 */}
											<li>
												<SelectBox
													name="delYn"
													label={t('lbl.DEL_YN')}
													options={getCommonCodeList('DEL_YN', '--- 선택 ---')}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
													disabled
												/>
											</li>
											{/* 삭제 여부 */}
										</UiDetailViewGroup>
									</UiDetailViewArea>

									<UiDetailViewArea>
										{/* 시스템 정보 (읽기 전용) */}
										<UiDetailViewGroup className="grid-column-2">
											<li>
												<InputText name="addWho" label={t('lbl.ADDWHO')} disabled={true} />
											</li>
											{/* 최초 등록자 */}
											<li>
												<InputText name="addDate" label={t('lbl.ADDDATE')} disabled={true} />
											</li>
											{/* 최초 등록 시간 */}
											<li>
												<InputText name="editWho" label={t('lbl.EDITWHO')} disabled={true} />
											</li>
											{/* 최종 변경자 */}
											<li>
												<InputText name="editDate" label={t('lbl.EDITDATE')} disabled={true} />
											</li>
											{/* 최종 변경 시간 */}
										</UiDetailViewGroup>
									</UiDetailViewArea>
								</AGrid>
							</div>
						</ScrollBox>
					</CustomForm>,
				]}
			/>

			{/* 팝업 */}
			<CustomModal ref={refModal} width="1280px">
				<CmMapPopup
					showRadius={true}
					radius={radius}
					stytime={stytime}
					setSearchLatLng={setSearchLatLng}
					setAddressInfo={setAddressInfo}
					searchText={searchAddr}
					close={popupCloseEvent}
					lat={latLng[0]}
					lon={latLng[1]}
					callBackFn={(result: any) => {
						setRadius(result.radius);
						setStytime(result.stytime);

						detailForm.setFieldsValue({
							stytime: result.stytime ? dayjs(padTime(result.stytime), 'HHmm') : '',
							radius: result.radius,
						});
					}}
				/>
			</CustomModal>
		</>
	);
});
export default CmDcManagerDetail;

const CustomForm = styled(Form)`
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
`;
