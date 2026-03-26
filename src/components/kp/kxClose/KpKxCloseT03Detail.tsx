// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useImperativeHandle } from 'react';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import { Button, Form } from 'antd';

// Store

// API Call Function
import { apiGetKxDocDetailList, apiPostSaveDelOrderReset, apiPostSaveKxDoc } from '@/api/kp/apiKpKxClose';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import KpKxCloseDocPopup from '@/components/kp/kxClose/KpKxCloseDocPopup';

const KpKxCloseT03Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// grid Ref
	const { t } = useTranslation();
	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef();
	const [form] = Form.useForm();
	// 선택한 row state
	const [selectedRow, setSelectedRow] = useState<any>(null);
	// 문서정보 팝업용 Ref
	const refDocumentModal = useRef(null);

	// grid data
	const [totalCntDtl, setTotalCntDtl] = useState(0);

	useImperativeHandle(ref, () => ({ searchDtl2 }));

	// 문서내역 그리드 칼럼 레이아웃 설정
	const gridColMaster = [
		{ headerText: t('lbl.DOCTYPE'), dataField: 'doctype', dataType: 'text' }, // 문서유형
		{
			headerText: t('lbl.DOCNO'),
			dataField: 'docno',
			dataType: 'text',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					openPopup(e.item, 'DOCUMENTINFO');
				},
			},
		}, // 문서번호
		{ headerText: t('lbl.DOCDT'), dataField: 'docdt', dataType: 'text' }, // 문서일자
		{ headerText: t('lbl.DOCLINE'), dataField: 'docline', dataType: 'text' }, // 품목번호
		{
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			dataType: 'text',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef1.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
		}, // SKU
		{ headerText: t('lbl.UOM'), dataField: 'uom', dataType: 'text' }, // 단위
		{ headerText: t('lbl.ORDERQTY'), dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.###' }, // 주문수량
		{
			headerText: t('lbl.ORDERADJUSTQTY'),
			dataField: 'orderadjustqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 주문조정수량
		{ headerText: t('lbl.CONFIRMQTY'), dataField: 'confirmqty', dataType: 'numeric', formatString: '#,##0.###' }, // 확정수량
		{ headerText: t('lbl.STORERKEY'), dataField: 'storerkey', dataType: 'code' }, // 회사
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', dataType: 'text' }, // 물류센터
		{ headerText: t('lbl.ORGANIZE'), dataField: 'organize', dataType: 'text' }, // 창고
		{ headerText: t('lbl.PLANT'), dataField: 'plant', dataType: 'text' }, // 플랜트
		{ headerText: t('lbl.STORAGELOC'), dataField: 'storageloc', dataType: 'text' }, // 저장위치
		{
			headerText: t('lbl.STORERORDERQTY'),
			dataField: 'storerorderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 원수량
		{
			headerText: t('lbl.STORERADJUSTQTY'),
			dataField: 'storeradjustqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 고객사원주문량
		{ headerText: t('lbl.STOREROPENQTY'), dataField: 'storeropenqty', dataType: 'numeric', formatString: '#,##0.###' }, // 주문량
		{
			headerText: t('lbl.STORERCONFIRMQTY'),
			dataField: 'storerconfirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 고객실적수량
		{ headerText: t('lbl.STORERUOM'), dataField: 'storeruom', dataType: 'text' }, // 주문단위
		{ headerText: t('lbl.FACTORYPRICE'), dataField: 'factoryprice', dataType: 'numeric' }, // 단가
		{ headerText: t('lbl.PURCHASEPRICE'), dataField: 'purchaseprice', dataType: 'numeric' }, // 구매단가
		{ headerText: t('lbl.SALEPRICE'), dataField: 'saleprice', dataType: 'numeric' }, // 정가
		{ headerText: t('lbl.VAT'), dataField: 'vat', dataType: 'numeric' }, // 세액
		{ headerText: t('lbl.CHANNEL'), dataField: 'channel', dataType: 'text' }, // 배송채널
		{ headerText: t('lbl.LOTTABLE01_MFG_WO'), dataField: 'lottable01', dataType: 'text' }, // 기준일(유통,제조)
		{ headerText: t('lbl.DELIVERYDATE'), dataField: 'deliverydate', dataType: 'text' }, // 배송일자
		{ headerText: t('lbl.DEL_YN'), dataField: 'delYn', dataType: 'text' }, // 삭제여부
		{ headerText: t('lbl.STATUS'), dataField: 'status', dataType: 'text' }, // 상태
		{ headerText: t('lbl.CANCELQTY'), dataField: 'cancelqty', dataType: 'numeric', formatString: '#,##0.###' }, // 취소량
		{ headerText: t('lbl.REASONCODE'), dataField: 'reasoncode', dataType: 'text' }, // 사유코드
		{ headerText: t('lbl.REASONMSG'), dataField: 'reasonmsg', dataType: 'text' }, // 사유메시지
		{ headerText: t('lbl.WORKPROCESSCODE'), dataField: 'workprocesscode', dataType: 'text' }, // 작업프로세스코드
		{ headerText: t('lbl.ARCHIVECOP'), dataField: 'archivecop', dataType: 'text' }, // 아카이브제어
	];

	// 문서내역 그리드 속성 설정
	const gridPropsMaster = {
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	// 그룹 상세 그리드 칼럼 레이아웃 설정
	const gridColDetail = [
		{ headerText: t('lbl.DOCTYPE'), dataField: 'doctype', dataType: 'text' }, // 문서유형
		{ headerText: t('lbl.DOCNO'), dataField: 'docno', dataType: 'text' }, // 문서번호
		{ headerText: t('lbl.DOCLINE'), dataField: 'docline', dataType: 'text' }, // 품목번호
		{ headerText: t('lbl.SKU'), dataField: 'sku', dataType: 'text' }, // SKU
		{ headerText: t('lbl.UOM'), dataField: 'uom', dataType: 'text' }, // 단위
		{ headerText: t('lbl.ORDERQTY'), dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.###' }, // 주문수량
		{
			headerText: t('lbl.ORDERADJUSTQTY'),
			dataField: 'orderadjustqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 주문조정수량
		{ headerText: t('lbl.CONFIRMQTY'), dataField: 'confirmqty', dataType: 'numeric', formatString: '#,##0.###' }, // 확정수량
		{ headerText: t('lbl.STORERKEY'), dataField: 'storerkey', dataType: 'text' }, // 회사
		{ headerText: t('lbl.DCCODE'), dataField: 'dccode', dataType: 'text' }, // 물류센터
		{ headerText: t('lbl.ORGANIZE'), dataField: 'organize', dataType: 'text' }, // 창고
		{ headerText: t('lbl.PLANT'), dataField: 'plant', dataType: 'text' }, // 플랜트
		{ headerText: t('lbl.STORAGELOC'), dataField: 'storageloc', dataType: 'text' }, // 저장위치
		{
			headerText: t('lbl.STORERORDERQTY'),
			dataField: 'storerorderqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 원수량
		{
			headerText: t('lbl.STORERADJUSTQTY'),
			dataField: 'storeradjustqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 고객사원주문량
		{ headerText: t('lbl.STOREROPENQTY'), dataField: 'storeropenqty', dataType: 'numeric', formatString: '#,##0.###' }, // 주문량
		{
			headerText: t('lbl.STORERCONFIRMQTY'),
			dataField: 'storerconfirmqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 고객실적수량
		{ headerText: t('lbl.STORERUOM'), dataField: 'storeruom', dataType: 'text' }, // 주문단위
		{ headerText: t('lbl.FACTORYPRICE'), dataField: 'factoryprice', dataType: 'numeric' }, // 단가
		{ headerText: t('lbl.PURCHASEPRICE'), dataField: 'purchaseprice', dataType: 'numeric' }, // 구매단가
		{ headerText: t('lbl.SALEPRICE'), dataField: 'saleprice', dataType: 'numeric' }, // 정가
		{ headerText: t('lbl.VAT'), dataField: 'vat', dataType: 'numeric' }, // 세액
		{ headerText: t('lbl.CHANNEL'), dataField: 'channel', dataType: 'text' }, // 배송채널
		{ headerText: t('lbl.LOTTABLE01_MFG_WO'), dataField: 'lottable01', dataType: 'text' }, // 기준일(유통,제조)
		{ headerText: t('lbl.DELIVERYDATE'), dataField: 'deliverydate', dataType: 'text' }, // 배송일자
		{ headerText: t('lbl.DELETE_YN'), dataField: 'delYn', dataType: 'text' }, // 삭제여부
		{ headerText: t('lbl.IF_ID'), dataField: 'ifId', dataType: 'text' }, // IF ID
		{ headerText: t('lbl.IF_FLAG'), dataField: 'ifFlag', dataType: 'text' }, // IF 처리구분
		{ headerText: t('lbl.IF_DATE'), dataField: 'ifDate', dataType: 'text' }, // IF 일자
		{ headerText: t('lbl.IF_MEMO'), dataField: 'ifMemo', dataType: 'text' }, // IF 메모
		{ headerText: t('lbl.SLIPNO'), dataField: 'slipno', dataType: 'text' }, // 전표번호
		{ headerText: t('lbl.SLIPLINE'), dataField: 'slipline', dataType: 'text' }, // 전표라인번호
	];

	// 그룹 상세 그리드 속성 설정
	const gridPropsDetail = {
		showRowCheckColumn: true,
		// isLegacyRemove: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.ifFlag == 'Y') {
				return 'color-danger'; // CSS 클래스 이름 반환
			}
			return ''; // 조건을 만족하지 않으면 아무 스타일도 적용하지 않음
		},
	};

	// 그룹 상세 그리드 버튼 설정
	const gridBtnDetail: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * IF내역 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDtl = (rowIndex: number) => {
		ref.gridRef2.current.clearGridData();

		if (commUtil.isNotEmpty(rowIndex)) {
			const selectedRow = ref.gridRef1.current.getItemByRowIndex(rowIndex);
			if (commUtil.isNotEmpty(selectedRow) && !ref.gridRef1.current.isAddedById(selectedRow._$uid)) {
				// setSelItem(selectedRow);

				const params = {
					docno: selectedRow.docno,
					slipno: selectedRow.slipno,
				};
				apiGetKxDocDetailList(params).then(res => {
					const gridData = res.data;
					ref.gridRef2.current.setGridData(gridData);
					setTotalCntDtl(res.data.length);

					// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
					ref.gridRef2.current.setColumnSizeList(ref.gridRef2.current.getFitColumnSizeList(true));
				});
			} else {
				return;
			}
		}
	};

	/**
	 * IF내역 조회
	 * 문서내역 DATA가 없어도 IF내역 DATA 노출시켜야 함 (AS-IS와 동일하게)
	 * @param {string} docno 문서번호
	 * @returns {void}
	 */
	const searchDtl2 = (docno: string) => {
		ref.gridRef2.current.clearGridData();

		if (commUtil.isNotEmpty(docno)) {
			const params = {
				docno: docno,
			};
			apiGetKxDocDetailList(params).then(res => {
				const gridData = res.data;
				ref.gridRef2.current.setGridData(gridData);
				setTotalCntDtl(res.data.length);

				// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
				ref.gridRef2.current.setColumnSizeList(ref.gridRef2.current.getFitColumnSizeList(true));
			});
		}
	};

	// IF내역 그리드 버튼 설정
	const gridBtnMaster: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * 삭제오더초기화 버튼
	 */
	const onClickDelOrderReset = () => {
		const checkedRows = ref.gridRef1.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		if (checkedRows[0].dccode !== '1000') {
			showAlert(null, '선택한 ROW가 1000센터가 아닙니다.');
			return;
		} else if (checkedRows[0].delYn === 'N') {
			showAlert(null, `${checkedRows[0].docline}` + ' 항번은 삭제 상태가 아닙니다.');
			return;
		} else if (checkedRows[0].workprocesscode !== 'SO') {
			showAlert(null, 'SO만 처리 가능합니다.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['삭제오더초기화']), () => {
			const params = {
				reqDtoList: checkedRows,
			};
			apiPostSaveDelOrderReset(params).then(() => {
				// 콜백 처리
				if (props.search && props.search instanceof Function) {
					props.search();
				}
			});
		});
	};

	/**
	 * STO예외처리, 오더초기화, 강제결품 버튼처리
	 */

	const onClickBtnFunc = (type: any) => {
		const checkedRows = ref.gridRef1.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 강제결품 validation
		if (type === 'ORDERCLOSE') {
			if (commUtil.isEmpty(form.getFieldValue('reasoncode'))) {
				showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.REASONCODE')]));
				return;
			}
			if (commUtil.isEmpty(form.getFieldValue('reasonmsg'))) {
				showAlert(null, t('msg.MSG_COM_VAL_001', [t('lbl.REASONMSG')]));
				return;
			}
		}

		const typeInfo: Record<string, { msg: string; prType: string }> = {
			STO: { msg: 'STO예외처리', prType: 'STO_EXTSETTING' },
			ORDER: { msg: '오더초기화', prType: 'KX_ORDERRESET' },
			ORDERCLOSE: { msg: '강제결품', prType: 'KX_ORDERCLOSE' },
		};

		const { msg = '', prType = '' } = typeInfo[type] || {};

		showConfirm(null, t('msg.MSG_COM_CFM_020', [msg]), () => {
			const saveData = checkedRows.map((row: any) => row);

			// prType 필드 추가
			const requestBody = {
				saveList3: saveData,
				prType: prType,
				reasoncode: form.getFieldValue('reasoncode'),
				reasonmsg: form.getFieldValue('reasonmsg'),
			};

			apiPostSaveKxDoc(requestBody).then(() => {
				// 콜백 처리
				if (props.search && props.search instanceof Function) {
					props.search();
				}
			});
		});
	};

	/**
	 * 팝업을 열어 문서 정보를 표시한다.
	 * @param {any} item 그리드 행
	 * @param {string} type 팝업 타입
	 */
	const openPopup = (item: any, type: string) => {
		// setSelectedSerialKey(item.serialkey); // serialkey 저장
		refDocumentModal.current?.handlerOpen();
		setSelectedRow(item); // 선택한 row를 state로 저장
		// if (type === 'DOCUMENTINFO') {
		// 	// 문서 정보 팝업
		// }
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef1.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			searchDtl(0);

			// 상세 총건수 초기화
			if (props.data?.length < 1) {
				setTotalCntDtl(0);
			} else {
				gridRefCur.setColumnSizeList(gridRefCur.getFitColumnSizeList(true));
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtnMaster} gridTitle={'문서내역'} totalCnt={props.totalCnt}>
								<Form
									layout="inline"
									form={form}
									initialValues={{ reasoncode: 'I2', reasonmsg: 'KX 오더 수기정정' }}
									className="sect fin"
								>
									<li>
										<Button onClick={onClickDelOrderReset}>삭제오더초기화</Button>
									</li>
									<li>
										<Button onClick={() => onClickBtnFunc('STO')}>STO예외처리</Button>
									</li>
									<li>
										<Button onClick={() => onClickBtnFunc('ORDER')}>오더초기화</Button>
									</li>
									<li>
										<InputText name="reasoncode" style={{ width: 80 }} />
									</li>
									<li>
										<InputText name="reasonmsg" />
									</li>
									<li>
										<Button onClick={() => onClickBtnFunc('ORDERCLOSE')}> 강제결품</Button>
									</li>
								</Form>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridColMaster} gridProps={gridPropsMaster} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtnDetail} gridTitle={'IF내역'} totalCnt={totalCntDtl} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridColDetail} gridProps={gridPropsDetail} />
						</GridAutoHeight>
					</>,
				]}
			/>

			{/* 문서정보 팝업 영역 정의 */}
			<CustomModal ref={refDocumentModal} width="1200px">
				<KpKxCloseDocPopup
					// callBack={callBackDocumentPopup}
					close={() => {
						refDocumentModal.current?.handlerClose();
					}}
					// popupType={'DOCUMENTINFO'}
					ref={ref.gridRef1}
					rowData={selectedRow} // rowData로 전달
					serialkey={'1'} // 선택한 행의 serialkey를 전달
				/>
			</CustomModal>
		</>
	);
});

export default KpKxCloseT03Detail;
