import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailTableArea from '@/assets/styled/Container/UiDetailTableArea';
import UiDetailTableGroup from '@/assets/styled/Container/UiDetailTableGroup';
import CmSkuInfoPopup from '@/components/cm/popup/CmSkuInfoPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';

// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// API Call Function
import { apiGetSkuInfoPopup } from '@/api/cm/apiCmSearch';
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';

const DetailCarDriver = forwardRef((props: any, ref: any) => {
	ref.gridRef = useRef();
	const refModal = useRef(null);
	const { t } = useTranslation();
	const [skuPopupData, setSkuPopupData] = useState(null);

	// form data 초기화
	const initFormData = {
		inputText2: '',
		inputText3: '',
	};

	// form data onChange Event Handler
	const onFormChange = (changedValues: any, allValues: any) => {};

	// 그리드 초기화
	const searchDtl = (authority: string) => {
		// ref.gridRef2.current.clearGridData();
		props.form.resetFields();
		if (commUtil.isEmpty(authority)) {
			const selectedRow = ref.gridRef.current.getSelectedRows();
			if (selectedRow.length > 0 && !ref.gridRef.current.isAddedById(selectedRow[0]._$uid)) {
				authority = selectedRow[0].authority; // 현재 행
			} else {
				return;
			}
		}
		// const params = { authority: authority };
		// apiGetRolesMappingMenuList(params).then(res => {
		// 	const gridData = res.data;
		// 	// ref.gridRef2.current.setGridData(gridData);
		// });
	};

	useEffect(() => {
		ref.gridRef.current?.bind('selectionChange', function () {
			// 상세코드 조회
			searchDtl(null);
			props.form.resetFields();
			const selectedRowData = ref.gridRef.current.getSelectedRows()[0];
			props.form.setFieldsValue({
				defDccode: selectedRowData.defDccode,
				carNo: selectedRowData.carNo,
				carId: selectedRowData.carId,
				shortNo: selectedRowData.shortNo,
				contractType: selectedRowData.contractType,
			});
		});
	}, []);

	// useEffect(() => {
	// 	setGridCustomBtn(
	// 		<>
	// 			<span>{t('sysmgt.roles.menu.copyBy', [selectedRowNm])}</span>
	// 			<Input placeholder={t('sysmgt.roles.menu.newAuthority')} id="newAuthCd" name="newAuthCd" ref={newAuthCdRef} />
	// 			<span>|</span>
	// 			<Input placeholder={t('sysmgt.roles.menu.newRoleNm')} id="newAuthNm" name="newAuthNm" ref={newAuthNmRef} />
	// 			<Button onClick={clickNewAuth}> {t('sysmgt.roles.menu.btnNewYn')} </Button>
	// 		</>,
	// 	);
	// }, [selectedRowNm]);

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	//차량그룹
	const contractTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
	};
	//삭제유무
	const delYnLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('DEL_YN', value)?.cdNm;
	};
	//DGT유무
	const dgtYnLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('YN', value)?.cdNm;
	};
	//차량톤수
	const carcapacityLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};
	//냉동기유형
	const cargoTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARGOTYPE', value)?.cdNm;
	};

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'defDccode',
			headerText: '물류센터',
		},
		{
			dataField: 'defDcname',
			headerText: '물류센터명',
			editable: false,
		},
		{
			dataField: 'contractType',
			headerText: '계약유형',
			labelFunction: contractTypeLabelFunc,
		},
		{
			dataField: 'carId',
			headerText: '차량ID',
			filter: {
				showIcon: true,
			},
			style: 'left',
		},
		{
			dataField: 'carNo',
			headerText: t('lbl.CARNO'),
			filter: {
				showIcon: true,
			},
			style: 'left',
		},
		{
			headerText: '첨부파일',
			children: [
				{
					dataField: 'a8',
					headerText: '차량소독증/보건증/차량등록증',
				},
			],
		},
		{
			dataField: 'a9',
			headerText: '차량소독증유효기간TO',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			commRenderer: {
				type: 'calender',
				showExtraDays: true,
			},
		},
		{
			dataField: 'a10',
			headerText: '보건증유효기간TO',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// renderer: {
			// 	type: 'CustomRenderer', // 사용자 정의 렌더러 사용
			// 	jsClass: AUIGrid.MyCalendarRenderer, // 작성한 사용자 정의 렌더러 JS
			// },
		},
		{
			dataField: 'a11',
			headerText: '차량등록증유효기간TO',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editRenderer: {
				type: 'CalendarRenderer',
				showExtraDays: true,
				titles: ['일', '월', '화', '수', '목', '금', '토'],
			},
		},
		{
			dataField: 'carCapacity',
			headerText: '차량톤수',
			postfix: '톤',
			style: 'left',
			labelFunction: carcapacityLabelFunc,
			editRenderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('CARCAPACITY', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'maxWeight',
			headerText: '최대적재량',
		},
		{
			dataField: 'a14',
			headerText: '차량규격',
		},
		{
			dataField: 'a15',
			headerText: '탑규격',
			// commRenderer: {
			// 	type: 'search',
			// 	showExtraDays: true,
			// },
			renderer: {
				type: 'ButtonRenderer',
				labelText: '상세 보기',
				onClick: (event: any) => {
					showAlert('', '( ' + event.rowIndex + ', ' + event.columnIndex + ' ) ' + event.item.name + ' 상세 보기 클릭');
				},
			},
		},
		{
			dataField: 'cargoType',
			headerText: '냉동기유형',
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('CARGOTYPE', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'dtgType',
			headerText: 'DTG유무',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'gpsType',
			headerText: 'GPS유무',
		},
		{
			dataField: 'a19',
			headerText: '차량연식',
		},
		{
			dataField: 'a20',
			headerText: '기본착지수',
		},
		{
			dataField: 'a21',
			headerText: '최대착지수',
		},
		{
			dataField: 'a22',
			headerText: '출차그룹',
		},
		{
			dataField: 'a23',
			headerText: '강성차량',
		},
		{
			dataField: 'inDt',
			headerText: '입차시간',
		},
		{
			dataField: 'outDt',
			headerText: '출차시간',
		},
		{
			dataField: 'dockNo',
			headerText: 'Dock No',
		},
		{
			dataField: 'larea',
			headerText: '배송대권역',
			style: 'left',
		},
		{
			dataField: 'marea',
			headerText: '배송중권역',
			style: 'left',
		},
		{
			dataField: 'sarea',
			headerText: '배송소권역',
			style: 'left',
		},
		{
			dataField: 'a30',
			headerText: '연계배송차량1',
		},
		{
			dataField: 'a31',
			headerText: '연계배송차량1권역',
		},
		{
			dataField: 'a32',
			headerText: '연계배송차량2',
		},
		{
			dataField: 'a33',
			headerText: '연계배송차량2권역',
		},
		{
			dataField: 'a34',
			headerText: '연계배송차량3',
		},
		{
			dataField: 'a35',
			headerText: '연계배송차량3권역',
		},
		{
			dataField: 'shortNo',
			headerText: '차량단축번호',
		},
		{
			dataField: 'a37',
			headerText: '블루투스스캐너지급유무',
		},
		{
			dataField: 'a38',
			headerText: '블루투스스캐너시리얼번호',
		},
		{
			dataField: 'a39',
			headerText: '스마트폰지급유무',
		},
		{
			dataField: 'a40',
			headerText: '스마트폰IMEI',
		},
		{
			dataField: 'a41',
			headerText: '스마트폰IMEI2',
		},
		{
			dataField: 'a42',
			headerText: '스마트폰IMEI3',
		},
		{
			dataField: 'a43',
			headerText: '중복 로그인 여부',
		},
		{
			headerText: '운전자이름',
			children: [
				{
					dataField: 'driverName',
					headerText: '이름',
				},
				{
					dataField: 'phone1',
					headerText: '전화번호',
				},
			],
		},
		{
			headerText: '보조운전자1',
			children: [
				{
					dataField: 'a46',
					headerText: '이름',
				},
				{
					dataField: 'a47',
					headerText: '전화번호',
				},
			],
		},
		{
			headerText: '보조운전자2',
			children: [
				{
					dataField: 'a48',
					headerText: '이름',
				},
				{
					dataField: 'a49',
					headerText: '전화번호',
				},
			],
		},
		{
			dataField: 'delYn',
			headerText: '삭제여부',
			labelFunction: delYnLabelFunc,
		},
		{
			dataField: 'editDate',
			headerText: '최종 변경일자',
		},
		{
			dataField: 'editWho',
			headerText: '최종 변경자',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		editBeginMode: 'doubleClick', //cell 더블클릭시 에디트 활성화 (또는 F2)
		selectionMode: 'multipleCells', //드래그하여 cell 멀티셀렉트
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		//independentAllCheckBox: true,
		// fixedColumnCount: 2,
		fillColumnSizeMode: false,
		showFooter: true,
		// 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
		showDragKnobColumn: false,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		enableDrag: false,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		enableMultipleDrag: false,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		enableDrop: false,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'carId',
			positionField: 'defDccode',
			operation: 'COUNT',
			formatString: '#,##0',
			postfix: ' rows',
		},
	];

	// 그리드 버튼
	const gridBtn = {};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	/**
	 * 그리드 셀 클릭시 상세정보 팝업 표시
	 * @param value
	 */
	// useEffect(() => {
	// 	ref.gridRef.current.bind('cellClick', function (event: any) {
	// 		//console.log(event);
	// 		getSearchApi('433532');
	// 	});
	// });

	// input data onChange Event Handler
	const onChange = (value: string) => {};

	// input data onPressEnter Event Handler
	const onPressEnter = (e: any) => {};

	/**
	 * SKU 정보 팝업 API 조회
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const getSearchApi = (value: string) => {
		const params = {
			sku: value,
		};

		apiGetSkuInfoPopup(params).then(res => {
			refModal.current?.handlerOpen();
			setSkuPopupData(res.data);
		});
	};

	/**
	 * SKU 상세조회 팝업 닫기
	 */
	const skuPopClose = () => {
		refModal.current?.handlerClose();
	};

	return (
		<>
			{/* 그리드 영역 */}

			<AGrid>
				<PageGridBtn gridBtn={gridBtn} gridTitle="차량정보목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			<CustomModal ref={refModal} width="500px">
				<CmSkuInfoPopup search={getSearchApi} data={skuPopupData} close={skuPopClose} />
			</CustomModal>
			<div style={{ height: '450px', overflow: 'scroll' }}>
				<Form form={props.form} onValuesChange={onFormChange} initialValues={initFormData} className="form-span-area">
					<h3 className="title-area-h3">차량정보</h3>
					<UiDetailTableArea>
						<UiDetailTableGroup>
							<colgroup>
								<col width={100} />
								<col />
								<col width={100} />
								<col />
							</colgroup>
							<tbody>
								<tr>
									<th>
										<label data-required>물류센터</label>
									</th>
									<td>
										<SelectBox
											name="defDccode"
											placeholder="선택해주세요"
											//options={getCommonCodeList('BBS_TP', '--- 선택 ---')}
											options={[
												{ cdNm: '[2600]이천물류센터', comCd: '2600' },
												{ cdNm: '[2620]수원물류센터', comCd: '2620' },
												{ cdNm: '[2660]동탄2물류센터', comCd: '2660' },
											]}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// onChange={}
											// required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</td>
									<th>
										<label data-required>차량소유업체</label>
									</th>
									<td>
										<InputText
											name="inputText1"
											placeholder="텍스트를 입력해주세요."
											maxLength={20}
											onChange={onChange}
											onPressEnter={onPressEnter}
											allowClear
											showCount
											required
											rules={[
												{ required: true, validateTrigger: 'none' },
												() => ({
													validator(_, value) {
														if (commUtil.isNotEmpty(value) && value.length < 3) {
															return Promise.reject(new Error('3글자 이상 입력해주세요'));
														}
														return Promise.resolve();
													},
													validateTrigger: 'none',
												}),
											]}
										/>
									</td>
								</tr>
								<tr>
									<th>
										<label>차량번호</label>
									</th>
									<td>
										<InputText
											name="carNo"
											placeholder="텍스트를 입력해주세요."
											maxLength={20}
											onChange={onChange}
											onPressEnter={onPressEnter}
											allowClear
											showCount
											disabled={props.isDisabled}
											rules={[
												{ required: true, validateTrigger: 'none' },
												() => ({
													validator(_, value) {
														const koreanReg = new RegExp(/^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/);
														if (commUtil.isNotEmpty(value) && !koreanReg.test(value)) {
															return Promise.reject(new Error('한글만 입력 가능합니다.'));
														}

														return Promise.resolve();
													},
													validateTrigger: 'none',
												}),
											]}
										/>
									</td>
									<th>
										<label>소속회사</label>
									</th>
									<td>
										<InputText
											name="inputText3"
											placeholder="텍스트를 입력해주세요."
											maxLength={20}
											onChange={onChange}
											onPressEnter={onPressEnter}
											allowClear
											showCount
										/>
									</td>
								</tr>
								<tr>
									<th>
										<label>차량ID</label>
									</th>
									<td>
										<InputText
											name="carId"
											placeholder="텍스트를 입력해주세요."
											maxLength={20}
											onChange={onChange}
											onPressEnter={onPressEnter}
											allowClear
											showCount
											disabled={props.isDisabled}
											rules={[
												{ required: true, validateTrigger: 'none' },
												() => ({
													validator(_, value) {
														const koreanReg = new RegExp(/^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/);
														if (commUtil.isNotEmpty(value) && !koreanReg.test(value)) {
															return Promise.reject(new Error('한글만 입력 가능합니다.'));
														}

														return Promise.resolve();
													},
													validateTrigger: 'none',
												}),
											]}
										/>
									</td>
									<th>
										<label>차량업체전화</label>
									</th>
									<td>
										<InputText
											name="inputText5"
											placeholder="텍스트를 입력해주세요."
											maxLength={20}
											onChange={onChange}
											onPressEnter={onPressEnter}
											allowClear
											showCount
										/>
									</td>
								</tr>
								<tr>
									<th>
										<label>차량단축번호</label>
									</th>
									<td>
										<InputText
											name="shortNo"
											placeholder="텍스트를 입력해주세요."
											maxLength={20}
											onChange={onChange}
											onPressEnter={onPressEnter}
											allowClear
											showCount
										/>
									</td>
									<th>
										<label>계약유형</label>
									</th>
									<td>
										<SelectBox
											name="contractType"
											placeholder="선택해주세요"
											options={getCommonCodeList('CONTRACTTYPE', '--- 선택 ---')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// onChange={}
											// required
											// rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</td>
								</tr>
							</tbody>
						</UiDetailTableGroup>

						<h3 className="title-area-h3">물류센터배송기준정보</h3>
						<UiDetailTableGroup>
							<colgroup>
								<col width={100} />
								<col />
								<col width={100} />
								<col />
							</colgroup>
							<tbody>
								<tr>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
								</tr>
								<tr>
									<th>
										<label data-required>코너명</label>
									</th>
									<td colSpan={3}>test</td>
								</tr>
							</tbody>
						</UiDetailTableGroup>

						<h3 className="title-area-h3">기사정보</h3>
						<UiDetailTableGroup>
							<colgroup>
								<col width={100} />
								<col />
								<col width={100} />
								<col />
								<col width={100} />
								<col />
							</colgroup>
							<tbody>
								<tr>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
								</tr>
								<tr>
									<th>
										<label data-required>코너명</label>
									</th>
									<td colSpan={5}>test</td>
								</tr>
								<tr>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
								</tr>
								<tr>
									<th>
										<label data-required>코너명</label>
									</th>
									<td colSpan={5}>test</td>
								</tr>
								<tr>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
								</tr>
								<tr>
									<th>
										<label data-required>코너명</label>
									</th>
									<td colSpan={5}>test</td>
								</tr>
								<tr>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
								</tr>
								<tr>
									<th>
										<label data-required>코너명</label>
									</th>
									<td colSpan={5}>test</td>
								</tr>
								<tr>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
								</tr>
								<tr>
									<th>
										<label data-required>코너명</label>
									</th>
									<td colSpan={5}>test</td>
								</tr>
								<tr>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
									<th>
										<label>코너코드</label>
									</th>
									<td>test</td>
								</tr>
								<tr>
									<th>
										<label data-required>코너명</label>
									</th>
									<td colSpan={5}>test</td>
								</tr>
							</tbody>
						</UiDetailTableGroup>
					</UiDetailTableArea>
				</Form>
			</div>
		</>
	);
});

export default DetailCarDriver;
