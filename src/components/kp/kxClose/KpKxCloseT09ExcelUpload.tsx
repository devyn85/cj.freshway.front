/*
 ############################################################################
 # FiledataField	: KpKxCloseT09ExcelUpload.tsx
 # Description		:  KX마감진행 현황 - 소유권확인 엑셀 업로드
 # Author			: Jisoo Kim
 # Since			: 26.01.15
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import GridTopBtn from '@/components/common/GridTopBtn'; // prettier-ignore
import fileUtil from '@/util/fileUtils';
interface PropsType {
	close?: any;
	save?: any;
	gridCol?: any;
	form?: any;
	// callBack?: any;
}

const KpKxCloseT06ExcelUpload = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, gridCol } = props;
	const excelUploadFileRef = useRef(null);
	const { t } = useTranslation();

	const gridRef1 = useRef(null);

	// 엑셀 업로드 동작 1. 파일선택
	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, ''); // 정합성 검사 제외 상태
	};

	/**
	 * 엑셀 업로드 버튼 클릭
	 */
	const onClickUploadExcel = () => {
		excelUploadFileRef.current.click();
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},
			{
				btnType: 'save',
				callBackFn: () => {
					const checkedItems = gridRef1.current?.getCheckedRowItems();
					const saveData = checkedItems.map((row: any) => row.item);
					const requestBody = { saveList9: saveData };
					if (!saveData || saveData.length === 0) {
						showMessage({
							content: t('msg.MSG_COM_VAL_061'), // 체크된 항목이 없습니다.
							modalType: 'info',
						});
						return;
					}
					props.save?.(requestBody);
					props.close?.();
				},
			},
		],
	};

	const gridProps = {
		editable: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={'소유권확인' + ' ' + t('lbl.EXCEL_UPLOAD')} showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
				<AUIGrid ref={gridRef1} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
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

export default KpKxCloseT06ExcelUpload;
