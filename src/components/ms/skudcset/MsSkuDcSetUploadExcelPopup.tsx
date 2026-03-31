/*
 ############################################################################
 # FiledataField	: MsSkuDcSetUploadExcelPopup.tsx
 # Description		: 센터상품속성 - 엑셀 업로드 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.09.01
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
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// API Call Function
//import { apiPostExcelUpload, apiPostSaveMasterList, apiPostValidateExcel } from '@/api/ms/apiMsSkuDcSet';
import { apiPostSaveMasterExcelList, apiPostValidateExcel } from '@/api/ms/apiMsSkuDcSet';

interface PropsType {
	close?: any;
}

const MsSkuDcSetUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	// 그리드 Ref
	const gridRef = useRef(null);

	// 업로드 파일 Ref
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'storerkey',
			headerText: t('lbl.STORERKEY'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKUCD'),
			dataType: 'code',
			required: true,
			// filter: {
			// 	showIcon: true,
			// },
		},
		{
			dataField: 'crossdocktype',
			headerText: t('lbl.CROSSDOCKTYPE'),
			dataType: 'code',
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('CROSSDOCKTYPE', value)?.cdNm;
			// },
			// renderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('CROSSDOCKTYPE', t('lbl.SELECT'), ''),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
		},
		{
			dataField: 'putawaytype',
			headerText: t('lbl.PUTAWAYTYPE'),
			dataType: 'code',
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('PUTAWAYTYPE', value)?.cdNm;
			// },
			// renderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('PUTAWAYTYPE', t('lbl.SELECT'), ''),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
		},
		{
			dataField: 'wharea',
			headerText: t('lbl.WHAREA'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'whareafloor',
			headerText: t('lbl.WHAREAFLOOR'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'loccategory',
			headerText: t('lbl.LOCCATEGORY'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'loclevel',
			headerText: t('lbl.LOCLEVEL'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'abc',
			headerText: t('lbl.ABC'),
			dataType: 'code',
		},
		{
			dataField: 'minpoqty',
			headerText: t('lbl.MINPOQTY'),
			dataType: 'numeric',
		},
		{
			dataField: 'targetpoqty',
			headerText: t('lbl.TARGETPOQTY'),
			dataType: 'numeric',
		},
		{
			dataField: 'effectivedate',
			headerText: t('lbl.EFFECTIVEDATE'),
			dataType: 'date',
			formatString: 'YYYY-MM-DD',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// editRenderer: {
			// 	type: 'CalendarRenderer',
			// 	onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
			// 	showExtraDays: false,
			// },
		},
		{
			dataField: 'other01',
			headerText: t('lbl.INVOICE_CRT_PRT_SEQ'),
			dataType: 'code',
		},
		{
			dataField: 'other02',
			headerText: t('lbl.ALLOCFIXTYPE'),
			dataType: 'code',
		},
		{
			dataField: 'other03',
			headerText: t('lbl.OTHER03'),
			dataType: 'code',
		},
		{
			dataField: 'other04',
			headerText: t('lbl.OTHER04'),
			dataType: 'code',
		},
		{
			dataField: 'other05',
			headerText: t('lbl.OTHER05'),
			dataType: 'code',
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			required: true,
			// editable: false,
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('STATUS_SKU', value)?.cdNm;
			// },
			// renderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('STATUS_SKU', t('lbl.SELECT'), ''),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
		},
		{
			dataField: 'smsYn',
			headerText: t('lbl.SORTER_YN'),
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('YN2', value)?.cdNm;
			// },
			// renderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('YN2', t('lbl.SELECT'), ''),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
		},
		{
			dataField: 'invoiceCrtType',
			headerText: t('lbl.INVOICE_CRT_TYPE'),
			required: true,
			width: 120,
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('INVOICE_CRT_TYPE', value)?.cdNm;
			// },
			// renderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('INVOICE_CRT_TYPE', t('lbl.SELECT'), ''),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
		},
		{
			dataField: 'cubeYn',
			headerText: t('lbl.CUBE_YN'),
			dataType: 'code',
		},
		{
			dataField: 'delYnname',
			headerText: t('lbl.DEL_YN'),
			// editable: false,
			required: true,
		},

		// {
		// 	dataField: 'delYn',
		// 	visible: false,
		// },
		// {
		// 	dataField: 'serialkey',
		// 	visible: false,
		// },
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 엑셀 업로드 버튼 클릭
	 */
	const onClickUploadExcel = () => {
		excelUploadFileRef.current.click();
	};

	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};

	/**
	 * 유효성 검증
	 * @returns {void}
	 */
	const onDataCheckClick = () => {
		// 변경 데이터 확인
		const checkedItems = gridRef.current.getGridData();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'), () => {
				return;
			});
			return;
		}

		const params = {
			saveList: checkedItems,
		};

		gridRef.current.clearGridData();

		apiPostValidateExcel(params).then((res: any) => {
			if (res.status == 200) {
				const checkColumn = [
					{
						dataField: 'processflag',
						headerText: '체크결과',
						dataType: 'code',
						editable: false,
					},
					{
						dataField: 'processmsg',
						headerText: '체크메세지',
						dataType: 'string',
						editable: false,
					},
				];
				const checkColumn2 = [
					{
						dataField: 'skuDescr',
						headerText: t('lbl.SKUNM'),
						dataType: 'string',
					},
				];
				gridRef.current.addColumn(checkColumn, 0);
				gridRef.current.addColumn(checkColumn2, 5);
				gridRef.current?.addRow(res.data.data);

				// 칼럼 사이즈 재조정
				const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				gridRef.current?.setColumnSizeList(colSizeList);
			}
		});
	};

	/**
	 * 센터상품속성 그리드에서 변경한 정보를 저장.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 파라미터
	 */
	const saveMasterList = () => {
		const checkedItems = gridRef.current.getCheckedRowItems();

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = checkedItems.some((item: any) => item.item.processflag !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const checkedItems = gridRef.current.getChangedData({ validationYn: false });

			if (!checkedItems || checkedItems.length < 1) {
				showAlert(null, t('msg.MSG_COM_VAL_010'), () => {
					return;
				});
			} else {
				const params = {
					saveList: checkedItems,
				};

				apiPostSaveMasterExcelList(params).then((res: any) => {
					if (res.data.statusCode === 0) {
						showAlert(null, t('msg.MSG_COM_SUC_003'));
					}
				});
			}
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// { // 그리드 엑셀 다운로드.
			// 	btnType: 'excelForm',
			// },
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
			// {
			// 	btnType: 'plus',
			// },
		],
	};

	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '저장품_운영_속성_관리.xlsx',
		};

		fileUtil.downloadFile(params);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="저장품운영속성 엑셀 업로드" showButtons={false} />

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

export default MsSkuDcSetUploadExcelPopup;
