/*
 ############################################################################
 # FiledataField	: MsPurchaseCustUploadExcelPopup.tsx
 # Description		:  수발주정보 엑셀 업로드 팝업
 # Author			: jangjaehyun
 # Since			: 25.07.01
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetExcelUploadList, apiPostSaveExcelList } from '@/api/ms/apiMsPurchaseCust';

// Store

interface PropsType {
	close?: any;
}

const MsPurchaseCustUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			dataField: 'purchaseType',
			headerText: t('lbl.PURCHASETYPE_PO'),
			dataType: 'code',
		},
		{
			dataField: 'reference05',
			headerText: '자동생성유형',
		},
		{
			dataField: 'deliveryType',
			headerText: t('lbl.DELIVERYTYPE_PO'),
			dataType: 'code',
		},
		{
			dataField: 'dcCode',
			headerText: t('lbl.PODCCODE'),
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
		},
		{
			dataField: 'skuName',
			headerText: t('lbl.SKUNAME'),
			dataType: 'string',
		},
		{
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
		},
		{
			dataField: 'controlType',
			headerText: t('lbl.CONTROLTYPE'),
			dataType: 'code',
		},
		{
			dataField: 'fromDate',
			headerText: t('lbl.FROMDATE'),
			dataType: 'date',
		},
		{
			dataField: 'toDate',
			headerText: t('lbl.TODATE'),
			dataType: 'date',
		},
		{
			dataField: 'storageType',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
		},
		{
			dataField: 'custType',
			headerText: t('lbl.CUSTTYPE_PO'),
			dataType: 'code',
		},
		{
			dataField: 'custKey',
			headerText: t('lbl.CUSTKEY_PO'),
			dataType: 'code',
		},
		{
			dataField: 'custName',
			headerText: t('lbl.CUSTNAME_PO'),
			dataType: 'string',
		},
		{
			dataField: 'buyerKey',
			headerText: '수급담당ID',
			dataType: 'string',
		},
		{
			dataField: 'buyerKeyNm',
			headerText: t('lbl.POMDCODE'),
			dataType: 'user',
		},
		{
			dataField: 'purchaseGroup',
			headerText: t('lbl.PURCHASEGROUP'),
			dataType: 'user',
		},
		{
			dataField: 'minOrderQty',
			headerText: '최소주문수량',
			dataType: 'numeric',
		},
		{
			dataField: 'orderQtyUnit',
			headerText: '발주수량단위',
			dataType: 'numeric',
		},
		{
			dataField: 'qtyPerBox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
		},
		{
			dataField: 'layerPerPlt',
			headerText: t('lbl.LAYERPERPLT'),
			dataType: 'numeric',
		},
		{
			dataField: 'boxPerLayer',
			headerText: t('lbl.BOXPERLAYER'),
			dataType: 'numeric',
		},
		{
			dataField: 'coefficientSafety',
			headerText: t('lbl.COEFFICIENTSAFETY'),
			dataType: 'numeric',
		},
		{
			dataField: 'leadTime',
			headerText: t('lbl.LEADTIME'),
			dataType: 'numeric',
		},
		{
			dataField: 'purInterval',
			headerText: t('lbl.PURINTERVAL'),
			dataType: 'numeric',
		},
		{
			dataField: 'editReorderPoint',
			headerText: '수기재발주점',
			dataType: 'numeric',
		},
		{
			dataField: 'editStockGoal',
			headerText: '수기목표재고수량',
			dataType: 'numeric',
		},
		{
			dataField: 'reference04',
			headerText: '토요일입고가능여부',
			dataType: 'code',
		},
		{
			dataField: 'monYn',
			headerText: '월',
		},
		{
			dataField: 'tueYn',
			headerText: '화',
		},
		{
			dataField: 'wedYn',
			headerText: '수',
		},
		{
			dataField: 'thuYn',
			headerText: '목',
		},
		{
			dataField: 'friYn',
			headerText: '금',
		},
		{
			dataField: 'satYn',
			headerText: '토',
		},
		{
			dataField: 'sunYn',
			headerText: '일',
		},
		{
			dataField: 'returnType',
			headerText: t('lbl.RETURNTYPE_PO'),
			dataType: 'code',
		},
		{
			dataField: 'reference01',
			headerText: t('lbl.REFERENCE01'),
			dataType: 'string',
		},
		{
			dataField: 'reference02',
			headerText: t('lbl.REFERENCE02'),
			dataType: 'string',
		},
		{
			dataField: 'reference03',
			headerText: t('lbl.REFERENCE03'),
			dataType: 'string',
		},
		{
			dataField: 'reference06',
			headerText: t('lbl.REFERENCE04'),
			dataType: 'string',
		},
		{
			dataField: 'route',
			headerText: t('lbl.ROUTE_PO'),
			dataType: 'code',
		},
		{
			dataField: 'routeOrganize',
			headerText: t('lbl.ROUTEORGANIZE'),
			dataType: 'code',
		},
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
		},
		{
			dataField: 'serialYn',
			headerText: t('lbl.SERIALYN'),
			dataType: 'code',
		},
		{
			dataField: 'line01',
			headerText: '비정량여부',
			dataType: 'code',
		},
		{
			dataField: 'moqVender',
			headerText: 'MOQ(업체단위)',
			dataType: 'numeric',
		},
		{
			dataField: 'exhaustionStopYn',
			headerText: '소진후중단',
		},
		{
			dataField: 'reference07',
			headerText: '키맨번호',
			dataType: 'string',
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 엑셀 데이터 세팅 후 필수값 체크를 위한 delay
	 * 지정된 지연 시간 후 그리드 유효성 검사를 수행하고 결과를 Promise로 반환
	 * @returns {Promise<boolean>} 유효성 검사 결과 (true/false)
	 */
	const validateGridDataWithDelay = () => {
		return new Promise(resolve => {
			// AUIGrid가 데이터 처리를 완료할 지연 시간 설정
			setTimeout(() => {
				// 유효성 검사 로직 호출
				const isValid = gridRef.current.validateRequiredGridData();
				// 검사 결과를 Promise의 resolve를 통해 반환
				resolve(isValid);
			}, 50);
		});
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		return;
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveExcelList = () => {
		const columnLayout = gridRef.current.getColumnLayout();
		const columnsToRemove = ['processYn', 'processMsg'];
		const newColumnLayout = columnLayout.filter((col: any) => !columnsToRemove.includes(col.dataField));

		// 컬럼 레이아웃이 변경되었을 경우에만 setColumns 호출하여 불필요한 리렌더링을 방지.
		if (columnLayout.length !== newColumnLayout.length) {
			gridRef.current.changeColumnLayout(newColumnLayout);
		}

		const params = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
		신규 및 수정 : ${params.length}건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveExcelList(params).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							const params = {};
							apiGetExcelUploadList(params).then(res => {
								if (res.statusCode > -1) {
									const checkColumn = [
										{
											dataField: 'processYn',
											headerText: '체크결과',
											dataType: 'code',
										},
										{
											dataField: 'processMsg',
											headerText: '체크메시지',
										},
									];
									gridRef.current.addColumn(checkColumn, 0);
									gridRef.current.setGridData(res.data);
								}
							});
						},
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			// {
			// 	btnType: 'excelDownload', // 엑셀다운로드
			// 	btnLabel: '양식다운로드',
			// },
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
		],
	};

	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '수발주_정보.xlsx',
		};

		fileUtil.downloadFile(params);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	/**
	 * 다운로드용 샘플 데이터 추가
	 */
	useEffect(() => {
		gridRef.current.setGridData([
			{
				dcCode: '',
				sku: '',
			},
		]);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="수발주정보 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					{/* "양식 다운로드"를 gridBtn으로 넘기지 않고 버튼으로 추가 */}
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default MsPurchaseCustUploadExcelPopup;
