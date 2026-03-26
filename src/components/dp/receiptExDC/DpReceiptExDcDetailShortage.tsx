/*
 ############################################################################
 # FiledataField	: DpReceiptExDcDetailShortage.tsx
 # Description		: 외부비축입고처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.14
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// Utils
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import { InputNumber, InputText, SelectBox } from '@/components/common/custom/form';

// API
import { apiPostSaveMasterList } from '@/api/dp/apiDpReceiptExDC';

interface DpReceiptExDcDetailShortageProps {
	gridData: any;
	searchForm: any;
	callBackFn: any;
}

const DpReceiptExDcDetailShortage = forwardRef((props: DpReceiptExDcDetailShortageProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	const user = useAppSelector(state => state.user.userInfo);

	// grid Ref
	ref.gridRef3 = useRef();

	// 그리드 컬럼 팝업용 Ref
	const refModal = useRef(null);

	// 진행상태 컬럼 표시
	const exdcAutoStatusLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('EXDC_AUTO_STATUS', value)?.cdNm;
	};

	// 구매유형 컬럼 표시
	const exdcOrderTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('EXDC_ORDERTYPE', value)?.cdNm;
	};

	// 그리드 (반려) 컬럼 설정
	const gridCol3 = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고코드
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'organizename',
			headerText: t('lbl.ORGANIZENAME'), //창고명
			editable: false,
			visible: false,
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'), //품목번호
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKUCD'), //상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), //상품명칭
			editable: false,
			dataType: 'string',
		},

		{
			dataField: 'serialinfoCfmYn',
			headerText: t('lbl.STATUS_DP'), //진행상태
			labelFunction: exdcAutoStatusLabelFunc,
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'mapkeyNo',
			headerText: t('lbl.POREQNO'), //구매요청번호
			editable: false,
			dataType: 'code',
			visible: false,
		},
		{
			dataField: 'mapkeyLine',
			visible: false,
		},
		{
			dataField: 'issueNo',
			visible: false,
		},
		{
			dataField: 'addYn',
			visible: false,
		},
		{
			dataField: 'fromCustkey',
			visible: false,
		},
		{
			dataField: 'tmpSokey',
			visible: false,
		},
		{
			dataField: 'tmpSoline',
			visible: false,
		},
		{
			dataField: 'dccode',
			visible: false,
		},
		{
			dataField: 'status',
			visible: false,
		},
		{
			headerText: t('lbl.PODOCINFO'), //구매문서정보
			visible: false,
			children: [
				{
					dataField: 'pokey',
					headerText: t('lbl.NORMAL_PONO'), //정상구매번호
					dataType: 'code',
					editable: false,
					visible: false,
				},
				{
					dataField: 'poline',
					headerText: t('lbl.LINENO'), //항번
					dataType: 'code',
					editable: false,
					visible: false,
				},
				{
					dataField: 'dpSourcekey',
					headerText: t('lbl.ADJ_PONO'), //조정구매번호
					dataType: 'code',
					editable: false,
					visible: false,
				},
			],
		},
		{
			headerText: t('lbl.PO_TAB'), //구매현황
			visible: false,
			children: [
				{
					dataField: 'exdcOrdertype',
					headerText: t('lbl.POTYPE'), //구매유형
					dataType: 'code',
					editable: false,
					visible: false,
				},
				{
					dataField: 'moveYn',
					headerText: t('lbl.MOVEYN'), //이체여부
					dataType: 'code',
					editable: false,
					visible: false,
				},
				{
					dataField: 'tempYn',
					headerText: t('lbl.TEMPWEIGHTSTATUS'), //가중량여부
					dataType: 'code',
					editable: false,
					visible: false,
				},
			],
		},
		{
			headerText: t('lbl.DTINFO'), //일자정보
			visible: false,
			children: [
				{
					dataField: 'deliverydate',
					headerText: t('lbl.DOCDT_DP'), //입고일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
					visible: false,
				},
				{
					dataField: 'docdt',
					headerText: t('lbl.CREATEDATE'), //생성일자
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
					visible: false,
				},
			],
		},
		{
			headerText: t('lbl.SKUINFO'), //상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKUCD'), //상품코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), //상품명
					editable: false,
					dataType: 'string',
				},
				{
					dataField: 'storagetypename',
					headerText: t('lbl.SAVE'), //저장
					editable: false,
					visible: false,
				},
				{
					dataField: 'org',
					headerText: t('lbl.PLACEOFORIGIN'), //원산지
					editable: false,
					visible: false,
				},
			],
		},

		{
			headerText: t('lbl.TMP_SERIALINFO'), //임시이력정보
			visible: false,
			children: [
				{
					dataField: 'serialno2',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
					editable: false,
					visible: false,
				},
				{
					dataField: 'stockid2',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
					editable: false,
					visible: false,
				},
				{
					dataField: 'convserialno2',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
					editable: false,
					visible: false,
				},
			],
		},
		{
			headerText: t('lbl.NEARDURATIONINFO'), //임시소비기한정보
			visible: false,
			children: [
				{
					dataField: 'duration2',
					headerText: t('lbl.LOTTABLE01'), //기준일(유통,제조)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
					visible: false,
				},
				{
					dataField: 'durationTerm2',
					headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
					dataType: 'code',
					editable: false,
					visible: false,
				},
				{
					dataField: 'neardurationyn2',
					headerText: t('lbl.NEARDURATIONYN2'), //소비기한임박여부
					dataType: 'code',
					editable: false,
					visible: false,
				},
			],
		},
		{
			headerText: t('lbl.TMP_QTYINFO'), //임시수량정보
			visible: false,
			children: [
				{
					dataField: 'tmpOrderqty',
					headerText: t('lbl.QTY'), //수량
					dataType: 'numeric',
					editable: false,
					visible: false,
				},
				{
					dataField: 'uom',
					headerText: t('lbl.UOM'), //단위
					dataType: 'code',
					editable: false,
					visible: false,
				},
				{
					dataField: 'tmpQcqty',
					headerText: t('lbl.BOX'), //박스
					dataType: 'numeric',
					editable: false,
					visible: false,
				},
				{
					dataField: 'qtyperbox',
					headerText: t('lbl.QTYPERBOX2'), //입수량
					dataType: 'numeric',
					editable: false,
					visible: false,
				},
			],
		},
		{
			headerText: t('lbl.ACTUALINFO'), //실제정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'stockid',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'factorydate',
					headerText: t('lbl.LOTTABLE01'), //기준일(유통,제조)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'durationTerm',
					headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'neardurationyn',
					headerText: t('lbl.NEARDURATIONYN2'), //소비기한임박여부
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'grossweight',
					headerText: t('lbl.QTY'), //수량
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'uom2',
					headerText: t('lbl.UOM'), //단위
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'ordrQty',
					headerText: t('lbl.BOX'), //박스
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'qtyperbox2',
					headerText: t('lbl.QTYPERBOX2'), //입수량
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.CUSTOMERINFO'), //고객정보
			children: [
				{
					dataField: 'tmpContractcompany',
					headerText: t('lbl.FROM_VATNO'), //고객코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'tmpContractcompanyname',
					headerText: t('lbl.FROM_VATOWNER'), //고객명
					editable: false,
				},
			],
		},
		{
			dataField: 'tmpContracttype',
			headerText: t('lbl.CONTRACTTYPE'), //계약구분
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'reference02',
			headerText: t('lbl.PAYREQDT'), //지급요청일
			dataType: 'date',
			editable: false,
			visible: false,
		},
		{
			dataField: 'receiveMemo',
			headerText: t('lbl.REQMEMO'), //요청사항
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.ATTACHFILE'), //첨부파일
			visible: false,
			children: [
				{
					dataField: 'refDocid',
					headerText: t('lbl.INTERNAL_USE'), //내부용
					dataType: 'code',
					editable: false,
					renderer: {
						type: 'ButtonRenderer',
						labelText: t('lbl.ATCHFILE'),
						onClick: (event: any) => {
							const params = {
								aprvflag: '2',
								attrid: '100',
								id: user.userNo,
								pw: user.userNo,
								mode: '1',
								doctype: '1306',
								requestno: event.item.refDocid,
								procflag: '1',
							};
							extUtil.openEdms(params);
						},
					},
				},
				{
					dataField: 'refCustDocid',
					headerText: t('lbl.EXERNAL_USE'), //외부용
					dataType: 'code',
					editable: false,
					width: 100,
					renderer: {
						type: 'ButtonRenderer',
						labelText: t('lbl.ATCHFILE'),
						onClick: (event: any) => {
							const params = {
								aprvflag: '2',
								attrid: '100',
								id: user.userNo,
								pw: user.userNo,
								mode: '1',
								doctype: '1306',
								requestno: event.item.refCustDocid,
								procflag: '1',
							};
							extUtil.openEdms(params);
						},
					},
				},
				{
					dataField: 'addDocid',
					headerText: t('lbl.ADDDOC_OTHER'), //추가서류 외
					dataType: 'code',
					editable: false,
					renderer: {
						type: 'ButtonRenderer',
						labelText: t('lbl.ATCHFILE'),
						onClick: (event: any) => {
							const params = {
								aprvflag: '2',
								attrid: '100',
								id: user.userNo,
								pw: user.userNo,
								mode: '1',
								doctype: '1306',
								requestno: event.item.addDocid,
								procflag: '1',
							};
							extUtil.openEdms(params);
						},
					},
				},
			],
		},

		{
			dataField: 'cancelrmk',
			headerText: '취소사유(영업 취소종결 사유)',
			editable: false,
			visible: false,
		},
		{
			dataField: 'reasoncode',
			headerText: '반려사유', //------------------
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('REJECT_REASON_WD', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			editable: false,
		},
		{
			dataField: 'reasonmsg',
			headerText: '확인사항',
			//	editable: true,
		},
		{
			dataField: 'createdate',
			headerText: t('lbl.CREATEDATE'), //생성일
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.CONFIRMINFO'), //확정정보
			children: [
				{
					dataField: 'cfmwho',
					headerText: t('lbl.CONFIRMWHO'), //확정자
					editable: false,
				},
				{
					dataField: 'cfmdate',
					headerText: t('lbl.CONFIRMDATE'), //확정일
					editable: false,
				},
				{
					dataField: 'lastwho',
					headerText: t('lbl.EDITWHO'), //최종수정자
					editable: false,
				},
				{
					dataField: 'lastdate',
					headerText: t('lbl.EDITDATE'), //최종수정일
					editable: false,
				},
			],
		},
	];

	// 그리드 속성을 설정
	const gridProps3 = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
		rowCheckDisabledFunction: function (rowIndex, isChecked, item) {
			if (item.realYn === 'T') {
				return false;
			}
			return true;
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택한 행에 반려사유와 확인사항을 일괄 적용한다
	 */
	const onClickApplySelect = () => {
		const checkedItems = ref.gridRef3.current?.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		const reasonCodeReject = form.getFieldValue('reasonCodeReject') ? form.getFieldValue('reasonCodeReject') : '';
		const sendMemoReject = form.getFieldValue('sendMemoReject') ? form.getFieldValue('sendMemoReject') : '';

		for (const item of checkedItems) {
			ref.gridRef3.current?.setCellValue(item.rowIndex, 'reasoncode', reasonCodeReject);
			ref.gridRef3.current?.setCellValue(item.rowIndex, 'reasonmsg', sendMemoReject);
		}
	};

	/**
	 * 그리드에서 선택된 데이터를 확인하고, 유효성 검사를 거쳐 반려를 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMasterList = async () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		let checkedItems: any[] = [];
		checkedItems = ref.gridRef3.current?.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				mapDiv: props.searchForm.getFieldValue('mapDiv'),
				cfmType: 'R',
				saveList: checkedItems,
			};

			apiPostSaveMasterList(params).then(res => {
				if (res.statusCode === 0) {
					props.callBackFn?.();
				}
			});
		});
	};

	/**
	 * 그리드 버튼 함수 설정. 상세 반려 그리드
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn3 = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef3, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn2', // 확정
					callBackFn: saveMasterList,
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 반려 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef3.current?.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'reasonmsg' || event.dataField === 'reasoncode') {
				if (event.item.serialinfoCfmYn !== '40') {
					return false;
				}
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 바인딩
	 */
	useEffect(() => {
		initEvent();
	});

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef3?.current && props.gridData) {
			ref.gridRef3.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef3.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef3.current.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData, ref.gridRef3]);

	return (
		<>
			{/* 입력 영역 정의 */}
			<Form form={form}>
				{/* 그리드 영역 정의 */}
				<AGrid>
					<GridTopBtn gridTitle={''} gridBtn={getGridBtn3()}>
						<SelectBox //결품사유
							name="reasonCodeShortage"
							label={t('lbl.REASONCODE_WD')}
							placeholder={t('msg.selectBox')}
							options={getCommonCodeList('REASONCODE_DP', '--- 선택 ---', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							showSearch
							allowClear
							span={8}
						/>
						<InputNumber //결품수량
							name="shortagetranqtyShortage"
							label={t('lbl.SHORTAGEQTY')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SHORTAGEQTY')])}
							showSearch
							allowClear
							span={4}
						/>
						<InputText //처리결과
							name="reasonmsgShortage"
							label={t('lbl.RESULTMSG')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.RESULTMSG')])}
							maxLength={100}
							showSearch
							allowClear
							span={8}
						/>

						<Button size={'small'} onClick={onClickApplySelect}>
							{t('lbl.APPLY_SELECT')}
						</Button>
					</GridTopBtn>
					<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} />
				</AGrid>

				{/* 그리드 컬럼 팝업 영역 정의 */}
				<CmSearchWrapper ref={refModal} />
			</Form>
		</>
	);
});

export default DpReceiptExDcDetailShortage;
