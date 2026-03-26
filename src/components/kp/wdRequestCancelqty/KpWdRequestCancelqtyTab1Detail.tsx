/*
 ############################################################################
 # FiledataField	: KpWdRequestCancelqtyTab1Detail.tsx
 # Description		: 결품대응현황(Detail)
 # Author			: 공두경
 # Since			: 25.08.07 
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { getCommonCodeList } from '@/store/core/comCodeStore';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiDelete, apiSave, apiStatusCancel, apiStoRequest } from '@/api/kp/apiKpWdRequestCancelqty';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const KpWdRequestCancelqtyTab1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 대응불가
	 */
	const onStatusCancel = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		//update 쿼리 수행
		showConfirm(null, t('msg.MSG_COM_CFM_020', ['대응불가']), () => {
			const params = {
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			apiStatusCancel(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
				}
				props.search();
			});
		});
	};

	/**
	 * 삭제
	 */
	const onDelete = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['삭제']), () => {
			const params = {
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			apiDelete(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
				}
				props.search();
			});
		});
	};

	/**
	 * 저장
	 */
	const onSave = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		if (checkedRows.some((row: any) => row.channel === '2' && row.statusCode === '65')) {
			showAlert(null, '일배상품은 누락요청을 할수 없습니다.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				saveDataList: checkedRows, // 선택된 행의 데이터
			};
			apiSave(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
				}
				props.search();
			});
		});
	};

	/**
	 * STO 요청
	 */
	const onStoRequest = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		if (checkedRows.some((row: any) => row.reqStatus === '65')) {
			showAlert(null, '이미 STO요청한 건입니다.');
			return;
		}

		if (checkedRows.some((row: any) => row.channel === '2' && row.statusCode === '65')) {
			showAlert(null, '일배상품은 누락요청을 할수 없습니다.');
			return;
		}

		if (checkedRows.some((row: any) => row.statusCode != '65')) {
			showAlert(null, '누락요청건만 STO요청이 가능합니다.');
			return;
		}

		if (checkedRows.some((row: any) => row.stoOrderqty == 0 || row.stoOrderqty == null)) {
			showAlert(null, 'STO요청수량을 입력하십시오.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['STO 요청']), () => {
			const params1 = {
				saveDataList: checkedRows, // 선택된 행의 데이터
			};
			apiSave(params1).then(() => {
				const params2 = {
					saveDataTab2List: checkedRows, // 선택된 행의 데이터
				};

				apiStoRequest(params2).then(res => {
					if (res.statusCode > -1) {
						showAlert('', '저장되었습니다');
					}
					props.search();
				});
			});
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: '대응요청시간', /*대응요청시간*/ dataField: 'inspectdt', dataType: 'code', editable: false },
		{ headerText: t('lbl.OUTDT'), /*출차예정시간*/ dataField: 'outdt', dataType: 'code', editable: false },
		{ headerText: t('lbl.OUTCARTIME'), /*출차시간*/ dataField: 'dcdeparturedt', dataType: 'code', editable: false },
		{ headerText: t('lbl.NORMAL_POP'), /*정상POP*/ dataField: 'deliverygroup', dataType: 'code', editable: false },
		{
			headerText: t('lbl.MISSPINKING_POP'),
			/*오피킹POP*/ dataField: 'dockdeliverygroup',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.LOADSCANCARNO'),
			/*상차스캔차량*/ dataField: 'loadScanCarno',
			dataType: 'code',
			editable: false,
		},
		{ headerText: t('lbl.DOCKERNO'), /*도크번호*/ dataField: 'dockerno', dataType: 'code', editable: false },
		{ headerText: t('lbl.TYPE'), /*유형*/ dataField: 'reasoncode', dataType: 'code', editable: false },
		{ headerText: t('lbl.CHANNEL_DMD'), /*저장유무*/ dataField: 'channeldescr', dataType: 'code', editable: false },
		{ headerText: t('lbl.STORAGETYPE'), /*저장조건*/ dataField: 'storagetypedescr', dataType: 'code', editable: false },
		{ headerText: t('lbl.LOC'), /*로케이션*/ dataField: 'locName', dataType: 'code', editable: false },
		{
			headerText: t('lbl.CUSTKEY_WD'),
			/*고객코드*/ dataField: 'toCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
			editable: false,
		},
		{
			headerText: t('lbl.CUSTNAME_WD'),
			/*고객명*/ dataField: 'toCustname',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			headerText: t('lbl.PARTNER_CD'),
			/*협력사코드*/ dataField: 'fromCustkey',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							custkey: e.item.toCustkey,
						},
						'cust',
					);
				},
			},
			editable: false,
		},
		{
			headerText: t('lbl.PARTNER_NAME'),
			/*협력사명*/ dataField: 'fromCustname',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
		},
		{
			headerText: t('lbl.SKUNM'),
			/*상품명*/ dataField: 'description',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			headerText: t('lbl.QTY'),
			/*수량*/ dataField: 'openqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: t('lbl.PART_RES_QTY'),
			/*일부대응수량*/ dataField: 'confirmqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
			},
		},
		{ headerText: t('lbl.UOM'), /*단위*/ dataField: 'uom', dataType: 'code', editable: false },
		{ headerText: t('lbl.CARNO'), /*차량번호*/ dataField: 'carno', dataType: 'code', editable: false },
		{
			headerText: t('lbl.RESPONSE_YN'),
			/*대응여부*/ dataField: 'statusCode',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('STATUS_REQCANCEL'),
			},
		},
		{ headerText: t('lbl.RESPONSE_WHO'), /*대응자*/ dataField: 'statusWho', dataType: 'code', editable: false },
		{ headerText: t('lbl.MEMO'), /*비고*/ dataField: 'memo', dataType: 'code' },
		{
			headerText: t('lbl.INSPECTQTY_DP'),
			/*입고검수량*/ dataField: 'inspectqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: t('lbl.MOBILE_REQQTY'), //모바일요청수량
			/*입고검수량*/ dataField: 'missOrderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: t('lbl.STO_REQQTY'), //STO요청수량
			/*입고검수량*/ dataField: 'stoOrderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return item.statusCode === '65' ? 'isEdit' : '';
			},
			editRenderer: {
				type: 'InputEditRenderer',
				//allowNegative: true, // 음수허용
				allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
			},
		},
		{
			headerText: t('lbl.STO_REQ_STATUS'),
			/*STO요청상태*/ dataField: 'reqStatusNm',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'addwhonm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'addwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{ headerText: t('lbl.ADDDATE'), dataField: 'adddate', dataType: 'date', editable: false },
		{
			dataField: 'editwhonm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{ headerText: t('lbl.EDITDATE'), dataField: 'editdate', dataType: 'date', editable: false },
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 엑셀 다운로드
	const downloadExcel = () => {
		const params = {
			fileName: '출고진행현황',
			exportWithStyle: true, // 스타일 적용 여부
			progressBar: true, // 진행바 표시 여부
		};
		ref.gridRef.current.exportToXlsxGrid(params);
	};
	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			/* 2025-12-28 FWNEXTWMS-5457 요건 삭제 */
			// {
			// 	btnType: 'btn1',
			// 	btnLabel: '대응불가', // 대응불가
			// 	callBackFn: onStatusCancel,
			// },
			{
				btnType: 'btn2',
				btnLabel: 'STO요청', // STO요청
				callBackFn: onStoRequest,
			},
			{
				btnType: 'btn3',
				btnLabel: '삭제', // 삭제
				callBackFn: onDelete,
			},
			{
				btnType: 'btn4',
				btnLabel: '저장', // 저장
				callBackFn: onSave,
			},
		],
	};

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
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'stoOrderqty') {
				return event.item.statusCode === '65';
			}
			return ['confirmqty', 'statusCode', 'memo'].includes(event.dataField);
		});
	}, []);
	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="결품대응현황 목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default KpWdRequestCancelqtyTab1Detail;
