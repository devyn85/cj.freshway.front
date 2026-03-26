// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import { DateRange, InputText, InputTextArea, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// API
import { apiGetCommuintyDetailList, apiPostSaveCommuinty } from '@/api/cb/apiCbCommunity';
import { apiGetCmFileUploadList } from '@/api/cm/apiCmFileUpload';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';

const CbCommunityDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid data
	const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
	// form disable 제어
	const [formDisabled, setFormDisabled] = useState(true);
	// file
	const uploadFile = useRef(null);
	const [fileInfoList, setFileInfoList] = useState([]);
	const [saveFormData, setSaveFormData] = useState([]);

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRefFile = useRef();
	ref.gridRefRcv = useRef();

	// 사용자 상세 입력 폼
	const detailForm = props.detailForm;

	// 공지사항 그리드 칼럼 레이아웃 설정
	const gridColMaster = [
		{
			headerText: t('lbl.TITLE'), // 제목
			dataField: 'brdTit',
		},
		{
			headerText: t('lbl.WRITER'), // 작성자
			dataField: 'brdUsrId',
		},
		{
			headerText: t('lbl.WRITERDC'), // 작성센터
			dataField: 'brdUsrDcName',
		},
		{
			headerText: t('lbl.WRITEDATE'), // 작성일자
			dataField: 'brdRegDt',
			dataType: 'date',
		},
		{
			headerText: t('lbl.VIEWS'), // 보기
			dataField: 'qryFrq',
		},
		{
			headerText: t('lbl.NUMBER'), // 게시번호
			dataField: 'brdNum',
			visible: false,
		},
	];

	// 공지사항 그리드 속성 설정
	const gridPropsMaster = {
		// editable: true,
		showRowCheckColumn: true,
		isLegacyRemove: true,
	};

	// 첨부파일 그리드 칼럼 레이아웃 설정
	const gridColFile = [
		{
			headerText: 'SOURCE_FILE_NM',
			dataField: 'sourceFileNm',
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
			},
		},
		{
			headerText: 'FILE_SIZE',
			dataField: 'fileSize',
			dataType: 'numeric',
		},
		{
			dataField: 'type',
			visible: false,
		},
		{
			dataField: 'refKey',
			visible: false,
		},
		{
			dataField: 'fileSeq',
			visible: false,
		},
		{
			dataField: 'uploadedDirPath',
			visible: false,
		},
		{
			dataField: 'uploadedFileNm',
			visible: false,
		},
	];

	// 첨부파일 그리드 속성 설정
	const gridPropsFile = {
		// editable: true,
		showRowCheckColumn: true,
		isLegacyRemove: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 공지사항 상세 조회
	 * @returns {void}
	 */
	const searchDtl = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef.current.isAddedById(selectedRow[0]._$uid)) {
			setSelectedRowIndex(ref.gridRef.current.getSelectedIndex()[0]); // rowIndex 저장

			const params = {
				brdNum: selectedRow[0].brdNum,
			};

			apiGetCommuintyDetailList(params).then(res => {
				detailForm.resetFields();
				detailForm.setFieldsValue({
					...res.data,
					brdStDt: res.data?.brdStDt ? dayjs(res.data?.brdStDt) : null,
					brdExprDt: res.data?.brdExprDt ? dayjs(res.data?.brdExprDt) : null,
					rowStatus: 'R',
				});
				setFormDisabled(false);
			});
		} else {
			// 상세 내용 초기화
			ref.gridRefFile.current.clearGridData();
			return;
		}
	};

	/**
	 * 첨부파일 목록 조회
	 * @returns {void}
	 */
	const searchFileUploadList = () => {
		const selectedRow = ref.gridRef.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef.current?.isAddedById(selectedRow[0]._$uid)) {
			const params = {
				type: 'board',
				refKey: selectedRow[0].brdNum,
			};
			apiGetCmFileUploadList(params).then(res => {
				ref.gridRefFile.current?.setGridData(res.data);
			});
		}
	};

	/**
	 * 신규 추가
	 * @returns {void}
	 */
	const addDetail = () => {
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
			brdStDt: dayjs(), // 오늘 날짜
			brdExprDt: dayjs().add(7, 'day'),
			brdTit: '',
			brdCntt: '',
		};
		ref.gridRef.current?.addRow(initValues);

		setFormDisabled(false);
		setSelectedRowIndex(ref.gridRef.current?.getSelectedIndex()[0]); // rowIndex 저장

		// 폼에 초기화된 값을 설정한다.
		detailForm.setFieldsValue(initValues);
	};

	/**
	 * 상세저장
	 * @returns {void}
	 */
	const saveDetail = async () => {
		const rowStatus = ref.gridRef.current?.getCellValue(selectedRowIndex, 'rowStatus');

		// 입력 값 검증
		if (rowStatus === 'I' || rowStatus === 'U') {
			const isValid = await validateForm(detailForm);
			if (!isValid) {
				return;
			}
		}

		apiPostSaveCommuintyFunc();
	};

	const apiPostSaveCommuintyFunc = () => {
		// 파일 전송할 form
		const formDataParam = new FormData();

		// 저장 DATA 추가
		const params = {
			...detailForm.getFieldsValue(true),
			brdStDt: detailForm.getFieldValue('brdStDt')?.format('YYYYMMDD'),
			brdExprDt: detailForm.getFieldValue('brdExprDt')?.format('YYYYMMDD'),
		};

		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getChangedData({ validationYn: false });
		const currentStatus = detailForm.getFieldValue('rowStatus');

		// 신규 또는 수정건이 있을 경우에만 form data를 포함한 값을 param에 추가, 삭제인 경우 updatedItems로 처리
		if (currentStatus === 'U' || currentStatus === 'I') {
			formDataParam.append(
				'params',
				new Blob([JSON.stringify([params])], {
					type: 'application/json',
				}),
			);
		} else {
			formDataParam.append(
				'params',
				new Blob([JSON.stringify(updatedItems)], {
					type: 'application/json',
				}),
			);
		}

		// 첨부파일 존재시 추가
		const gridFileList = ref.gridRefFile.current.getChangedData();
		if (gridFileList.length > 0) {
			saveFormData.forEach(function (item: any) {
				formDataParam.append('file', item);
			});
			formDataParam.append(
				'fileInfoList',
				new Blob([JSON.stringify(gridFileList)], {
					type: 'application/json',
				}),
			);
		}

		ref.gridRef.current.showConfirmSave(() => {
			apiPostSaveCommuinty(formDataParam).then(() => {
				ref.gridRef.current.setAllCheckedRows(false);
				ref.gridRef.current.resetUpdatedItems();
				detailForm.resetFields();

				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});

				if (props.callBackFn && props.callBackFn instanceof Function) {
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * detail 삭제버튼
	 * @returns {void}
	 */
	const deleteFunc = async () => {
		const rowStatus = detailForm.getFieldValue('rowStatus');
		if (rowStatus === 'I') {
			detailForm.resetFields();
			return;
		}

		apiPostSaveCommuintyFunc();
	};

	// 공지사항 그리드 버튼 설정
	const gridBtnMaster: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				isActionEvent: false,
				callBackFn: addDetail,
				initValues: {
					rowStatus: 'I', // 신규 행 상태로 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveDetail,
			},
		],
	};

	// 공지사항 상세 버튼 설정
	const tableBtnDetail: TableBtnPropsType = {
		tGridRef: ref.gridRef, // 사용자 목록 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'delete',
			// 	callBackFn: deleteFunc,
			// },
		],
	};

	// 첨부파일 그리드 버튼 설정
	const gridBtnFile: GridBtnPropsType = {
		tGridRef: ref.gridRefFile, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete', // 행삭제
				btnLabel: '파일삭제',
				callBackFn: () => {
					onValuesChange();
				},
			},
		],
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 */
	const onValuesChange = () => {
		const currentStatus = detailForm.getFieldValue('rowStatus');

		if (currentStatus === 'R') {
			if (selectedRowIndex !== null) {
				// form에서 변경한 해당 row의 상태를 'U'로 변경 (showConfirmSave에서 그리드 변경을 감지하기 위해 저장하는 값)
				ref.gridRef.current?.setCellValue(selectedRowIndex, 'rowStatus', 'U');
			}
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	/**
	 * 업로드 클릭
	 */
	function onClickFileUpload() {
		uploadFile.current.click();
	}

	/**
	 * 업로드 이벤트
	 * @param {object} event 업로드 파일 변경 이벤트
	 */
	function changeUploadEvent(event: any) {
		const files = uploadFile.current.files;
		const tmpFileList = [...fileInfoList];
		const tmpSaveList = [...saveFormData];

		for (const element of files) {
			const currentFile = {
				fileTp: 'cpt',
				sourceFileNm: element.name,
				fileSize: element.size.toString(),
				attchFileGrpNo: detailForm.getFieldValue('brdNum'),
				attchFileNm: element.name,
				attchFileSz: element.size.toString(),
				attchFileExtNm: element.name.split('.')[1],
				rowStatus: 'I',
				uuid: uuidv4(),
			};

			// 임시 저장
			tmpFileList.push(currentFile);
			tmpSaveList.push(element);

			ref.gridRefFile.current.addRow(currentFile, 'last');
			onValuesChange();
		}

		// 파일 리스트 저장
		setFileInfoList(tmpFileList);
		setSaveFormData(tmpSaveList);

		// 같은 파일을 재업로드할 수 있도록 이벤트 초기화
		event.target.value = '';
	}

	/**
	 * 파일 다운로드
	 * @param {object} event 파일 다운로드 이벤트
	 */
	function fileDownloadEvent(event: any) {
		const refKey = ref.gridRefFile.current.getCellValue(event.rowIndex, 'refKey');
		const saveFileNm = ref.gridRefFile.current.getCellValue(event.rowIndex, 'sourceFileNm');
		const savePathNm = ref.gridRefFile.current.getCellValue(event.rowIndex, 'uploadedDirPath');
		const attchFileNm = ref.gridRefFile.current.getCellValue(event.rowIndex, 'uploadedFileNm');

		if (commUtil.isEmpty(refKey)) {
			return;
		}

		const params = {
			dirType: 'savePath',
			saveFileNm: saveFileNm,
			savePathNm: savePathNm,
			attchFileNm: attchFileNm,
		};
		fileUtils.downloadFile(params);
	}

	// 첨부파일 삭제 함수
	const deleteFileRow = () => {
		const selectedIndex = ref.gridRefFile.current.getSelectedIndex()[0];
		ref.gridRefFile.current?.removeRow(selectedIndex);
		onValuesChange();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	let prevRowIndex: any = null;
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;

		// 마스터 그리드 행 변경 시
		gridRefCur?.bind('selectionChange', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex) return;

			// 이미 신규 행이 있는 경우 경고 메시지를 표시하고 함수를 종료한다.
			if (detailForm.getFieldValue('rowStatus') === 'I') {
				if (commUtil.isNotEmpty(gridRefCur?.getItemByRowIndex(prevRowIndex))) {
					showMessage({
						content: t('msg.MSG_COM_ERR_054'), // 이미 신규 행이 존재합니다
						modalType: 'warning',
					});
					gridRefCur?.setSelectionByIndex(prevRowIndex, 0);
					return;
				}
			}

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			// 상세공지사항 조회
			searchDtl();

			// 첨부파일 목록 조회
			searchFileUploadList();
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRefCur?.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			gridRefCur.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			// 상세 초기화
			if (props.data?.length < 1) {
				detailForm.resetFields();
				ref.gridRefFile.current.clearGridData();
			}
		}
	}, [props.data]);

	// 첨부파일 Cell 선택시
	useEffect(() => {
		ref.gridRefFile.current?.bind('cellClick', (event: any) => {
			if (event.dataField == 'sourceFileNm') {
				fileDownloadEvent(event);
			}
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRefFile?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtnMaster} gridTitle={'목록'} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridColMaster} gridProps={gridPropsMaster} />
						</GridAutoHeight>
					</>,
					<Splitter
						key="CbCommunity-bottom-grid"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<AGrid>
									<TableTopBtn tableTitle={'상세'} tableBtn={tableBtnDetail} />
									<ScrollBox>
										<Form form={detailForm} onValuesChange={onValuesChange} disabled={formDisabled}>
											<UiDetailViewArea>
												<UiDetailViewGroup>
													<Form.Item name="rowStatus" hidden>
														<Input />
													</Form.Item>
													<li className="col-2">
														<SelectBox
															name="brdDocDivCd"
															label={t('lbl.DOCTYPE')} // 문서유형
															initval={'ADMINBOARD'}
															options={getCommonCodeList('COMMUNITYTYPE')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
															disabled={true}
														/>
													</li>
													<li className="col-2">
														<DateRange
															label={t('lbl.EXPRDATE')} // 만료일자
															format="YYYY-MM-DD"
															fromName="brdStDt"
															toName="brdExprDt"
															rules={[{ required: true, validateTrigger: 'none' }]}
															disabled={formDisabled}
															onChange={() => {
																// 날짜 키보드 입력 후 엔터시 변경 감지 못하는 이슈로 아래 로직 적용
																onValuesChange();
															}}
														/>
													</li>
													<li className="col-1">
														<InputText
															label={t('lbl.TITLE')}
															name="brdTit"
															required
															rules={[{ required: true, validateTrigger: 'none' }]}
														/>
													</li>
													<li className="col-1">
														<InputTextArea
															label={t('lbl.CONTENT')}
															autoSize={{ minRows: 17, maxRows: 15 }}
															name="brdCntt"
															disabled={formDisabled}
														/>
													</li>
												</UiDetailViewGroup>
											</UiDetailViewArea>
										</Form>
									</ScrollBox>
								</AGrid>
							</>,
							<>
								<AGrid>
									<GridTopBtn gridBtn={gridBtnFile} gridTitle={'첨부파일'}>
										<Button onClick={onClickFileUpload}>{'파일추가'}</Button>
										<input
											ref={uploadFile}
											id="cbCommunityUploadInput"
											multiple
											type="file"
											style={{ display: 'none' }}
											onChange={changeUploadEvent}
										/>
										{/* <Button onClick={deleteFileRow}> {'파일삭제'}</Button> */}
									</GridTopBtn>
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={ref.gridRefFile} columnLayout={gridColFile} gridProps={gridPropsFile} />
								</GridAutoHeight>
							</>,
						]}
					/>,
				]}
			/>
		</>
	);
});

export default CbCommunityDetail;
