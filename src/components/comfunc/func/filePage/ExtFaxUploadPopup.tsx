/*
 ############################################################################
 # FiledataField	: PopupFileUploader.tsx
 # Description		: 팝업 파일 업로드
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import { Button, Col, Form, Image, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

//component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { InputText, SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

//API Call Function
import { apiPostFaxSaveFile } from '@/api/sample/apiSample';

// 넘겨받은 Props 타입 정의
type popupProps = {
	callBack: any;
	paramAttchFileGrpNo?: string;
};

const ExtFaxUploadPopup = forwardRef((props: popupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack } = props;
	// 다국어
	const { t } = useTranslation();
	const gridRef = useRef(null);

	const [totalSize, setTotalSize] = useState(0);
	const [totalSizeMB, setTotalSizeMB] = useState('0');

	const MAX_UPLOAD_SIZE = 31458000;

	const [fileInfoList, setFileInfoList] = useState([]);
	const [previewImage, setPreviewImage] = useState('');
	const uploadFile = useRef(null);
	const [saveFormData, setSaveFormData] = useState([]);
	const [imgFileName, setImgFileName] = useState('경기94아7803_1_20260920.png');
	const [form] = Form.useForm();

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
			headerText: 'comfunc.filepage.grid.attchFileExtNm',
			dataField: 'attchFileExtNm',
			visible: false,
		},
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
		const attchFileSzList = gridRef.current.getColumnValues('attchFileSz', true);
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

		// preview 마지막 파일
		const lastFile = files[files.length - 1];
		if (dataRegex.isImage(lastFile.name?.toLowerCase())) {
			setPreviewImage(window.URL.createObjectURL(lastFile));
		}

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

			setPreviewImage('');
			setTotalSize(totalSize - Number(deleted.attchFileSz));
		});
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

		apiPostFaxSaveFile(formDataParam).then(res => {
			if (res.data.statusCode === 0) {
				showAlert('', t('msg.MSG_COM_SUC_003'), () => {
					callBack(res.data);
				});
			}
		});
	}

	/**
	 * 첨부파일 다운로드
	 */
	function onClickFileDownload() {
		const params = {
			dirType: 'fax',
			attchFileNm: imgFileName,
			drmUseYn: 'N',
		};
		fileUtils.downloadFile(params);
	}

	/**
	 * 선택한 파일이 이미지인 경우 미리보기 세팅
	 * @param {object} event 파일 선택 변경 이벤트
	 */
	const registerRowSelectEvent = (event: any) => {
		if (!dataRegex.isImage(gridRef.current.getCellValue(event.rowIndex, 'attchFileExtNm')?.toLowerCase())) {
			setPreviewImage('');
			return;
		}

		// 업로드 대기열에 있는지 확인
		const previewNm = event.item.attchFileNm;
		const previewFile = saveFormData.find(file => {
			return file.name == previewNm;
		});
		if (previewFile) {
			// 업로드 대기열에 있는 경우 미리보기
			setPreviewImage(window.URL.createObjectURL(previewFile));
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
		gridRef.current.bind('cellClick', (event: any) => {
			registerRowSelectEvent(event);
		});
	});

	return (
		<SearchForm form={form} initialValues={{ fileName: '경기94아7803_1_20260920.png' }}>
			<PopupMenuTitle name={'FAX 파일업로드'} showButtons={false} showChildrens={true}>
				{/* 파일업로드, 저장, 삭제 */}
				<InputText
					name="fileName"
					label="이미지 파일명"
					value={imgFileName}
					onChange={(e: any) => {
						setImgFileName(e.target.value);
					}}
				/>
				<Button onClick={onClickFileDownload}>{'파일다운로드'}</Button>
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
				<Row gutter={12} className="flex-wrap">
					<Col span={15}>
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</Col>
					{/* 미리보기 */}
					<Col span={9}>
						<div className="preview">
							{previewImage != '' ? (
								<Image className="" src={previewImage} />
							) : (
								<span>이미지만 미리보기가 가능합니다</span>
							)}
						</div>
					</Col>
				</Row>
			</AGrid>
			<ButtonWrap data-props="message">
				<span>총 업로드 크기: {totalSizeMB} MB</span>
			</ButtonWrap>
		</SearchForm>
	);
});
export default ExtFaxUploadPopup;
