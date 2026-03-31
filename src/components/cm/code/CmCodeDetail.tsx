// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API
import { apiGetCmCodeDetailList, apiPostSaveCmDtlCode, apiPostSaveCmGrpCode } from '@/api/cm/apiCmCode';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const CmCodeDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// props 초기화
	const { form } = props;

	// grid data
	const [totalCntDtl, setTotalCntDtl] = useState(0);
	const [selItem, setSelItem] = useState<any>({});

	// grid Ref
	ref.gridRefGrp = useRef();
	ref.gridRefDtl = useRef();

	// 그룹 코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			headerText: t('lbl.STORERKEY'),
			dataField: 'storerkey',
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (commUtil.isNotEmpty(item.serialkey)) {
					// 편집 가능 class 삭제
					ref.gridRefGrp.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.CODELIST'),
			dataField: 'basecode',
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (commUtil.isNotEmpty(item.serialkey)) {
					// 편집 가능 class 삭제
					ref.gridRefGrp.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
			editRenderer: {
				type: 'InputEditRenderer',
				autoUpperCase: true,
			},
		},
		{
			headerText: t('lbl.BASEDESCR'),
			dataField: 'basedescr',
			required: true,
		},
		{
			headerText: 'DATA1',
			dataField: 'data1',
		},
		{
			headerText: 'DATA2',
			dataField: 'data2',
		},
		{
			headerText: 'DATA3',
			dataField: 'data3',
		},
		{
			dataField: 'status',
			visible: false,
		},
		{
			headerText: t('lbl.DEL_YN'),
			dataField: 'delYn',
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN')?.filter((code: any) => code.comCd !== 'R' && code.comCd !== 'H'),
			},
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
	];

	// 그룹 코드 그리드 속성 설정
	const gridProps = {
		editable: true,
		// showRowCheckColumn: true,
		fillColumnSizeMode: true,
		showCustomRowCheckColumn: true,
	};

	// 상세 코드 그리드 칼럼 레이아웃 설정
	const gridColDtl = [
		{
			headerText: t('lbl.STORERKEY'),
			dataField: 'storerkey',
			required: true,
			editable: false,
		},
		{
			headerText: t('lbl.CODELIST'),
			dataType: 'code',
			dataField: 'codelist',
			required: true,
			editable: false,
		},
		{
			headerText: t('lbl.SEQNO'),
			dataType: 'numeric',
			dataField: 'seqno',
			required: true,
		},
		{
			headerText: t('lbl.BASECODE'),
			dataType: 'code',
			dataField: 'basecode',
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				autoUpperCase: true,
			},
		},
		{
			headerText: t('lbl.BASEDESCR'),
			dataField: 'basedescr',
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				autoUpperCase: true,
			},
		},
		{
			headerText: t('lbl.CONVCODE'),
			dataField: 'convcode',
		},
		{
			headerText: t('lbl.CONVDESCR'),
			dataField: 'convdescr',
		},
		{
			headerText: 'DATA1',
			dataField: 'data1',
		},
		{
			headerText: 'DATA2',
			dataField: 'data2',
		},
		{
			headerText: 'DATA3',
			dataField: 'data3',
		},
		{
			headerText: 'DATA4',
			dataField: 'data4',
		},
		{
			dataField: 'status',
			visible: false,
		},
		{
			headerText: t('lbl.DEL_YN'),
			dataField: 'delYn',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN')?.filter((code: any) => code.comCd !== 'R' && code.comCd !== 'H'),
			},
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
	];

	// 상세 코드 그리드 속성 설정
	const gridPropsDtl = {
		editable: true,
		// showRowCheckColumn: true,
		fillColumnSizeMode: true,
		showCustomRowCheckColumn: true,
		// customRowCheckColumnDataField: 'chk',
		// customRowCheckColumnCheckValue: '1',
		// customRowCheckColumnUnCheckValue: '0',
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 코드 상세 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDtl = (rowIndex: number) => {
		ref.gridRefDtl.current.clearGridData();

		if (commUtil.isNotEmpty(rowIndex)) {
			const selectedRow = ref.gridRefGrp.current.getItemByRowIndex(rowIndex);
			if (commUtil.isNotEmpty(selectedRow) && !ref.gridRefGrp.current.isAddedById(selectedRow._$uid)) {
				setSelItem(selectedRow);

				const params = {
					...form.getFieldsValue(),
					storerkey: selectedRow.storerkey,
					codelist: selectedRow.basecode,
				};
				apiGetCmCodeDetailList(params).then(res => {
					const gridData = res.data;
					ref.gridRefDtl.current.setGridData(gridData);
					setTotalCntDtl(res.data.length);

					// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
					ref.gridRefDtl.current.setColumnSizeList(ref.gridRefDtl.current.getFitColumnSizeList(true));
				});
			} else {
				return;
			}
		}
	};

	/**
	 * 그룹 코드 저장
	 * @returns {void}
	 */
	const saveGrpCode = () => {
		// 변경 데이터 확인
		const codeGrpList = ref.gridRefGrp.current.getChangedData({ validationYn: false });
		if (!codeGrpList || codeGrpList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!ref.gridRefGrp.current.validateRequiredGridData()) {
			return;
		}

		// PK validation
		if (!ref.gridRefGrp.current.validatePKGridData(['storerkey', 'basecode'])) {
			return;
		}

		ref.gridRefGrp.current.showConfirmSave(() => {
			const params = {
				codeGrpList: codeGrpList,
			};
			apiPostSaveCmGrpCode(params).then(() => {
				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * 상세 코드 저장
	 * @returns {void}
	 */
	const saveCmDtlCode = () => {
		// 변경 데이터 확인
		const codeDtlList = ref.gridRefDtl.current.getChangedData({ validationYn: false });
		if (!codeDtlList || codeDtlList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!ref.gridRefDtl.current.validateRequiredGridData()) {
			return;
		}

		// PK validation
		if (!ref.gridRefDtl.current.validatePKGridData(['storerkey', 'basecode'])) {
			return;
		}

		ref.gridRefDtl.current.showConfirmSave(() => {
			const params = {
				codeDtlList: codeDtlList,
			};
			apiPostSaveCmDtlCode(params).then(() => {
				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					props.callBackFn();
				}
			});
		});
	};

	// 그룹 코드 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRefGrp, // 타겟 그리드 Ref
		btnArr:
			props.codelistDisabled === true
				? []
				: [
						{
							btnType: 'plus', // 행추가
							initValues: {
								storerkey: 'FW00',
								status: '90',
								delYn: 'N',
							},
						},
						{
							btnType: 'delete', // 행삭제
						},
						{
							btnType: 'save', // 저장
							callBackFn: saveGrpCode,
						},
				  ],
	};

	// 상세 코드 그리드 버튼 설정
	const gridBtnDtl: GridBtnPropsType = {
		tGridRef: ref.gridRefDtl, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					storerkey: selItem.storerkey,
					codelist: selItem.basecode,
					status: '90',
					delYn: 'N',
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCmDtlCode,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	let prevRowIndex: any = null;
	useEffect(() => {
		const gridRefCur = ref.gridRefGrp.current;

		// 그룹 코드 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			searchDtl(event.primeCell.rowIndex);
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRefGrp.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			searchDtl(0);

			// 상세 총건수 초기화
			if (props.data?.length < 1) {
				setTotalCntDtl(0);
			}
		}
	}, [props.data]);

	// 그룹코드 '회사', '코드리스트' 수정 방지
	useEffect(() => {
		// 에디팅 시작 이벤트 바인딩
		ref.gridRefGrp.current.bind('cellEditBegin', function (event: any) {
			// '회사', '코드리스트' 신규행만 수정 가능
			if (event.dataField == 'storerkey' || event.dataField == 'basecode') {
				return commUtil.isEmpty(event.item['serialkey']);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRefGrp?.current?.resize?.('100%', '100%');
		ref.gridBtnDtl?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			direction="vertical"
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<>
					<AGrid>
						<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
					</AGrid>
					<GridAutoHeight id="cmCode-grid">
						<AUIGrid ref={ref.gridRefGrp} columnLayout={gridCol} gridProps={gridProps} />
					</GridAutoHeight>
				</>,
				<>
					<AGrid>
						<GridTopBtn gridBtn={gridBtnDtl} gridTitle={t('lbl.DETAIL')} totalCnt={totalCntDtl} />
					</AGrid>
					<GridAutoHeight id="cmCode-detail-grid">
						<AUIGrid ref={ref.gridRefDtl} columnLayout={gridColDtl} gridProps={gridPropsDtl} />
					</GridAutoHeight>
				</>,
			]}
		/>
	);
});

export default CmCodeDetail;
