/*
 ############################################################################
 # FiledataField	: SysManualUploadPopup.tsx
 # Description		: 매뉴얼 파일 팝업 업로드
 # Author			: JGS
 # Since			: 26.01.29
 ############################################################################
*/
// lib
import { Button, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

//component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

//API Call Function
import { apiGetCmFileUploadList } from '@/api/cm/apiCmFileUpload';
import { apiPostManualSaveFile } from '@/api/sys/apiSysManual';

// 넘겨받은 Props 타입 정의
type popupProps = {
	callBack: any;
	popUpParams?: any; // 팝업에 전달할 파라미터
};

const SysManualUploadPopup = forwardRef((props: popupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, popUpParams } = props;
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);

	const [totalSize, setTotalSize] = useState(0);
	const [totalSizeMB, setTotalSizeMB] = useState('0');

	const MAX_UPLOAD_SIZE = 31458000;

	const [fileInfoList, setFileInfoList] = useState([]);
	const uploadFile = useRef(null);
	const [saveFormData, setSaveFormData] = useState([]);
	const [form] = Form.useForm();

	const manualTypecdList = [
		{ comCd: '1', cdNm: '공통기능 매뉴얼' },
		{ comCd: '2', cdNm: '배송기사 앱 매뉴얼' },
		{ comCd: '3', cdNm: '물류센터 앱 매뉴얼' },
	];

	/*
	 ### 그리드 초기화 ###
	 */
	const gridCol = [
		{
			headerText: t('lbl.FILENAME'),
			dataField: 'sourceFileNm',
			editable: false,
			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: function () {
					// ...
				},
			},
		},
		{
			headerText: t('lbl.FILE_SIZE'),
			dataField: 'fileSize',
			dataType: 'numeric',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return `${(value / 1024 / 1024).toFixed(2)} MB`;
			},
		},
		{
			headerText: 'comfunc.filepage.grid.attchFileExtNm',
			dataField: 'attchFileExtNm',
			visible: false,
		},
		{
			dataField: 'uploadedFileNm',
			visible: false,
		},
	];

	const gridCol2 = [
		{
			headerText: t('매뉴얼 구분'),
			dataField: 'fileSeq',
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: manualTypecdList,
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					return commUtil.isNotEmpty(item?.uploadedFileNm);
				},
			},
		},
		...gridCol,
	];

	const gridProps = {
		editable: true,
		softRemoveRowMode: true,
		softRemovePolicy: 'exceptNew',
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * Totalsize 재설정
	 */
	function resizingTotal() {
		const attchFileSzList = gridRef.current.getColumnValues('fileSize', true);
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
		if (popUpParams?.progCd !== 'WM10' && gridRef.current.getRowCount() > 0) {
			// 업무화면 매뉴얼 업로드 파일 갯수는 1개로 제한
			showAlert('', t('msg.exceedMaxUploadFileNumber', ['1']));
		} else {
			uploadFile.current.click();
		}
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
				sourceFileNm: element.name,
				fileSize: element.size.toString(),
				attchFileGrpNo: popUpParams?.progCd,
				attchFileNm: element.name,
				attchFileSz: element.size.toString(),
				attchFileExtNm: element.name.split('.')[1],
				rowStatus: 'I',
				uuid: uuidv4(),
			};

			const pdfRegex = /^[^\/]+\.pdf$/i;
			if (!pdfRegex.test(element.name)) {
				showAlert('', t('PDF 확장자만 업로드 가능합니다.'));
				return false;
			}

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
		const selectedItem = gridRef.current.getCheckedRowItems();

		if (selectedItem.length < 1) return;

		selectedItem.reverse().map((item: any) => {
			const deleted = item.item;
			gridRef.current.removeRow(item.rowIndex);

			setTotalSize(totalSize - Number(deleted.attchFileSz));
		});
	}

	/**
	 * 파일 업로드 저장 함수
	 * @returns {void}
	 */
	function onClickSaveButton() {
		const gridList = gridRef.current.getChangedData({ validationYn: false });

		if (gridList?.length == 0) {
			showAlert('', t('msg.MSG_COM_VAL_020'));
			return false;
		}

		// validation
		if (!gridRef.current?.validateRequiredGridData()) {
			return;
		}

		// PK validation
		if (!gridRef.current.validatePKGridData(['fileSeq'])) {
			return;
		}

		// 파일 전송할 form
		const formDataParam = new FormData();

		// 저장 DATA 추가
		const params = {
			progCd: popUpParams?.progCd,
		};
		formDataParam.append(
			'params',
			new Blob([JSON.stringify(params)], {
				type: 'application/json',
			}),
		);

		// 파일 추가
		saveFormData.forEach(function (item: any) {
			formDataParam.append('file', item);
		});

		// 파일 정보 추가
		formDataParam.append(
			'fileInfoList',
			new Blob([JSON.stringify(gridList)], {
				type: 'application/json',
			}),
		);

		gridRef.current.showConfirmSave(() => {
			apiPostManualSaveFile(formDataParam).then(res => {
				if (res.data.statusCode === 0) {
					searchFileList();
					callBack(res.data);
				}
			});
		});
	}

	/**
	 * 파일 다운로드
	 * @param {object} event 파일 다운로드 이벤트
	 */
	function fileDownloadEvent(event: any) {
		const refKey = gridRef.current.getCellValue(event.rowIndex, 'refKey');
		const saveFileNm = gridRef.current.getCellValue(event.rowIndex, 'sourceFileNm');
		const savePathNm = gridRef.current.getCellValue(event.rowIndex, 'uploadedDirPath');
		const attchFileNm = gridRef.current.getCellValue(event.rowIndex, 'uploadedFileNm');

		if (commUtil.isEmpty(refKey)) {
			return;
		}

		const params = {
			dirType: 'savePath',
			saveFileNm: saveFileNm,
			savePathNm: savePathNm,
			attchFileNm: attchFileNm,
			drmUseYn: 'Y',
		};
		fileUtils.downloadFile(params);
	}

	/**
	 * 파일 조회
	 */
	function searchFileList() {
		const params = {
			type: 'Manual',
			refKey: popUpParams?.progCd,
		};
		apiGetCmFileUploadList(params).then(res => {
			if (res.statusCode === 0) {
				const dataLen = res.data.length;
				gridRef.current?.setGridData(res.data);
				gridRef.current?.setSelectionByIndex(dataLen, 0);

				resizingTotal();

				const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				gridRef.current?.setColumnSizeList(colSizeList);
			}
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

		gridRef.current.bind('cellClick', (event: any) => {
			if (event.dataField == 'sourceFileNm') {
				fileDownloadEvent(event);
			}
		});
	}, []);

	return (
		<SearchForm form={form}>
			<PopupMenuTitle name={'매뉴얼 파일 업로드'} showButtons={false} showChildrens={true}>
				<div className="flex1">
					<span className="msg">※ PDF 확장자만 업로드 가능합니다.</span>
				</div>
				{/* <Button onClick={onClickFileDownload}>{'파일다운로드'}</Button> */}
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
				<Button type={'primary'} onClick={onClickSaveButton}>
					{'저장'}
				</Button>
			</PopupMenuTitle>
			{/* 그리드 */}
			<AGrid>
				<AUIGrid
					ref={gridRef}
					columnLayout={popUpParams?.progCd === 'WM10' ? gridCol2 : gridCol}
					gridProps={gridProps}
				/>
			</AGrid>
			<ButtonWrap data-props="message">
				<span>총 업로드 크기: {totalSizeMB} MB</span>
			</ButtonWrap>
		</SearchForm>
	);
});
export default SysManualUploadPopup;
