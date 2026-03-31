import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import commUtil from '@/util/commUtil';
import { Form } from 'antd';

// Utils
import { showAlert } from '@/util/MessageUtil';

// API Call Function
import CmCarPopSearch from '@/components/cm/popup/CmCarPopSearch';
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';

const DetailSampleCarDriver = forwardRef((props: any, ref: any) => {
	ref.gridRef = useRef();

	// form data 초기화
	const initFormData = {
		inputText2: '',
		inputText3: '',
	};
	const [form] = Form.useForm();

	// form data onChange Event Handler
	const onFormChange = (changedValues: any, allValues: any) => {};
	const cmCarPopRef = useRef<any>(null);
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
			headerText: '차량번호',
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
			// labelFunction: cargoTypeLabelFunc,
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
			labelFunction: dgtYnLabelFunc,
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
		showStateColumn: true, // row 편집 여부
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

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur.bind('cellDoubleClick', function (event: any) {
				if (event.dataField === 'carId') {
					cmCarPopRef.current?.openPopup({
						gridRef: gridRefCur,
						rowIndex: event.rowIndex,
						dataField: event.dataField,
						// targetData: event.value,
					});
				}
			});
		}
	}, []);

	// input data onChange Event Handler
	const onChange = (value: string) => {};
	// const handleCarSelect = (selectedCar: any) => {
	// 	const grid = ref.gridRef.current;
	// 	// const selectedRowIndex = grid.selectRowsByRowId(); // 현재 선택된 행 인덱스
	// 	const selectedRowIndex = grid.getSelectedIndex()[0];
	// 	//console.log('selectedRowIndex', selectedRowIndex);
	// 	if (selectedRowIndex >= 0) {
	// 		//console.log('selectedCar', selectedCar);
	// 		//console.log(grid);
	// 		const item = { carId: selectedCar.code };
	// 		// grid.setCellValue(grid, selectedRowIndex, 'carId', selectedCar.code); // 🔥 셀 값 업데이트
	// 		grid.updateRow(grid, item, selectedRowIndex); // 🔥 행 업데이트
	// 	}
	// };

	// input data onPressEnter Event Handler
	const onPressEnter = (e: any) => {};

	return (
		<>
			{/* 그리드 영역 */}

			<CmCarPopSearch
				ref={cmCarPopRef} // ⭐ 외부 ref 연결
				form={form}
				name="testNm"
				code="testCd"
				returnValueFormat="code"
				isGrid={true} // ✅ true면 InputSearch 감춤
				// onSelect={handleCarSelect} // ✅ 콜백 연결
			/>
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} gridTitle="차량정보목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default DetailSampleCarDriver;
