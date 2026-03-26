/*
 ############################################################################
 # FiledataField	: TmClaimCarDetail.tsx
 # Description		: 클레임정보(RDC검증중)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.07
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
//types
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiGetDetailList, apiSaveMasterList, getClaimDtlList } from '@/api/tm/apiTmClaimCar';
//store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';

const TmClaimCarDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const gridId1 = uuidv4() + '_gridWrap';
	const refModal = useRef(null);
	const [dtlListCnt, setDtlListCnt] = useState(0);
	const [claimInfoList, setClaimInfoList] = useState([]);
	const [dtlList, setDtlList] = useState([]);
	const fixDcCode = Form.useWatch('fixDcCode', props.form);
	let prevRowIndex: any = null;
	/**
	 * //물류센터 공통코드 호출
	 * 공통함수 호출 ([comCd]cdNm형으로 변형)
	 * @returns
	 */
	const getCustomCommonCodeList = () => {
		const list = getCommonCodeList('WMS_MNG_DC', '');

		return list.map(item => ({
			...item,
			display: `[${item.comCd}] ${item.cdNm}`, // 새로운 display 필드 추가
		}));
	};
	const getClaimInfoLList = (rowIndex: any, columnIndex: any, value: any) => {
		// //console.log('value', value);
		// //console.log(claimInfoList);
		return claimInfoList.filter(item => item.specCode === value && item.baseCode === 'L');

		// return list;
	};
	const gridCol = [
		{ dataField: 'dcName', headerText: '물류센터', dataType: 'code', editable: false },
		{ dataField: 'vocNo', headerText: 'VOC번호', dataType: 'string', editable: false },
		{
			dataField: 'vocDt',
			headerText: '접수일자',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		},
		{ dataField: 'deliveryDt', headerText: '배송일자', dataType: 'date', editable: false },

		{ dataField: 'carNo', headerText: '차량번호', dataType: 'string', editable: false },
		// { dataField: 'dcName', headerText: '센터명', dataType: 'string', editable: false },

		{ dataField: 'custKey', headerText: '관리처코드', dataType: 'code', editable: false },
		{ dataField: 'custName', headerText: '관리처명', dataType: 'string', editable: false },
		{
			dataField: 'claimDtlIdLNm',
			headerText: 'VOC대분류',
			dataType: 'code',
			editable: false,
			// labelFunction: getClaimInfoLList,
		},
		{ dataField: 'claimDtlIdMNm', headerText: 'VOC중분류', dataType: 'code', editable: false },
		{ dataField: 'claimDtlIdSNm', headerText: 'VOC소분류', dataType: 'code', editable: false },
		{ dataField: 'claimdtlIdNm', headerText: 'VOC세분류', dataType: 'code', editable: false },
		{ dataField: 'maName', headerText: '담당MA', dataType: 'string', editable: false },
		{ dataField: 'vocName', headerText: '등록자', dataType: 'string', editable: false },
		{ dataField: 'memo', headerText: '메모', dataType: 'string', editable: false },
	];

	/**
	 * 임시 사용(추후 확정되면 수정)
	 */
	const gridCol1 = [
		{
			dataField: 'actionDate',
			headerText: '조치일시',
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// width: 200,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
		},
		{ dataField: 'actionWho', headerText: '조치자명', dataType: 'manager', editable: false },
		{ dataField: 'actionMethod', headerText: '방법', dataType: 'string', editable: false },
		{ dataField: 'actionDesc', headerText: '조치내용', dataType: 'string', editable: false },
		// { dataField: 'deliveryDt', headerText: '배송일자', dataType: 'string', editable: false },

		{ dataField: 'actionDetailDesc', headerText: '상세내역', dataType: 'string', editable: false },
		{
			dataField: 'mobileDispYn',
			headerText: '배송기사 전달',
			dataType: 'code',
			renderer: {
				type: 'CheckBoxEditRenderer',
				// showLabel: false, // 참, 거짓 텍스트 출력여부( 기본값 false )
				editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				checkValue: 'Y', // true, false 인 경우가 기본
				unCheckValue: 'N',
				// 체크박스 disabled 함수
			},
		},
		{ dataField: 'rmk', headerText: '비고', dataType: 'string', editable: true },

		{
			dataField: 'addWhoName',
			headerText: '등록자',
			width: 90,
			notBeginEventNewRowsOnPaste: true,
			dataType: 'manager',
			managerDataField: 'addWho',
			editable: false,
		},
		{ dataField: 'addDate', headerText: '등록일시', dataType: 'date', editable: false },
	];
	// 마스터 그리드 버튼 설정

	const gridProps = {
		// editable: true,
		showRowCheckColumn: true,
	};
	const gridProps1 = {
		editable: true,
		showRowCheckColumn: true,
		fillColumnSizeMode: false,
	};
	const footerLayout = [{}];
	const footerLayout1 = [{}];
	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 * @param obj
	 */
	// 사용 예시

	const keysToLowerCase = (obj: any): any => {
		if (Array.isArray(obj)) {
			return obj.map(keysToLowerCase);
		} else if (obj !== null && typeof obj === 'object') {
			return Object.keys(obj).reduce((acc: any, key: string) => {
				if (key === 'claimDiv') {
					// claimDiv는 원래대로 둔다
					acc[key] = keysToLowerCase(obj[key]);
				} else {
					acc[key.toLowerCase()] = keysToLowerCase(obj[key]);
				}
				return acc;
			}, {});
		}
		return obj;
	};
	/**
	 * 저장
	 * @returns
	 */
	const saveMaster = async () => {
		// 변경 데이터 확인
		const menus = ref.gridRef1.current.getChangedData({ validationYn: false });
		// const menus = ref.gridRef.current.getChangedData();
		if (!menus || menus.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		// validation
		if (menus.length > 0 && !ref.gridRef1.current.validateRequiredGridData()) {
			return;
		}

		const param = {
			saveList: menus,
		};
		apiSaveMasterList(param)
			.then(res => {
				if (res.statusCode === 0) {
					ref.gridRef.current.clearGridData();
					ref.gridRef1.current.clearGridData();
					props.fnCallBack(); // 저장 성공 후에만 호출
					prevRowIndex = 9999999;
					showAlert('저장', '저장되었습니다.');
				}
			})
			.catch(e => {
				showAlert('저장 결과', '저장 중 오류가 발생했습니다.');
			});
	};

	const printList = () => {
		const checkedRow = ref.gridRef.current.getCheckedRowItemsAll();

		if (!checkedRow || checkedRow.length === 0) {
			showAlert(null, '선택된 데이터가 없습니다.'); // 데이터가 없습니다.
			return;
		}
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const lowerData = keysToLowerCase(checkedRow);

			const fileNm = 'TM_Claim_List.mrd';
			const dataSet = {
				ds_report: lowerData,
			};
			const params = {
				TITLE: '클레임정보',
			};
			reportUtil.openAgentReportViewer(fileNm, dataSet, params);
		});
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'print', // 프린트
				callBackFn: printList,
			},
		],
	};

	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [{ btnType: 'save', callBackFn: saveMaster }],
	};

	const searchDtl = () => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		ref.gridRef1.current.clearGridData();

		const params = {
			...selectedRow,
			sapClaimNo: selectedRow[0].vocNo,
			fixDcCode: selectedRow[0].fixDcCode,
		};

		apiGetDetailList(params).then(res => {
			if (res.data.length > 0) {
				ref.gridRef1.current.setGridData(res.data);
				setTimeout(() => {
					const colSizeList = ref.gridRef1.current.getFitColumnSizeList(true);
					ref.gridRef1.current.setColumnSizeList(colSizeList);
				}, 500);
				// const colSizeList = ref.gridRef1.getFitColumnSizeList(true);
				// ref.gridRef1.setColumnSizeList(colSizeList);
			}
			setDtlList(res.data);
			setDtlListCnt(res.data.length);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		const gridRefCur1 = ref.gridRef1.current;
		getClaimDtlList({}).then(res => {
			setClaimInfoList(res.data);
			// setClaimInfoList([
			// 	{ commCd: null, commNm: '전체' }, // 첫 행 추가
			// 	...res.data,
			// ]);
		});
		// 사용자 목록 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function (event: any) {
			// if (event.primeCell.rowIndex === prevRowIndex) return;
			// prevRowIndex = event.primeCell.rowIndex;
			searchDtl();
		});
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				prevRowIndex = 999999;
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('vocDt', { width: 161 });
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridTitle="배송클레임내역" totalCnt={props.totalCnt} gridBtn={gridBtn} />
						</AGrid>
						<GridAutoHeight id="delivery-claim-details">
							<AUIGrid
								ref={ref.gridRef}
								name={gridId}
								columnLayout={gridCol}
								gridProps={gridProps}
								footerLayout={footerLayout}
							/>
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn totalCnt={dtlListCnt} gridBtn={gridBtn1} />
						</AGrid>
						<GridAutoHeight id="delivery-claim-details1">
							<AUIGrid
								ref={ref.gridRef1}
								name={gridId1}
								columnLayout={gridCol1}
								gridProps={gridProps1}
								footerLayout={footerLayout1}
							/>
						</GridAutoHeight>
					</>,
				]}
			/>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default TmClaimCarDetail;
