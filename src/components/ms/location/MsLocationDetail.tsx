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
import { apiGetMaster, apiPostSaveMasterList, apiPostUpsertMaster } from '@/api/ms/apiMsLocation';

// Store
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import MsPopUploadLocation from '@/components/ms/popup/MsPopUploadLocation';
import { useFormDiff } from '@/hooks/cm/useFormDiff';
import { fetchMsZone, getMsZoneList } from '@/store/biz/msZoneStore';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useSelector } from 'react-redux';

const MsLocationDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	const detailForm = props.detailForm;

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	// Form 변경 감지 훅
	const { isFormChanged, setInitialValues, onFormValuesChange } = useFormDiff(detailForm);

	// 피킹존 옵션 상태
	const [zoneOptions, setZoneOptions] = useState([]);

	const refModalExcel = useRef(null);

	// 그리드 컬럼 정의
	const gridCol = [
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'), // 로케이션
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'description',
			headerText: t('lbl.DESCRIPTION'), // 내역
			dataType: 'default',
			editable: false,
		},
		{
			dataField: 'whAreaFloor',
			headerText: t('lbl.WHAREAFLOOR'), // 창고층
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE'), // 피킹존
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'locType',
			headerText: t('lbl.LOCTYPE'), // 로케이션유형
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'locCategory',
			headerText: t('lbl.LOCCATEGORY'), // 로케이션종류
			dataType: 'code',
			editable: false,
		},
		{
			// 사용여부
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'), // 삭제여부
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DEL_YN', value)?.cdNm;
			},
		},
		// FWNEXTWMS-4032
		// {
		// 	dataField: 'locLevel',
		// 	headerText: t('lbl.LOCLEVEL'), // 로케이션레벨
		// 	dataType: 'code',
		// 	editable: false,
		// },
		// {
		// 	dataField: 'locFlag',
		// 	headerText: t('lbl.LOCFLAG'), // 로케이션구분
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			dataField: 'addWho',
			headerText: t('lbl.ADDWHO'), // 등록자
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{
			dataField: 'addWhoId',
			visible: false,
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'editWho',
			headerText: t('lbl.EDITWHO'), // 수정자
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
		},
		{
			dataField: 'editWhoId',
			visible: false,
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
		editable: false,
		// showRowCheckColumn: true,
		showRowNumColumn: true,
		enableFilter: true,
		showStateColumn: false,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 피킹존 옵션 로드
	 * @param {string} dccode 물류센터코드
	 */
	const loadZoneOptions = async (dccode: string) => {
		// 먼저 전체 피킹존 데이터를 로드
		await fetchMsZone();

		// 해당 dcCode에 맞는 피킹존 목록 필터링
		const filteredZoneOptions = getMsZoneList(dccode);

		setZoneOptions(filteredZoneOptions);
	};

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
			gridRef.current.addCheckedRowsByValue('loc', event.item.loc);
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});

		/**
		 * 그리드 셀 선택전에 실행
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionConstraint', (event: any) => {
			const { toRowIndex } = event;

			if (isFormChanged) {
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
				return;
			}

			const selectedData = selectedRow[0];

			if (!selectedData?.loc) {
				return;
			}

			// 검색 조건에서 dcCode 가져오기
			const searchParams = props.form.getFieldsValue();

			const params = {
				loc: selectedData.loc,
				dccode: searchParams.dccode,
			};

			apiGetMaster(params)
				.then(res => {
					detailForm.resetFields();

					const dataFromDB = {
						...res.data,
						addDate: dayjs(res.data.addDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
						editDate: dayjs(res.data.editDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
					};

					detailForm.setFieldsValue(dataFromDB);

					// 변경 감지를 위한 초기값 설정
					setInitialValues(dataFromDB);

					// 해당 dcCode의 피킹존 옵션 설정
					if (dataFromDB.dccode) {
						loadZoneOptions(dataFromDB.dccode);
					}
				})
				.catch(error => {
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
	const saveLocationDetail = async () => {
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

		const params = detailForm.getFieldsValue(true);

		// 미사용 예정이긴 하나 널체크에 걸려서 임시 하드코딩처리하는 항목들
		// params.inYn = 'Y';
		// params.outYn = 'Y';
		params.moveYn = 'Y';
		params.skuMixYn = 'Y';
		params.lotMixYn = 'Y';

		const rowStatus = detailForm.getFieldValue('rowStatus');

		// 표준화된 저장 확인 메시지 사용
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostUpsertMaster(params).then((res: any) => {
				// 서버측 처리
				if (res?.statusCode === 0) {
					if (rowStatus === 'I') {
						// 신규 생성인 경우 - 상세 조회를 다시 호출하여 완전한 데이터를 가져옴
						// const searchParams = props.form.getFieldsValue();
						// const detailParams = {
						// 	loc: params.loc,
						// 	dcCode: searchParams.dcCode,
						// };

						// apiGetMaster(detailParams).then(res => {
						// 	const dataFromDB = {
						// 		...res.data,
						// 		rowStatus: 'R',
						// 		addDate: dayjs(res.data.addDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
						// 		editDate: dayjs(res.data.editDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
						// 	};

						// 	detailForm.setFieldsValue(dataFromDB);

						// 	// 그리드의 선택된 행 데이터도 업데이트
						// 	gridRef.current.setSelectedRowValue(dataFromDB);

						// 	// AUIGrid 변경이력 Cache 삭제
						// 	gridRef.current.resetUpdatedItems();

						// 	if (res?.statusCode === 0) {
						// 		props.callBackFn?.(); // 콜백 함수 호출 (그리드 리로드)
						// 	}
						// });
						if (res?.statusCode === 0) {
							showMessage({
								content: t('msg.MSG_COM_SUC_003'),
								modalType: 'info',
								onOk: () => {
									props.callBackFn?.(); // 콜백 함수 호출 (그리드 리로드)
								},
							});
						}
					} else {
						// 기존 수정인 경우
						const updatedData = { ...params, rowStatus: 'R' };
						detailForm.setFieldValue('rowStatus', 'R');

						// 그리드의 선택된 행 데이터도 업데이트
						gridRef.current.setSelectedRowValue(updatedData);

						// AUIGrid 변경이력 Cache 삭제
						gridRef.current.resetUpdatedItems();

						// 저장 성공 메시지 표시
						showMessage({
							content: t('msg.MSG_COM_SUC_003'),
							modalType: 'info',
							onOk: () => {
								props.callBackFn?.(); // 콜백 함수 호출 (그리드 리로드)
							},
						});
					}
				}
			});
		});
	};

	/**
	 * 저장
	 */
	const saveLocationList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData();

		if (!updatedItems || updatedItems.length < 1) {
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
			apiPostSaveMasterList(updatedItems).then(() => {
				// 전체 체크 해제
				gridRef.current.setAllCheckedRows(false);
				// AUIGrid 변경이력 Cache 삭제
				gridRef.current.resetUpdatedItems();
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
			});
		});
	};

	/**
	 * 창고구분, 피킹존, 로케이션유형 기반 내역 자동 세팅
	 */
	const handleDescriptionAutoFill = () => {
		const currentValues = detailForm.getFieldsValue();
		const { whArea, zone, locType } = currentValues;

		// 세 값이 모두 존재할 때만 자동 세팅
		if (whArea && zone && locType) {
			const whAreaName = getCommonCodebyCd('WHAREA', whArea)?.cdNm || whArea;
			const zoneName = zoneOptions.find((z: any) => z.baseCode === zone)?.baseDescr || zone;
			const locTypeName = getCommonCodebyCd('LOCTYPE', locType)?.cdNm || locType;

			detailForm.setFieldValue('description', `${whAreaName}-${zoneName}-${locTypeName}`);
		}
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		const currentStatus = detailForm.getFieldValue('rowStatus');

		// dcCode가 변경되면 피킹존 옵션 업데이트
		if (changedValues.dccode) {
			loadZoneOptions(changedValues.dccode);
			// 기존 zone 값 초기화
			detailForm.setFieldValue('zone', '');
		}

		// 창고구분, 피킹존, 로케이션유형 변경 시 내역 자동 세팅
		if (changedValues.whArea || changedValues.zone || changedValues.locType) {
			handleDescriptionAutoFill();
		}

		// 로케이션 규격(길이, 너비, 높이) 변경 시 CUBE_CM3 자동 계산
		if (changedValues.locCubeL || changedValues.locCubeW || changedValues.locCubeH) {
			const currentValues = detailForm.getFieldsValue();
			const length = parseFloat(currentValues.locCubeL) || 0;
			const width = parseFloat(currentValues.locCubeW) || 0;
			const height = parseFloat(currentValues.locCubeH) || 0;

			// 세 값이 모두 있을 때만 계산
			if (length > 0 && width > 0 && height > 0) {
				const cubeCm3 = length * width * height;
				detailForm.setFieldValue('locCube', cubeCm3.toString());
			} else if (length === 0 || width === 0 || height === 0) {
				// 하나라도 0이거나 비어있으면 CUBE_CM3도 초기화
				detailForm.setFieldValue('locCube', '');
			}
		}

		// 변경 감지 훅 호출
		onFormValuesChange();

		if (currentStatus !== 'U' && currentStatus !== 'I') {
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	/**
	 * 신규 로케이션 추가
	 * @returns {void}
	 */
	const addNewLocation = () => {
		// 이미 신규 행이 있는 경우 경고 메시지를 표시하고 함수를 종료한다.
		if (detailForm.getFieldValue('rowStatus') === 'I') {
			showMessage({
				content: t('msg.MSG_COM_ERR_054'), // 이미 신규 행이 존재합니다
				modalType: 'warning',
			});
			return;
		}

		// 초기화된 로케이션 정보 객체를 생성한다.
		const initValues = {
			rowStatus: 'I', // 신규 입력 상태
			dccode: gDccode, // 사용자 작업센터 사용
			loc: '',
			serialKey: '',
			description: '',
			whArea: '',
			whAreaFloor: '1',
			zone: '',
			locType: '',
			locCategory: 'RACK',
			locFlag: '',
			locLevel: '',
			logicalLocV: '',
			logicalLocH: '',
			stockType: 'GOOD',
			rack: 'STD',
			rackLine: '1',
			rackColumn: '1',
			locWeight: '',
			locCube: '',
			locCubeL: '',
			locCubeW: '',
			locCubeH: '',
			delYn: 'N',
			skuMixYn: 'Y',
			lotMixYn: 'Y',
			inYn: 'Y',
			outYn: 'Y',
			moveYn: 'N',
			storageType: '',
			dpsYn: 'N',
			// statusYn: 'Y',
			pltFlg: 'P',
			capaYn: 'Y',
			capaLocType: '',
			multiLocYn: 'Y', // 멀티로케이션여부 기본값
			addDate: '',
			addWho: '',
			editDate: '',
			editWho: '',
		};

		// 폼에 초기화된 값을 설정한다.
		detailForm.setFieldsValue(initValues);

		// 사용자 작업센터에 맞는 피킹존 옵션 설정
		if (gDccode) {
			loadZoneOptions(gDccode);
		}
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const openUploadPopup = () => {
		refModalExcel.current?.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalExcel.current.handlerClose();
	};

	/**
	 * 중복로케이션 검증 함수
	 * @param loc
	 * @param dccode
	 */
	const validateDuplicateLocation = async (loc: string, dccode: string) => {
		// 빈 값은 required에서 처리하므로 통과
		if (!loc || !loc.trim()) {
			return Promise.resolve();
		}

		const result = await apiGetMaster({ loc, dccode });

		// 같은 건이면 검증하지 않음
		// DB에 공백 포함된 데이터가 있을 수 있으므로 원본 그대로 검증
		// result.data가 존재하면 로케이션이 존재하는 것 (중복)
		if (result?.data?.loc == loc.trim() && result?.data?.dccode == dccode) {
			showAlert(null, '이미 존재하는 로케이션입니다.');
			return Promise.reject(new Error('이미 존재하는 로케이션입니다.'));
		} else if (result.data == null) {
			return Promise.resolve();
		}

		return Promise.resolve();
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			// {
			// 	btnType: 'excelDownload',
			// },
			// {
			// 	btnType: 'plus',
			// 	callBackFn: addNewLocation,
			// },
			// {
			// 	btnType: 'save',
			// 	callBackFn: saveLocationList,
			// },
		],
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'pre',
			},
			{
				btnType: 'post',
			},
			{
				btnType: 'new',
				callBackFn: addNewLocation,
			},
			{
				btnType: 'save',
				callBackFn: saveLocationDetail,
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

		// 페이지 로드 시 신규 입력 상태로 초기화
		if (gDccode) {
			detailForm.setFieldsValue({
				dpsYn: 'N',
				capaYn: 'Y',
				multiLocYn: 'Y',
				delYn: 'N',
				rowStatus: 'I',
				dccode: gDccode,
				pltFlg: 'P',
				inYn: 'Y',
				outYn: 'Y',
				stockType: 'GOOD',
				locCategory: 'RACK',
				whAreaFloor: '1',
				rack: 'STD',
				rackLine: '1',
				rackColumn: '1',
			});
			loadZoneOptions(gDccode);
		}
	}, []);

	// 피킹존 옵션 설정
	useEffect(() => {
		setZoneOptions(getMsZoneList(gDccode));
	}, [gDccode]);

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
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn}>
								{/* <Button onClick={openUploadPopup}>{t('lbl.EXCELUPLOAD')}</Button> */}
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<Form form={detailForm} onValuesChange={onValuesChange}>
							<AGrid style={{ padding: '10px 0', marginBottom: 0, flex: 'none', height: 'auto' }}>
								<TableTopBtn tableTitle={t('lbl.DETAIL_TAB')} tableBtn={tableBtn} className="fix-title" />
							</AGrid>
							<UiDetailViewArea>
								<UiDetailViewGroup className="grid-column-2">
									<Form.Item name="rowStatus" hidden>
										<Input />
									</Form.Item>
									<Form.Item name="serialKey" hidden>
										<Input />
									</Form.Item>
									{/* 물류센터 */}
									<li>
										<SelectBox
											label={t('lbl.DCCODE')}
											name="dccode"
											defaultValue={gDccode}
											options={getCommonCodeList('WAREHOUSE', '--- 선택---')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											disabled={true}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.DCCODE')]),
												},
											]}
										/>
									</li>
									{/* 로케이션 */}
									<li>
										<InputText
											name="loc"
											label={t('lbl.LOC')}
											placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOC')])}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.LOC')]),
												},
											]}
											onBlur={async (e: any) => {
												const value = e.target.value?.trim();
												if (!value) return;

												// focus out 시에만 중복 검증 실행
												try {
													await validateDuplicateLocation(value, gDccode);
													// 검증 통과 - 에러 제거
													detailForm.setFields([{ name: 'loc', errors: [] }]);
												} catch (error: any) {
													// 검증 실패 - 에러 표시
													detailForm.setFields([{ name: 'loc', errors: [error.message] }]);
												}
											}}
										/>
									</li>
									{/* 내역 */}
									<li style={{ gridColumn: 'span 2' }}>
										<InputText label={t('lbl.DESCRIPTION')} name="description" placeholder="C/D 저장/일반 임고" />
									</li>
									{/* 창고구분 */}
									<li>
										<SelectBox
											name="whArea"
											label={t('lbl.WHAREA')}
											options={getCommonCodeList('WHAREA', '--- 선택---', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.WHAREA')]),
												},
											]}
										/>
									</li>
									{/* 창고층 */}
									<li className="range-align">
										<SelectBox
											name="whAreaFloor"
											label={t('lbl.WHAREAFLOOR')}
											options={getCommonCodeList('WHAREAFLOOR', '--- 선택---', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.WHAREAFLOOR')]),
												},
											]}
										/>
										{/* <span>~</span>
								<SelectBox
									name="whAreaFloor"
									options={getCommonCodeList('WHAREAFLOOR', '--- 선택---', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/> */}
									</li>
									{/* 피킹존 */}
									<li className="range-align">
										<SelectBox
											name="zone"
											label={t('lbl.ZONE')}
											options={zoneOptions}
											fieldNames={{ label: 'baseDescr', value: 'baseCode' }}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.ZONE')]),
												},
											]}
										/>
										{/* <span>~</span>
								<SelectBox name="zone" options={zoneOptions} fieldNames={{ label: 'baseDescr', value: 'baseCode' }} /> */}
									</li>
									{/* 로케이션유형 */}
									<li>
										<SelectBox
											label={t('lbl.LOCTYPE')}
											name="locType"
											options={getCommonCodeList('LOCTYPE', '--- 선택---')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.LOCTYPE')]),
												},
											]}
										/>
									</li>
									{/* 로케이션종류 */}
									<li>
										<SelectBox
											label={t('lbl.LOCCATEGORY')}
											name="locCategory"
											options={getCommonCodeList('LOCCATEGORY', '--- 선택---')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.LOCCATEGORY')]),
												},
											]}
										/>
									</li>
									{/* 재고위치 */}
									<li className="range-align">
										<SelectBox
											label={t('lbl.STOCKTYPE')}
											name="stockType"
											options={getCommonCodeList('STOCKTYPE', '--- 선택---')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.STOCKTYPE')]),
												},
											]}
											// disabled={true}
										/>
										{/* <span>~</span>
								<SelectBox
									name="stockType"
									options={getCommonCodeList('STOCKTYPE', '--- 선택---')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									disabled={true}
								/> */}
									</li>
									{/* 저장조건 */}
									<li>
										<SelectBox
											label={t('lbl.STORAGETYPE')}
											name="storageType"
											options={getCommonCodeList('STORAGETYPE', '--- 선택---', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									{/* 혼합대상 */}
									<li>
										<SelectBox
											label={t('lbl.MIXTGT_TP')}
											name="mixtgtType"
											options={getCommonCodeList('MIXTGT_TP', '--- 선택---', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									{/*  */}
									{/* DPS여부 */}
									<li>
										<SelectBox
											label={'DPS여부'}
											name="dpsYn"
											options={[
												{ label: 'Y', value: 'Y' },
												{ label: 'N', value: 'N' },
											]}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.DPS_YN')]),
												},
											]}
										/>
									</li>
									{/* CAPA 적용여부 */}
									<li>
										<SelectBox
											label={t('lbl.CAPA_YN')}
											name="capaYn"
											options={getCommonCodeList('CAPA_YN', '--- 선택---', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// rules={[
											// 	{
											// 		required: true,
											// 		message: t('msg.MSG_COM_VAL_054', [t('lbl.CAPA_YN')]),
											// 	},
											// ]}
										/>
									</li>
									{/* 멀티로케이션여부 */}
									<li>
										<SelectBox
											label={t('lbl.MULTI_LOC_YN')}
											name="multiLocYn"
											// options={getCommonCodeList('MULTI_LOC_YN', '--- 선택---')}
											options={[
												{ label: 'Y', value: 'Y' },
												{ label: 'N', value: 'N' },
											]}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.MULTI_LOC_YN')]),
												},
											]}
										/>
									</li>
									{/* 삭제 여부 => "사용여부"로 변경 */}
									<li>
										<SelectBox
											label={t('lbl.DEL_YN')}
											name="delYn"
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.DEL_YN')]),
												},
											]}
											options={getCommonCodeList('DEL_YN', '--- 선택---', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>

									{/* PLT 구분 */}
									<li>
										<SelectBox
											label={t('lbl.PLT_FLG')}
											name="pltFlg"
											options={getCommonCodeList('PLT_FLG', '--- 선택---', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required={true}
											rules={[
												{
													required: true,
													message: t('msg.MSG_COM_VAL_054', [t('lbl.PLT_FLG')]),
												},
											]}
										/>
									</li>

									{/* 로케이션구분 */}
									{/* <li>
								<SelectBox
									label={t('lbl.LOCFLAG')}
									name="locFlag"
									options={getCommonCodeList('LOCFLAG', '--- 선택---')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li> */}
									{/* 로케이션레벨 */}
									{/* <li>
								<SelectBox
									label={t('lbl.LOCLEVEL')}
									name="locLevel"
									options={getCommonCodeList('LOCLEVEL', '--- 선택---')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li> */}
									{/* 로케이션 수직우선순위계산 */}
									{/* <li>
								<InputText label={t('lbl.LOGICALLOC_V')} name="logicalLocV" />
							</li> */}
									{/* 로케이션 수평우선순위계산 */}
									{/* <li>
								<InputText label={t('lbl.LOGICALLOC_H')} name="logicalLocH" />
							</li> */}

									{/* 랙 */}
									<li>
										<InputText label={t('lbl.RACK')} name="rack" />
									</li>

									{/* 랙행번호 */}
									<li>
										<InputText label={t('lbl.RACKLINE')} name="rackLine" />
									</li>

									{/* 랙열번호 */}
									<li>
										<InputText label={t('lbl.RACKCOLUMN')} name="rackColumn" />
									</li>

									{/* LOC적재무게 */}
									{/* <li>
								<InputText label={t('lbl.LOCWEIGHT')} name="locWeight" />
							</li> */}
									{/* CUBE_CM3 */}
									{/* <li>
								<InputText label={t('lbl.CUBE_CM3')} name="locCube" />
							</li> */}
									{/* 로케이션규격(길이) */}
									{/* <li>
								<InputText
									name="locCubeL"
									label={t('lbl.LOCCUBE_L')}
									placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOCCUBE_L')])}
									required
									rules={[
										{
											required: true,
											message: t('msg.MSG_COM_VAL_054', [t('lbl.LOCCUBE_L')]),
										},
									]}
								/>
							</li> */}
									{/* 로케이션규격(너비) */}
									{/* <li>
								<InputText
									name="locCubeW"
									label={t('lbl.LOCCUBE_W')}
									placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOCCUBE_W')])}
									required
									rules={[
										{
											required: true,
											message: t('msg.MSG_COM_VAL_054', [t('lbl.LOCCUBE_W')]),
										},
									]}
								/>
							</li> */}
									{/* 로케이션규격(높이) */}
									{/* <li>
								<InputText
									name="locCubeH"
									label={t('lbl.LOCCUBE_H')}
									placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOCCUBE_H')])}
									required
									rules={[
										{
											required: true,
											message: t('msg.MSG_COM_VAL_054', [t('lbl.LOCCUBE_H')]),
										},
									]}
								/>
							</li> */}
									{/* 상품혼합여부 */}
									{/* <li>
								<SelectBox
									label={t('lbl.SKUMIX_YN')}
									name="skuMixYn"
									options={getCommonCodeList('SKUMIX_YN', '--- 선택---', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li> */}
									{/* 로트혼합여부 */}
									{/* <li>
								<SelectBox
									label={t('lbl.LOTMIX_YN')}
									name="lotMixYn"
									options={getCommonCodeList('LOTMIX_YN', '--- 선택---', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li> */}
									{/* 입고가능 */}
									<li>
										<SelectBox
											label={t('lbl.IN_YN')}
											name="inYn"
											required
											options={getCommonCodeList('IN_YN', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// disabled={detailForm.getFieldValue('rowStatus') === 'I' ? true : false}
										/>
									</li>
									{/* 출고가능 */}
									<li>
										<SelectBox
											label={t('lbl.OUT_YN')}
											name="outYn"
											required
											options={getCommonCodeList('OUT_YN', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// disabled={detailForm.getFieldValue('rowStatus') === 'I' ? true : false}
										/>
									</li>
									{/* 이동완료여부 */}
									{/* <li>
								<SelectBox
									label={t('lbl.MOVE_YN')}
									name="moveYn"
									options={[
										{ label: 'Y', value: 'Y' },
										{ label: 'N', value: 'N' },
									]}
								/>
							</li> */}
									{/* CAPA 로케이션유형 */}
									{/* <li>
								<SelectBox
									label={t('lbl.CAPA_LOCTYPE')}
									name="capaLocType"
									options={getCommonCodeList('CAPA_LOCTYPE', '--- 선택---')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li> */}
									{/* 등록자 */}
									<li>
										<InputText label={t('lbl.ADDWHO')} name="addWho" disabled />
									</li>
									{/* 등록일시 */}
									<li>
										<InputText label={t('lbl.ADDDATE')} name="addDate" disabled />
									</li>
									{/* 수정자 */}
									<li>
										<InputText label={t('lbl.EDITWHO')} name="editWho" disabled />
									</li>
									{/* 수정일시 */}
									<li>
										<InputText label={t('lbl.EDITDATE')} name="editDate" disabled />
									</li>
								</UiDetailViewGroup>
							</UiDetailViewArea>
						</Form>
					</>,
				]}
			/>
			<CustomModal ref={refModalExcel} width="1000px">
				<MsPopUploadLocation close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default MsLocationDetail;
