/*
 ############################################################################
 # FiledataField	: MsCustBrandUploadExcelPopup.tsx
 # Description		:  본점별브랜드마스터 엑셀 업로드 팝업
 # Author			: YeoSeungCheol
 # Since			: 25.10.14
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

// API
import { apiPostSaveExcelList, apiValidateExcelList } from '@/api/ms/apiMsCustBrand';

interface PropsType {
	close?: any;
}

const MsCustBrandUploadExcelPopup = (props: PropsType) => {
	const { close } = props;
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			dataField: 'custKey',
			headerText: t('lbl.BRAND_CUSTKEY'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'custName',
			headerText: t('lbl.BRAND_CUSTNAME'),
			dataType: 'string',
		},
		{
			dataField: 'brandName',
			headerText: t('lbl.BRANDNAME'),
			dataType: 'string',
			required: true,
		},
		{
			dataField: 'reference02',
			headerText: t('lbl.FC_BRANDNAME'),
			dataType: 'string',
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	const validateGridDataWithDelay = () => {
		return new Promise(resolve => {
			setTimeout(() => {
				const isValid = gridRef.current.validateRequiredGridData();
				resolve(!!isValid);
			}, 50);
		});
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		const params = gridRef.current.getGridData();
		if (!params || params.length < 1) {
			showMessage({ content: t('msg.MSG_COM_VAL_020'), modalType: 'info' });
			return;
		}

		const isValid = await validateGridDataWithDelay();
		if (!isValid) return;
		// PK: 본점코드 + 브랜드명
		// if (!gridRef.current.validatePKGridData(['custKey', 'brandName'])) {
		// 	return;
		// }

		apiValidateExcelList(params).then((res: any) => {
			const checkColumn = [
				{ dataField: 'processYn', headerText: '체크결과' },
				{ dataField: 'processMsg', headerText: '체크메시지' },
			];
			gridRef.current.addColumn(checkColumn, 1);

			const rowsToUpdate = res.data?.data || res.data || [];
			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: number) => {
				// const isDuplicate = rowsToUpdate.some(
				// 	(r: any, i: number) => i !== index && r.custKey === row.custKey && r.brandName === row.brandName,
				// );
				const isCustKeyDuplicate = rowsToUpdate.some((r: any, i: number) => i !== index && r.custKey === row.custKey);
				let processMsg = '정상';
				let processYn = 'Y';
				if (row.custKeyChk === 'N') {
					processMsg = '본점코드가 존재하지 않습니다.';
					processYn = 'N';
				} else if (row.brandNameChk === 'N') {
					processMsg = '브랜드명이 유효하지 않습니다.';
					processYn = 'N';
				} else if (isCustKeyDuplicate) {
					processMsg = '중복된 본점 코드가 존재합니다.';
					processYn = 'N';
				}
				//  else if (isDuplicate) {
				// 	processMsg = '중복된 데이터가 존재합니다.';
				// 	processYn = 'N';
				// }

				let rowStatus = 'I';
				if (row.updateYn === 'Y') {
					rowStatus = 'U';
				}
				updateData.push({ processYn, processMsg, rowStatus });
				updateIndex.push(index);
			});

			if (updateData.length > 0) {
				gridRef.current.updateRows(updateData, updateIndex);
			}
			const uncheckedItems = gridRef.current.getGridData().filter((it: any) => it.processYn === 'N');
			const uncheckedIds = uncheckedItems.map((it: any) => it._$uid);
			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		});
	};

	const saveExcelList = () => {
		const params = gridRef.current.getCustomCheckedRowItems();
		const isProcessYN = params.some((it: any) => it.processYn !== 'Y');
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 행이 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const updateLength = params.filter((it: any) => it.rowStatus === 'U').length;
		const insertLength = params.filter((it: any) => it.rowStatus === 'I').length;
		const messageWithRowStatusCount = `${t(
			'msg.confirmSave',
		)}\n신규 : ${insertLength}건\n수정 : ${updateLength}건\n삭제 : 0건`;

		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveExcelList(params).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							close?.();
						},
					});
				}
			});
		});
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{ btnType: 'excelForm' },
			{
				btnType: 'excelSelect',
				isActionEvent: false,
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			{ btnType: 'save', callBackFn: saveExcelList },
		],
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="본점별브랜드마스터 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>

			{/* hidden input for excel selection */}
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

export default MsCustBrandUploadExcelPopup;
