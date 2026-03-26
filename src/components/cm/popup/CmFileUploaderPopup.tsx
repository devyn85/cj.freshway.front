/*
 ############################################################################
 # FiledataField	: PopupFileUploader.tsx
 # Description		: 팝업 파일 업로드
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button, Image } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

//Utils
import commUtil from '@/util/commUtil';
import dataRegex from '@/util/dataRegex';
import { showAlert } from '@/util/MessageUtil';

//component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

//API Call Function
import { apiGetAttchFileList, apiPostDownloadFile } from '@/api/common/apiComfunc';
import { apiPostSaveFile } from '@/api/ms/apiMsCarDriver';

// 넘겨받은 Props 타입 정의
type popupProps = {
	callBack: any;
	paramAttchFileGrpNo?: string;
};

const CmFileUploaderPopup = forwardRef((props: popupProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, paramAttchFileGrpNo } = props;
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);

	const [attchFileGrpNo, setAttchFileGrpNo] = useState(paramAttchFileGrpNo || '');

	const [totalSize, setTotalSize] = useState(0);
	const [totalSizeMB, setTotalSizeMB] = useState('0');

	const MAX_UPLOAD_SIZE = 31458000;

	const [fileTpCd, setFileTpCd] = useState('');
	const [fileInfoList, setFileInfoList] = useState([]);
	const [previewImage, setPreviewImage] = useState('');
	const uploadFile = useRef(null);
	const [saveFormData, setSaveFormData] = useState([]);

	/*
	 ### 그리드 초기화 ###
	 */
	const gridCol = [
		{
			headerText: '파일명',
			dataField: 'attchFileNm',
			editable: false,
		},
		{
			headerText: '파일크기',
			dataField: 'attchFileSz',
			dataType: 'numeric',
			editable: false,
		},
		{
			headerText: t('comfunc.filepage.grid.attchFileNo'),
			dataField: 'attchFileNo',
			visible: false,
		},
		{
			headerText: 'comfunc.filepage.grid.attchFileExtNm',
			dataField: 'attchFileExtNm',
			visible: false,
		},
	];

	const gridProps = {
		editable: true,
		softRemoveRowMode: true,
		softRemovePolicy: 'exceptNew',

		// showStateColumn: false,
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
		const attchFileSzList = gridRef.current.getColumnValues('attchFileSz', true);
		let sum = 0;
		attchFileSzList.forEach(function (item: number) {
			sum += Number(item);
		});

		setTotalSize(sum);
	}
	/**
	 * 첨부파일 목록 조회
	 */
	function getAttchFileList() {
		gridRef.current.clearGridData();
		if (commUtil.isEmpty(attchFileGrpNo)) return;

		const params = { attchFileGrpNo: attchFileGrpNo };

		apiGetAttchFileList(params).then(res => {
			if (res.data.length > 0) {
				const gridData = res.data;
				gridRef.current.setGridData(gridData);
				setFileTpCd(gridData[0].fileTpCd);
			}
			resizingTotal();
		});
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

		for (let idx = 0; idx < files.length; idx++) {
			//사이즈 검사
			if (totalSize + files[idx].size >= MAX_UPLOAD_SIZE) {
				showAlert('', t('comfunc.filepage.msg.exceedMaxSize'));
				continue;
			}

			setTotalSize(totalSize + files[idx].size);
			const currentFile = {
				fileTp: 'cpt',
				fileTpCd: fileTpCd,
				attchFileNm: files[idx].name,
				attchFileSz: files[idx].size.toString(),
				attchFileExtNm: files[idx].name.split('.')[1],
				attchFileGrpNo: attchFileGrpNo,
				rowStatus: 'I',
				uuid: uuidv4(),
			};
			// 임시 저장
			tmpFileList.push(currentFile);
			tmpSaveList.push(files[idx]);

			gridRef.current.addRow(currentFile, 'last');
		}

		resizingTotal();

		// 파일 리스트 저장
		setFileInfoList(tmpFileList);
		setSaveFormData(tmpSaveList);

		// preview 마지막 파일
		const lastFile = files[files.length - 1];
		if (dataRegex.isImage(lastFile.name)) {
			setPreviewImage(window.URL.createObjectURL(lastFile));
		}

		// 같은 파일을 재업로드할 수 있도록 이벤트 초기화
		event.target.value = '';
	}

	/**
	 * 첨부파일 삭제
	 */
	function onClickRemoveButton() {
		const selectedItem = gridRef.current.getSelectedItems()[0];
		const deleted = selectedItem.item;
		gridRef.current.removeRow(selectedItem.rowIndex);

		setPreviewImage('');
		setTotalSize(totalSize - Number(deleted.attchFileSz));
	}

	/**
	 * 변경사항 저장
	 */

	/**
	 * 파일 업로드 저장 함수
	 * @returns {void}
	 */
	function onClickSaveButton() {
		const gridList = gridRef.current.getChangedData();

		if (gridList.length == 0) {
			showAlert('', t('com.msg.noChange'));
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

		apiPostSaveFile(formDataParam).then(res => {
			// TO-DO 오류 발생에 대한 처리 필요(w/ API)
			showAlert('', t('com.msg.confirmSaved'), () => {
				setAttchFileGrpNo(res.data.attchFileGrpNo);
				// onclose(res.data.attchFileGrpNo);
				callBack(res.data.attchFileGrpNo);
			});
		});
	}

	/**
	 * 파일 다운로드
	 * @param {object} event 파일 다운로드 이벤트
	 */
	function registerFileDownloadEvent(event: any) {
		const currentAttchFileNo = gridRef.current.getCellValue(event.rowIndex, 'attchFileNo');

		// TO-DO 다국어 등록. <template> 영역도 다국어
		// 업로드 대기열에 있는 경우
		if (commUtil.isEmpty(currentAttchFileNo)) {
			showAlert('', '업로드가 완료되지않았습니다.');
			return;
		}
		const params = {
			attchFileGrpNo: attchFileGrpNo,
			attchFileNo: currentAttchFileNo,
		};
		apiPostDownloadFile(params).then(res => {
			const fileName = dataRegex.decodeDisposition(res.headers['content-disposition']);
			const download = window.URL.createObjectURL(new Blob([res.data]));
			const fileLink = document.createElement('a');
			fileLink.href = download;
			fileLink.setAttribute('download', fileName);
			document.body.appendChild(fileLink);
			fileLink.click();
			fileLink.remove();
		});
	}
	/**
	 * 선택한 파일이 이미지인 경우 미리보기 세팅
	 * @param {object} event 파일 선택 변경 이벤트
	 */
	const registerRowSelectEvent = (event: any) => {
		if (!dataRegex.isImage(gridRef.current.getCellValue(event.rowIndex, 'attchFileExtNm'))) {
			setPreviewImage('');
			return;
		}

		// 0. 업로드 대기열에 있는지 확인
		const previewNm = event.item.attchFileNm;
		const previewFile = saveFormData.find(file => {
			return file.name == previewNm;
		});
		if (previewFile) {
			// 1. 업로드 대기열에 있는 경우 미리보기
			setPreviewImage(window.URL.createObjectURL(previewFile));
		} else {
			// 이미 업로드 된 파일인 경우
			const params = {
				attchFileGrpNo: attchFileGrpNo,
				attchFileNo: event.item.attchFileNo,
			};

			apiPostDownloadFile(params).then(res => {
				const download = window.URL.createObjectURL(new Blob([res.data]));
				setPreviewImage(download);
			});
		}
	};

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
		getAttchFileList();
	}, []);

	useEffect(() => {
		gridRef.current.bind('cellClick', (event: any) => {
			if (event.dataField == 'downloadFile') {
				registerFileDownloadEvent(event);
			} else {
				registerRowSelectEvent(event);
			}
		});
	});

	return (
		<>
			<PopupMenuTitle name={'파일업로드'} showButtons={false} showChildrens={true}>
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
				<Button onClick={onClickSaveButton} type="primary">
					{'파일업로드'}
				</Button>
			</PopupMenuTitle>
			{/* 그리드 */}
			<AGrid>
				<div className="flex-wrap">
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					{/* 미리보기 */}
					<div className="preview">
						{previewImage != '' ? (
							<Image className="" src={previewImage} />
						) : (
							<span>이미지만 미리보기가 가능합니다</span>
						)}
					</div>
				</div>
			</AGrid>
			<ButtonWrap data-props="message">
				<span>총 업로드 크기: {totalSizeMB} MB</span>
				<span>※ 총 파일 제한 사이즈: 30MB, 파일명내 허용된 특수문자: ., _, -, (, ), [, ]</span>
			</ButtonWrap>
		</>
	);
});
export default CmFileUploaderPopup;
