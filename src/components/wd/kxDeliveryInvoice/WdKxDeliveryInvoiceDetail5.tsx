/*
 ############################################################################
 # FiledataField	: WdKxDeliveryInvoiceDetail5.tsx
 # Description		: 출고 > 출고작업 > 택배송장발행(온라인) (택배기준 탭)
 # Author					: JiHoPark
 # Since					: 2025.12.26.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Util

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API

// Hooks

// lib

// type
import { GridBtnPropsType } from '@/types/common';
// asset
import { apiSaveMasterList5 } from '@/api/wd/apiKxDeliveryInvoice';
import AGrid from '@/assets/styled/AGrid/AGrid';

const WdKxDeliveryInvoiceDetail5 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, search } = props; // Antd Form

	// Declare react Ref(2/4)
	ref.gridRef = useRef();

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.STORAGETYPE'),
			/*저장조건*/ dataField: 'storagetype',
			dataType: 'code',
			editable: true,
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('STORAGETYPE', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			headerText: t('lbl.BOX_NM'),
			/*박스명*/ dataField: 'boxnm',
			dataType: 'string',
			editable: true,
			required: true,
		},
		{
			headerText: '내경(mm)' /*내경(mm)*/,
			children: [
				{
					headerText: t('lbl.LENGTH'),
					/*길이*/ dataField: 'innerLength',
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9만 입력가능
						allowPoint: false, // 소수점( . ) 도 허용할지 여부
						allowNegative: false, // 마이너스 부호(-) 허용 여부
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					},
				},
				{
					headerText: t('lbl.BOX_WIDTH'),
					/*폭*/ dataField: 'innerWidth',
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9만 입력가능
						allowPoint: false, // 소수점( . ) 도 허용할지 여부
						allowNegative: false, // 마이너스 부호(-) 허용 여부
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					},
				},
				{
					headerText: t('lbl.BOX_HEIGHT'),
					/*높이*/ dataField: 'innerHeight',
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9만 입력가능
						allowPoint: false, // 소수점( . ) 도 허용할지 여부
						allowNegative: false, // 마이너스 부호(-) 허용 여부
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					},
				},
			],
		},
		{
			headerText: t('lbl.OUT_DIAMETER') /*외경(mm)*/,
			children: [
				{
					headerText: t('lbl.LENGTH'),
					/*길이*/ dataField: 'outerLength',
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9만 입력가능
						allowPoint: false, // 소수점( . ) 도 허용할지 여부
						allowNegative: false, // 마이너스 부호(-) 허용 여부
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					},
				},
				{
					headerText: t('lbl.BOX_WIDTH'),
					/*폭*/ dataField: 'outerWidth',
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9만 입력가능
						allowPoint: false, // 소수점( . ) 도 허용할지 여부
						allowNegative: false, // 마이너스 부호(-) 허용 여부
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					},
				},
				{
					headerText: t('lbl.BOX_HEIGHT'),
					/*높이*/ dataField: 'outerHeight',
					dataType: 'numeric',
					editable: true,
					required: true,
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9만 입력가능
						allowPoint: false, // 소수점( . ) 도 허용할지 여부
						allowNegative: false, // 마이너스 부호(-) 허용 여부
						autoThousandSeparator: true, // 천단위 구분자 삽입 여부
					},
				},
			],
		},
		{
			headerText: t('lbl.UNITPRICE'),
			/*단가*/ dataField: 'price',
			dataType: 'numeric',
			editable: true,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9만 입력가능
				allowPoint: false, // 소수점( . ) 도 허용할지 여부
				allowNegative: false, // 마이너스 부호(-) 허용 여부
				autoThousandSeparator: true, // 천단위 구분자 삽입 여부
			},
		},
		{ headerText: t('내경체적(cm3)'), dataField: 'cube', dataType: 'numeric', editable: false }, // CUBE
		{
			headerText: t('lbl.USE_YN'),
			/*사용여부*/ dataField: 'useYn',
			dataType: 'code',
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN'),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			/*박스번호*/ dataField: 'boxno',
			dataType: 'code',
			editable: false,
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		isLegacyRemove: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 택배기준 저장 event
	 */
	const saveMaster = () => {
		const gridRef = ref.gridRef.current;

		const chkDataList = gridRef.getChangedData();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		gridRef.showConfirmSave(() => {
			const insertList: any[] = [];
			const updateList: any[] = [];

			chkDataList.forEach((item: any) => {
				if (commUtil.isEmpty(item.boxno)) {
					insertList.push(item);
				} else {
					updateList.push(item);
				}
			});

			const params = {
				insertMaster5: insertList,
				updateMaster5: updateList,
			};

			apiSaveMasterList5(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
			});
		});
	};

	/**
	 * 기타출고 처리 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		props.saveHandler();
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					ref.gridRef.current?.addRow({
						rowStatus: 'I', // 신규 행 상태로 설정
						useYn: 'Y',
					});
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});
	}, []);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.gridRef.current;

		if (gridRef) {
			const dataList = props.data;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref.gridRef} />
			</AGrid>
		</>
	);
});

export default WdKxDeliveryInvoiceDetail5;
