// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiAGridGroup from '@/assets/styled/Container/UiAGridGroup';
import UiDetailTableGroup from '@/assets/styled/Container/UiDetailTableGroup';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiListTitleGroup from '@/assets/styled/Container/UiListTitleGroup';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { ConfigProvider, Form } from 'antd';
import koKR from 'antd/es/locale/ko_KR';

// Utils

// Store

// Component
import { InputText, SelectBox } from '@/components/common/custom/form';
import { showAlert } from '@/util/MessageUtil';

// API Call Function

const DetailZoneManager = forwardRef((props: any, ref: any) => {
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const { form, data, setChangedStatus, checkChangedStatus, saveMode } = props;
	const detailZoneManagerRef = props.detailZoneManagerRef;

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// antd Form Validation 기본 메시지를 커스터마이징 (테스트용)
	const customLocale = {
		...koKR,
		Form: {
			defaultValidateMessages: {
				required: "'${label}'은(는) 필수 입력 항목입니다.",
				types: {
					email: "'${validateLabel}' 형식이 올바르지 않습니다.",
					number: "'${validateLabel}'은(는) 숫자여야 합니다.",
				},
				string: {
					min: "'${validateLabel}'은(는) 최소 ${min}자 이상이어야 합니다.",
					max: "'${validateLabel}'은(는) 최대 ${max}자까지 가능합니다.",
				},
			},
		},
	};

	// 그리드 행 인덱스
	const rowIdxRef = useRef(0);

	/*
	### 공통코드 ###
	*/
	const storageTypeList = [
		//'STORAGETYPE_ZONE'
		{ cdNm: '실온', comCd: '10' },
		{ cdNm: '냉장', comCd: '20' },
		{ cdNm: '냉동', comCd: '30' },
		{ cdNm: '실온/냉장', comCd: '40' },
	];

	const zoneGuganList = [
		//'ZONE_GUGAN'
		{ cdNm: '1구간', comCd: '1' },
		{ cdNm: '2구간', comCd: '2' },
		{ cdNm: '3구간', comCd: '3' },
		{ cdNm: '4구간', comCd: '4' },
		{ cdNm: '5구간', comCd: '5' },
	];

	const delYNList = [
		//'DEL_YN'
		{ cdNm: 'Y', comCd: 'Y' },
		{ cdNm: 'N', comCd: 'N' },
	];

	// grid data 건수
	const [totalDataCnt, setTotalDataCnt] = useState(0);

	const initFormData = {
		serialkey: '',
		dccode: '',
		zone: '',
		description: '',
		instrategy: '',
		outstrategy: '',
		status: '',
		storagetype: '',
		zoneGugan: '',
		delYn: '',
		adddate: '',
		editdate: '',
		addwho: '',
		editwho: '',
		rowStatus: 'I',
	};

	/*
	### 상세정보 ###
	*/

	/*
	### 그리드 변수 ###
	*/
	const gridCol = [
		{
			dataField: 'serialkey',
			headerText: '일련번호',
			visible: false,
			//width: '150',
		},
		{
			dataField: 'dccode',
			headerText: '물류센터',
			//width: '150',
		},
		{
			dataField: 'zone',
			headerText: '피킹존',
			//width: '150',
		},
		{
			dataField: 'description',
			headerText: '내역',
			//width: '200',
		},
		{
			dataField: 'instrategy',
			headerText: '입고전략',
			style: 'left',
		},
		{
			dataField: 'outstrategy',
			headerText: '출고전략',
			style: 'left',
		},
		{
			dataField: 'storagetype',
			headerText: '저장유형',
		},
		{
			dataField: 'zoneGugan',
			headerText: '존구간',
			style: 'left',
		},
		{
			dataField: 'delYn',
			headerText: '삭제여부',
			style: 'left',
		},
		{
			dataField: 'status',
			headerText: '진행상태',
			style: 'left',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false, // 편집 가능 여부
		editBeginMode: 'doubleClick', //cell 더블클릭시 에디트 활성화 (또는 F2)
		//selectionMode: 'multipleCells', //드래그하여 cell 멀티셀렉트
		//showStateColumn: true, // row 편집 여부
		//enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스 컬럼 표시 여부
		//fixedColumnCount: 2,
		fillColumnSizeMode: false, // 그리드 너비에 맞춰서 열 크기 조정 여부
		showFooter: true, // 푸터 표시 여부
		//rowIdField: 'No', // 그리드에서 사용할 row id 필드명
		// 행 드래그&드랍을 도와주는 엑스트라 칼럼을 최좌측에 생성합니다.
		//showDragKnobColumn: false,
		// 드래깅 행 이동 가능 여부 (기본값 : false)
		//enableDrag: false,
		// 다수의 행을 한번에 이동 가능 여부(기본값 : true)
		//enableMultipleDrag: true,
		// 셀에서 바로  드래깅 해 이동 가능 여부 (기본값 : false) - enableDrag=true 설정이 선행
		//enableDragByCellDrag: true,
		// 드랍 가능 여부 (기본값 : true)
		//enableDrop: true,
	};

	// 그리드 상단 버튼
	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			const item = {
				menuYn: 0,
				useYn: 0,
			};
			showAlert(null, '기능 준비중입니다.');
			// ref.gridRef.current.addRow(item);
		},
		isMinus: true,
		minusFunction: function () {
			showAlert(null, '기능 준비중입니다.');
			// ref.gridRef.current.removeRow('selectedIndex');
		},
		isCopy: true,
		copyFunction: function () {
			showAlert(null, '기능 준비중입니다.');
			// const selectedRow = ref.ridRef.current.getSelectedRows();
			// if (selectedRow && selectedRow.length > 0) {
			// 	const item = selectedRow[0];
			// 	item.menuId = '';
			// 	item.regId = '';
			// 	item.regDt = '';
			// 	ref.gridRef.current.addRow(item, 'selectionDown');
			// }
		},
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'dccode',
			positionField: 'dccode',
			operation: 'COUNT',
			formatString: '#,##0',
			prefix: '총 ',
			postfix: '개',
		},
		{
			labelText: '저장유형 건수',
			positionField: 'outstrategy',
		},
		{
			dataField: 'storagetype',
			positionField: 'storagetype',
			formatString: '#,##0',
			expFunction: (columnValues: any[]) => {
				const filteredValues = columnValues.filter(val => val !== null);
				return filteredValues.length;
			},
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/*
	 * 상세정보 조회, 화면에 표시
	 */
	const searchDtl = (row: any): void => {
		setChangedStatus(false);

		if (row) {
			form.setFieldsValue({
				serialkey: row.item.serialkey || '',
				dccode: row.item.dccode || '',
				zone: row.item.zone || '',
				description: row.item.description || '',
				instrategy: row.item.instrategy || '',
				outstrategy: row.item.outstrategy || '',
				status: row.item.status || '',
				storagetype: row.item.storagetype || '',
				zoneGugan: row.item.zoneGugan || '',
				delYn: row.item.delYn || '',
				adddate: row.item.adddate || '',
				editdate: row.item.editdate || '',
				addwho: row.item.addwho || '',
				editwho: row.item.editwho || '',
				rowStatus: row.item.rowStatus || 'R',
			});
		} else {
			form.setFieldsValue(initFormData);
		}

		// setDetailData({
		// 	...{},
		// 	serialkey: row.item.serialkey || '',
		// 	dccode: row.item.dccode || '',
		// 	zone: row.item.zone || '',
		// 	description: row.item.description || '',
		// 	instrategy: row.item.instrategy || '',
		// 	outstrategy: row.item.outstrategy || '',
		// 	status: row.item.status || '',
		// 	storagetype: row.item.storagetype || '',
		// 	zoneGugan: row.item.zoneGugan || '',
		// 	delYn: row.item.delYn || '',
		// 	adddate: row.item.adddate || '',
		// 	editdate: row.item.editdate || '',
		// 	addwho: row.item.addwho || '',
		// 	editwho: row.item.editwho || '',
		// 	rowStatus: row.item.rowStatus || 'R',
		// });
	};

	// 폼 데이터 초기화
	const resetForm = (): void => {
		searchDtl(null);
	};

	// 폼 데이터 (상세정보) 변경 이벤트 핸들러
	const onFormChange = (changedValues: any, allValues: any): void => {
		setChangedStatus(true);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		// 행 변경 시 이벤트 바인딩
		gridRefCur.bind('selectionChange', (event: any) => {
			if (event.selectedItems.length > 0) {
				rowIdxRef.current = event.selectedItems[0].rowIndex; // 선택된 행의 인덱스

				if (checkChangedStatus()) {
				} else {
				}

				searchDtl(event.selectedItems[0]); // 선택된 행의 데이터를 상세 조회
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			searchDtl(null);
			gridRefCur.setGridData(data);

			if (rowIdxRef !== undefined) {
				rowIdxRef.current = saveMode === 1 ? rowIdxRef.current : 0; // 그리드에서 선택할 행의 인덱스 지정
			}

			// gridRefCur?.setRowPosition(0);  // 그리드 강제 스크롤을 실행하지 않아도 아래의 setSelectionByIndex()에서 자동으로 스크롤이 된다.
			gridRefCur.setSelectionByIndex(rowIdxRef.current);

			setTotalDataCnt(data.length);
		}
	}, [data]);

	// 부모 컴포넌트에서 상세 컴포넌트의 메서드를 호출할 수 있도록 설정
	useImperativeHandle(detailZoneManagerRef, () => ({
		resetForm,
	}));

	// 그리드 행 이동으로 인한 상세정보 변경 감지
	// useEffect(() => {
	// 	//console.log('>>>detailData copy  ', detailData);
	// 	form.setFieldsValue({
	// 		serialkey: detailData.serialkey,
	// 		dccode: detailData.dccode,
	// 		zone: detailData.zone,
	// 		description: detailData.description,
	// 		instrategy: detailData.instrategy,
	// 		outstrategy: detailData.outstrategy,
	// 		status: detailData.status,
	// 		storagetype: detailData.storagetype,
	// 		zoneGugan: detailData.zoneGugan,
	// 		delYn: detailData.delYn,
	// 		adddate: detailData.adddate,
	// 		editdate: detailData.editdate,
	// 		addwho: detailData.addwho,
	// 		editwho: detailData.editwho,
	// 	});
	// }, [detailData]);

	// input data onChange Event Handler
	// const onChange = (value: string) => {};

	// input data onPressEnter Event Handler
	// const onPressEnter = (e: any) => {};

	return (
		<>
			<ConfigProvider locale={customLocale}>
				<Form form={form} className="form" onValuesChange={onFormChange}>
					<div className="flex-wrap">
						{/* 그리드 영역 */}
						<UiListTitleGroup>
							<h3>존정보 목록</h3>
							<em>총 {totalDataCnt}건</em>
						</UiListTitleGroup>

						<UiAGridGroup>
							<AGrid>
								{/* <PageGridBtn gridBtn={gridBtn} gridTitle="존정보목록" /> */}
								<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
							</AGrid>
						</UiAGridGroup>

						{/* 상세정보 영역 */}
						<UiDetailViewArea>
							<h4>
								<span>상세 정보</span>
							</h4>
							<UiDetailTableGroup>
								<colgroup>
									<col width={100} />
									<col />
									<col width={100} />
									<col />
									<col width={100} />
									<col />
									<col width={100} />
									<col />
								</colgroup>

								<tr>
									<th>
										<label data-required>물류센터</label>
									</th>
									<td>
										<InputText name="dccode" rules={[{ required: true, validateTrigger: 'none' }]} />
									</td>

									<th>
										<label data-required>피킹존</label>
									</th>
									<td>
										<InputText name="zone" rules={[{ required: true, validateTrigger: 'none' }]} />
									</td>

									<th>
										<label data-required>저장유형</label>
									</th>
									<td>
										<SelectBox
											name="storagetype"
											placeholder="선택해주세요"
											options={storageTypeList}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// onChange={}
											// required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</td>

									<th>
										<label data-required>존구간</label>
									</th>
									<td>
										<SelectBox
											name="zoneGugan"
											validateLabel="존구간"
											placeholder="선택해주세요"
											//options={getCommonCodeList('BBS_TP', '--- 선택 ---')}
											options={zoneGuganList}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// onChange={}
											// required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</td>
								</tr>

								<tr>
									<th>
										<label data-required>내역</label>
									</th>
									<td colSpan={3}>
										<InputText name="description" />
									</td>
								</tr>

								<tr>
									<th>
										<label data-required>입고전략</label>
									</th>
									<td>
										<InputText name="instrategy" />
									</td>

									<th>
										<label data-required>출고전략</label>
									</th>
									<td>
										<InputText name="outstrategy" />
									</td>

									<th>
										<label data-required>진행상태</label>
									</th>
									<td>
										<InputText name="status" />
									</td>

									<th>
										<label data-required>삭제여부</label>
									</th>
									<td>
										<SelectBox
											name="delYn"
											//label="삭제여부"
											placeholder="선택해주세요"
											//options={getCommonCodeList('BBS_TP', '--- 선택 ---')}
											options={delYNList}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// onChange={}
											// required
											rules={[{ required: true, validateTrigger: 'none' }]}
										/>
									</td>
								</tr>

								<tr>
									<th>
										<label data-required>등록일자</label>
									</th>
									<td>
										<InputText name="adddate" readOnly />
									</td>

									<th>
										<label data-required>최종변경시간</label>
									</th>
									<td>
										<InputText name="editdate" readOnly />
									</td>

									<th>
										<label data-required>생성인</label>
									</th>
									<td>
										<InputText name="addwho" readOnly />
									</td>

									<th>
										<label data-required>최종변경자</label>
									</th>
									<td>
										<InputText name="editwho" readOnly />
									</td>
								</tr>
							</UiDetailTableGroup>
						</UiDetailViewArea>
					</div>
				</Form>
			</ConfigProvider>
		</>
	);
});

export default DetailZoneManager;
