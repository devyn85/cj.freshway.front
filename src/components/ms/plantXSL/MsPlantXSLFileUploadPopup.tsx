/*
 ############################################################################
 # FiledataField	: PopupFileUploader.tsx
 # Description		: 팝업 파일 업로드
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

//Utils
import fileUtil from '@/util/fileUtils';

//component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

//API Call Function
import {
	apiFileDeleteMaster,
	apiFileDownloadMaster,
	apiFileUploadMaster,
	apiGetMasterFileList,
} from '@/api/ms/apiMsPlantXSL';

// 넘겨받은 Props 타입 정의
type popupProps = {
	serialkey: string;
	close: any;
};

const MsPlantXslFileUploadPopup = forwardRef((props: popupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { serialkey, close } = props;
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);

	const [totalSize, setTotalSize] = useState(0);
	const [totalSizeMB, setTotalSizeMB] = useState('0');

	const MAX_UPLOAD_SIZE = 31458000;

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
	 * 업로드 클릭
	 */
	function onClickFileUpload() {
		uploadFile.current.click();
	}

	/**
	 * 업로드 이벤트
	 * @param {object} event 업로드 파일 변경 이벤트
	 */
	function changeUploadEvent(event: any) {
		const files = uploadFile.current.files;
		const tmpFileList = [...fileInfoList];
		const tmpSaveList = [...saveFormData];

		for (const element of files) {
			// 사이즈 검사
			if (totalSize + element.size >= MAX_UPLOAD_SIZE) {
				showAlert('', t('msg.MSG_COM_ERR_006'));
				continue;
			}

			setTotalSize(totalSize + element.size);
			const currentFile = {
				fileTp: 'cpt',
				fileNm: element.name,
				attchFileNm: element.name,
				attchFileSz: element.size.toString(),
				attchFileExtNm: element.name.split('.')[1],
				rowStatus: 'I',
				uuid: uuidv4(),
			};

			// 임시 저장
			tmpFileList.push(currentFile);
			tmpSaveList.push(element);

			gridRef.current.addRow(currentFile, 'last');
		}

		resizingTotal();

		// 파일 리스트 저장
		setFileInfoList(tmpFileList);
		setSaveFormData(tmpSaveList);

		// 같은 파일을 재업로드할 수 있도록 이벤트 초기화
		event.target.value = '';
	}

	/**
	 * 첨부파일 삭제
	 */
	function onClickRemoveButton() {
		const selectedItem = gridRef.current.getSelectedItems()[0];
		const delSerialkey = selectedItem.item.serialkey;

		if (!delSerialkey) {
			gridRef.current.removeRow(selectedItem.rowIndex);
			setTotalSize(totalSize - Number(selectedItem.item.attchFileSz));
		} else {
			const param = {
				serialkey: delSerialkey,
			};

			apiFileDeleteMaster(param).then(res => {
				if (res.statusCode === 0) {
					showAlert('', t('msg.MSG_COM_SUC_006'), () => {
						searchFileList();
					});
				}
			});
		}
	}

	/**
	 * 파일 업로드 저장 함수
	 * @returns {void}
	 */
	function onClickSaveButton() {
		const gridList = gridRef.current.getChangedData();

		if (gridList.length == 0) {
			showAlert('', t('msg.MSG_COM_VAL_020'));
			return false;
		}
		const formDataParam = new FormData(); // 파일 전송할 form
		saveFormData.forEach(function (item: any) {
			formDataParam.append('file', item);
		});

		formDataParam.append(
			'fileInfoList',
			new Blob([JSON.stringify(gridList)], {
				type: 'application/json',
			}),
		);

		formDataParam.append('serialkey', serialkey);

		apiFileUploadMaster(formDataParam).then(res => {
			if (res.data.statusCode === 0) {
				showAlert('', t('msg.MSG_COM_SUC_003'), () => {
					// callBack(res.data, gridRef.current?.getGridData().length);
					searchFileList();
				});
			}
		});
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
			<PopupMenuTitle name={'저장위치정보 파일업로드'} showButtons={false} showChildrens={true}>
				{/* 파일업로드, 저장, 삭제 */}
				<Button onClick={onClickFileUpload}>{'파일추가'}</Button>
				<input
					ref={uploadFile}
					id="uploadInput"
					multiple
					type="file"
					style={{ display: 'none' }}
					onChange={changeUploadEvent}
				/>

				<Button onClick={onClickRemoveButton}>{'파일삭제'}</Button>
				<Button onClick={onClickSaveButton}>{'파일업로드'}</Button>
			</PopupMenuTitle>
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
export default MsPlantXslFileUploadPopup;
