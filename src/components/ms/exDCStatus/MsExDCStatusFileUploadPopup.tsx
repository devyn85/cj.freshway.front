/*
 ############################################################################
 # FiledataField	: MsExDCStatusFileUploadPopup.tsx
 # Description		: 팝업 파일 업로드
 # Author			: Canal Frame
 # Since			: 25.12.22
 ############################################################################
*/
// lib
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

//Utils
import fileUtil from '@/util/fileUtils';

//component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

//API Call Function
import { apiFileDownloadMaster, apiGetMasterFileList } from '@/api/ms/apiMsPlantXSL';

// 넘겨받은 Props 타입 정의
type MsExDCStatusFileUploadPopupProps = {
	serialkey: string;
};

const MsExDCStatusFileUploadPopup = forwardRef((props: MsExDCStatusFileUploadPopupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { serialkey } = props;
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);

	const [totalSize, setTotalSize] = useState(0);
	const [totalSizeMB, setTotalSizeMB] = useState('0');

	const [fileInfoList, setFileInfoList] = useState([]);
	const uploadFile = useRef(null);
	const [saveFormData, setSaveFormData] = useState([]);
	/*
	 ### 그리드 초기화 ###
	 */
	const gridCol = [
		{
			headerText: '파일명',
			dataField: 'fileNm', // fileName
			editable: false,
			width: 400,
		},
		{
			headerText: '파일크기',
			dataField: 'attchFileSz', // fileSizeBytes
			dataType: 'numeric',
			editable: false,
			width: 161,
		},
		{
			dataField: 'attchFileNm', // transFileName
			visible: false,
		},
		{
			dataField: 'attchFileExtNm', // fileExtension
			visible: false,
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
	];

	const gridProps = {
		editable: true,
		softRemoveRowMode: true,
		softRemovePolicy: 'exceptNew',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 */
	function searchFileList() {
		const param = { serialkey: serialkey };
		apiGetMasterFileList(param).then(res => {
			if (res.statusCode === 0) {
				const dataLen = res.data.length;
				gridRef.current?.setGridData(res.data);
				gridRef.current?.setSelectionByIndex(dataLen, 0);

				resizingTotal();
			}

			const colSizeList = gridRef.current?.getFitColumnSizeList(true);
			gridRef.current?.setColumnSizeList(colSizeList);
		});
	}

	/**
	 * Totalsize 재설정
	 */
	function resizingTotal() {
		const attchFileSzList = gridRef.current?.getColumnValues('attchFileSz', true);

		let sum = 0;
		attchFileSzList.forEach(function (item: number) {
			sum += Number(item);
		});

		setTotalSize(sum);
	}

	/**
	 * 파일 다운로드
	 * @param {object} event 파일 다운로드 이벤트
	 */
	function registerFileDownloadEvent(event: any) {
		const serialkey = gridRef.current.getCellValue(event.rowIndex, 'serialkey');
		const fileNm = gridRef.current.getCellValue(event.rowIndex, 'fileNm');
		const transFileNm = gridRef.current.getCellValue(event.rowIndex, 'attchFileNm');

		if (commUtil.isEmpty(serialkey)) {
			return;
		}

		const params = {
			attchFileNm: fileNm,
			saveFileNm: transFileNm,
		};

		apiFileDownloadMaster(params).then(res => {
			fileUtil.download(res);
		});
	}

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setTotalSizeMB((totalSize / 1024 / 1024).toFixed(2));
	}, [totalSize]);

	useEffect(() => {
		searchFileList();
	}, []);

	useEffect(() => {
		gridRef.current.bind('cellClick', (event: any) => {
			if (event.dataField == 'fileNm') {
				registerFileDownloadEvent(event);
			}
		});
	}, []);

	return (
		<>
			<PopupMenuTitle name={'저장위치정보 파일업로드'} showButtons={false} showChildrens={true}></PopupMenuTitle>
			{/* 그리드 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<ButtonWrap data-props="message">
				<span>총 업로드 크기: {totalSizeMB} MB</span>
				<span>※ 총 파일 제한 사이즈: 30MB, 파일명내 허용된 특수문자: ., _, -, (, ), [, ]</span>
			</ButtonWrap>
		</>
	);
});
export default MsExDCStatusFileUploadPopup;
