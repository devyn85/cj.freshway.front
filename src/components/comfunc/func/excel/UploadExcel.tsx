/*
 ############################################################################
 # FiledataField	: UploadExcel.tsx
 # Description		: 엑셀 업로드
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button } from 'antd';
import React from 'react';

// utils
import { showAlert } from '@/util/MessageUtil';

// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmUploadExcelPopup from '@/components/comfunc/func/excel/CmUploadExcelPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// API Call Function
import { apiPostExcelUpload } from '@/api/common/apiComfunc';

// Type
import { GridBtnPropsType } from '@/types/common';

const UploadExcel = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	//다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const uploadFile = useRef(null);
	const modalRef = useRef(null);

	const gridCol = [
		{
			headerText: '거래처 유형',
			dataField: 'custType',
		},
		{
			headerText: '고객코드',
			dataField: 'custKey',
		},
		{
			headerText: '위도',
			dataField: 'latitude',
		},
		{
			headerText: '경도',
			dataField: 'longitude',
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 파일 업로드 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.currentTarget;
		const file = (target.files as FileList)[0];

		if (file === undefined) {
			return;
		} else {
			const formData = new FormData();
			formData.append('file', file);

			const params = formData;
			apiPostExcelUpload(params).then(res => {
				if (res.statusCode == 0) {
					res.data.rowsData.map((row: any) => {
						// 엑셀 "헤더명"과 그리드 "칼럼명" 일치시 [ dataField ] 설정
						Object.keys(row).map((key: string) => {
							gridCol.map((col: any) => {
								if (key === col.headerText) {
									row[col.dataField] = row[key];
								}
							});
						});
					});
					gridRef.current.addRow(res.data.rowsData);
				} else {
					showAlert('', t('com.msg.excelUploadError'));
				}
			});
		}
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		// uploadFile.current.click();
		modalRef.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	return (
		<>
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={'엑셀업로드'}>
					<Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button>
					<input ref={uploadFile} id="uploadInput" type="file" onChange={onFileChange} style={{ display: 'none' }} />
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<CustomModal ref={modalRef} width="1000px">
				<CmUploadExcelPopup close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default UploadExcel;
