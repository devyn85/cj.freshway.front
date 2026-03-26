/*
 ############################################################################
 # FiledataField	: MsCustDeliveryInfoFileUploadPopup.tsx
 # Description		: 차량정보 파일 업로드
 # Author			: JeongHyeongCheol
 # Since			: 25.10.10
 ############################################################################
*/
// lib
import { Button, Col, Image, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// hooks
import useImagePreviewPopup from '@/hooks/cm/useImagePreviewPopup';
import { useAppSelector } from '@/store/core/coreHook';

//component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

//API Call Function
import {
	apiGetUploadFileList,
	apiPostConfirmCustDeliveryInfoFileUpload,
	apiPostDeleteCustDeliveryInfoFileUpload,
	apiPostSaveCustDeliveryInfoFileUploadTemp,
} from '@/api/ms/apiMsCustDeliveryInfo';
import dataRegex from '@/util/dataRegex';
import fileUtil from '@/util/fileUtils';

const { VITE_EDMS_IMG_URL } = import.meta.env; // EDMS 이미지 URL

// 넘겨받은 Props 타입 정의
type popupProps = {
	callBack: any;
	issueno?: string;
	code?: string;
	customPopupTitle?: string;
};

const MsCustDeliveryInfoFileUploadPopup = forwardRef((props: popupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, issueno, code, customPopupTitle } = props;
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

	// 이미지 확대/드래그 Custom Hook
	const { containerStyle, imageStyle, containerHandlers, imageHandlers } = useImagePreviewPopup(previewImage);

	// 사용자 정보 가져오기
	const userInfo = useAppSelector(state => state.user.userInfo);

	/*
	 ### 그리드 초기화 ###
	 */
	const gridCol = [
		// {
		// 	headerText: 'serialkey',
		// 	dataField: 'serialkey',
		// 	visible: false,
		// },
		{
			headerText: t('lbl.FILENAME'),
			dataField: 'fileName',
			dataType: 'default',
			editable: false,
		},
		{
			/**
			 * 상태
			 * N = 저장 상태(NAS), Y = 확정 상태 (EDMS)
			 */
			headerText: t('lbl.STATUS_1'),
			dataField: 'status',
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value === 'Y') {
					return '적용';
				} else if (value === 'N') {
					return '미적용';
				} else {
					return '';
				}
			},
		},
		{
			/**
			 * 경로
			 * 업로드 경로(CRM, WMS, ...)
			 */
			headerText: '경로',
			dataField: 'uploadLocation',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: '파일작성일자',
			dataField: 'adddate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			headerText: 'comfunc.filepage.grid.attchFileExtNm',
			dataField: 'fileExtension',
			visible: false,
		},
		{
			headerText: '파일크기(KB)',
			dataField: 'fileSizeBytes',
			dataType: 'numeric',
			visible: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return Math.round(value / 1024).toLocaleString();
			},
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		// rowCheckToRadio: true, // 라디오버튼처럼 단일 선택만 가능
		// fillColumnSizeMode: true,
		enableColumnResize: true,
		softRemoveRowMode: true,
		softRemovePolicy: 'exceptNew',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const searchList = () => {
		const params = {
			issueno: issueno,
			code: code,
		};
		// 파일 목록 조회
		apiGetUploadFileList(params).then(res => {
			gridRef.current.setGridData(res.data);
			resizingTotal();

			// 데이터 설정 후 컬럼 크기 자동 조정
			if (res.data && res.data.length > 0) {
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
		});
	};

	/**
	 * Totalsize 재설정
	 */
	function resizingTotal() {
		const attchFileSzList = gridRef.current.getColumnValues('fileSizeBytes', true);
		let sum = 0;
		attchFileSzList.forEach(function (item: number) {
			sum += Number(item);
		});

		setTotalSize(sum);
	}

	/**
	 * 파일추가(업로드) 클릭
	 */
	function onClickFileUpload() {
		uploadFile.current.click();
	}

	/**
	 * 파일추가 이벤트
	 * @param {object} event 파일추가 파일 변경 이벤트
	 */
	function changeUploadEvent(event: any) {
		const files = uploadFile.current.files;
		const currentGridData = gridRef.current.getGridData();

		// 파일 개수 제한 (최대 2개)
		// if (currentGridData.length + files.length > 2) {
		// 	showAlert('', '첨부파일은 최대 두 개까지 추가할 수 있습니다.');
		// 	event.target.value = '';
		// 	return;
		// }

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
				issueno: issueno,
				fileName: element.name,
				// attchFileSz: element.size.toString(),
				fileSizeBytes: element.size,
				// attchFileExtNm: element.name.split('.')[1],
				fileExt: element.name.split('.').pop() || '',
				uploadDate: new Date().toISOString(),
				fileTp: 'cpt',
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

		// 로컬 업로드 시 파일 이름이 길 때 컬럼 크기 자동 조정
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		gridRef.current.setColumnSizeList(colSizeList);
	}

	/**
	 * 첨부파일 삭제 (다건 삭제 지원)
	 */
	function onClickRemoveButton() {
		const checkedItems = gridRef.current.getCheckedRowItems();

		// 선택된 항목 검증
		if (!checkedItems || checkedItems.length === 0) {
			showAlert('', '삭제할 파일을 선택해주세요.');
			return;
		}

		// 확정 건 삭제 불가 (필요 시 주석 해제)
		// const confirmedItems = checkedItems.filter((row: any) => row.item.status === 'Y');
		// if (confirmedItems.length > 0) {
		// 	if (confirmedItems.length === checkedItems.length) {
		// 		showAlert('', '이미 확정된 파일은 삭제할 수 없습니다.');
		// 	} else {
		// 		showAlert('', '이미 확정된 파일이 포함되어 있습니다.');
		// 	}
		// 	return;
		// }

		// 서버 저장 건 (serialkey 있음) / 로컬 업로드 건 (serialkey 없음) 분류
		const serverItems: any[] = [];
		const localItems: any[] = [];

		checkedItems.forEach((row: any) => {
			const item = row.item;
			const serialkey = item?.SERIALKEY || item?.serialkey;
			if (serialkey) {
				serverItems.push(row);
			} else {
				localItems.push(row);
			}
		});

		// 로컬 업로드 건 삭제 처리
		if (localItems.length > 0) {
			handleLocalFileDelete(localItems);
		}

		// 서버 저장 건 삭제 처리
		if (serverItems.length > 0) {
			handleServerFileDelete(serverItems);
		} else if (localItems.length > 0) {
			// 로컬 건만 있을 경우 메시지 표시
			showMessage({
				content: '파일이 삭제되었습니다.',
				modalType: 'info',
			});
		}
	}

	/**
	 * 서버 저장된 파일 삭제 처리 (다건)
	 * @param serverItems 서버에 저장된 파일 목록
	 */
	function handleServerFileDelete(serverItems: any[]) {
		const serialkeys = serverItems.map((row: any) => row.item.SERIALKEY || row.item.serialkey);
		const payload = { issueno, code, serialkeys };

		apiPostDeleteCustDeliveryInfoFileUpload(payload).then(res => {
			if (res?.data?.statusCode === 0) {
				// UI 상태 업데이트
				setPreviewImage('');

				showMessage({
					content: '파일이 삭제되었습니다.',
					modalType: 'info',
					onOk: () => {
						searchList();
					},
				});
			}
		});
	}

	/**
	 * 로컬 파일 삭제 처리 (다건, 새로 추가된 파일)
	 * @param localItems 로컬에 추가된 파일 목록
	 */
	function handleLocalFileDelete(localItems: any[]) {
		// 삭제할 파일명 목록
		const deleteFileNames = localItems.map((row: any) => row.item.fileName || row.item.attchFileNm);

		// 그리드에서 행 제거 (역순으로 삭제해야 인덱스 꼬임 방지)
		const rowIndexes = localItems.map((row: any) => row.rowIndex).sort((a: number, b: number) => b - a);
		rowIndexes.forEach((rowIndex: number) => {
			gridRef.current.removeRow(rowIndex);
		});

		// UI 상태 업데이트
		setPreviewImage('');

		// totalSize 업데이트
		localItems.forEach((row: any) => {
			updateTotalSize(row.item);
		});

		// saveFormData에서도 제거
		const updatedSaveData = saveFormData.filter((file: any) => !deleteFileNames.includes(file.name));
		setSaveFormData(updatedSaveData);
	}

	/**
	 * 총 파일 크기 업데이트
	 * @param deleted
	 */
	function updateTotalSize(deleted: any) {
		const fileSize = Number(deleted.fileSizeBytes ?? deleted.fileSize ?? deleted.attchFileSz ?? 0);
		setTotalSize(prevSize => Math.max(0, prevSize - fileSize));
	}

	/**
	 * 파일 업로드 저장 함수
	 * @param type //true:저장 false:확정
	 * @returns {void}
	 */
	async function onClickSaveButton(type: boolean) {
		const gridCount = gridRef.current.getGridData();
		const gridList = gridRef.current.getCheckedRowItems();

		if (gridList.length == 0) {
			showAlert('', '업로드할 파일이 없습니다.');
			return false;
		}

		// 이미 저장된 건 검증
		const alreadySaved = gridList.filter((row: any) => {
			const item = row.item;
			return item.SERIALKEY || item.serialkey;
		});

		if (alreadySaved.length > 0) {
			if (alreadySaved.length === gridList.length) {
				showAlert('', '이미 저장된 건입니다.');
			} else {
				showAlert('', '이미 저장된 건이 포함되어 있습니다.');
			}
			return false;
		}

		// 고객배송조건 이미지팝업 조건
		// if (gridCount.length > 2) {
		// 	showAlert('', '첨부파일은 총 2개만 가능합니다.');
		// 	return false;
		// }

		// 선택값만 체크
		const gridFileNames = new Set(gridList.map((gridItem: any) => gridItem.item.fileName));

		const formDataParam = new FormData(); // 파일 전송할 form
		saveFormData.forEach(function (item: any) {
			formDataParam.append('file', item);
		});

		// FileUploaderEdms 규격으로 파일 메타 구성 (TmIssue와 동일)
		const mappedList = saveFormData
			.filter((file: any) => {
				const fileName = file?.name || '';
				// gridFileNames Set에 현재 파일 이름이 있는지 확인
				return gridFileNames.has(fileName);
			})
			.map((file: any) => {
				const name = file?.name || '';
				const size = file?.size ?? 0;
				const ext = name.lastIndexOf('.') > -1 ? name.substring(name.lastIndexOf('.') + 1) : '';
				return {
					fileTp: 'cpt',
					attchFileNm: name,
					attchFileSz: String(size),
					attchFileExtNm: ext,
					rowStatus: 'I',
				};
			});

		formDataParam.append(
			'fileInfoList',
			new Blob([JSON.stringify(mappedList)], {
				type: 'application/json',
			}),
		);
		formDataParam.append('issueno', issueno);
		formDataParam.append('docType', '100');
		formDataParam.append('uploadLocation', 'WMS');

		// 임시저장 호출
		formDataParam.append('code', code);
		await apiPostSaveCustDeliveryInfoFileUploadTemp(formDataParam).then(res => {
			if (res.data.statusCode === 0 && type) {
				setSaveFormData([]);
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						searchList();
					},
				});
			}
		});
	}

	/**
	 * 확정(EDMS): 체크된 파일들 EDMS 업로드 (STATUS='Y'로 변경)
	 */
	async function onClickConfirmButton() {
		const selected = gridRef.current.getCheckedRowItems();

		if (!selected || selected.length === 0) {
			showAlert('', '확정할 파일을 선택하세요.');
			return;
		}

		// 이미 확정된 건 검증
		const alreadyConfirmed = selected.filter((row: any) => row.item.status === 'Y');

		if (alreadyConfirmed.length > 0) {
			if (alreadyConfirmed.length === selected.length) {
				showAlert('', '이미 확정된 건입니다.');
			} else {
				showAlert('', '이미 확정된 건이 포함되어 있습니다.');
			}
			return;
		}

		/**
		 * 확정 개수 제한
		 * - code '12': 최대 4개 (MsCustDeliveryInfoDetail의 "업장 출입 이동 동선", MsCustDeliveryInfoPDetail의 "협력사입구")
		 * - 그 외: 최대 2개
		 */
		const maxConfirmCount = code === '12' ? 4 : 2;
		const gridData = gridRef.current.getGridData();
		const alreadyConfirmedCount = gridData.filter((item: any) => item.status === 'Y').length;
		const selectedCount = selected.length - alreadyConfirmed.length; // 이미 확정된 건 제외

		if (alreadyConfirmedCount + selectedCount > maxConfirmCount) {
			showAlert('', `확정은 최대 ${maxConfirmCount}개까지만 가능합니다.`);
			return;
		}

		// 저장없이 확정버튼클릭
		let serialkeys = selected.map((it: any) => it.item.SERIALKEY || it.item.serialkey).filter((v: any) => !!v);
		if (serialkeys.length === 0) {
			await onClickSaveButton(false);

			const params = {
				issueno: issueno,
				code: code,
			};
			// 파일 목록 조회
			const res = await apiGetUploadFileList(params);

			// 조회된 목록중 현재 선택된값만 확정처리
			const gridFileNames = new Set(selected.map((gridItem: any) => gridItem.item.fileName));
			serialkeys = res.data
				.filter((file: any) => {
					const fileName = file?.fileName || '';
					// gridFileNames Set에 현재 파일 이름이 있는지 확인
					return gridFileNames.has(fileName);
				})
				.map((item: any) => item.serialkey);
		}

		/**
		 * 고객배송조건 이미지팝업 확정시 경로 관련 내용
		 *
		 * 저장 URL 예제: /app/uploads/dwaylo/upload/custdlvinfo + "/${custkey}"/
		 */
		/**
		 * 제한: 기존 확정 + 선택 > 2는 백엔드에서 거름
		 */
		apiPostConfirmCustDeliveryInfoFileUpload({ issueno, custkey: issueno, code, serialkeys }).then(res => {
			if (res.data.statusCode === 0) {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						searchList();
					},
				});
			}
		});

		// 확정 후 컬럼 크기 자동 조정
		const colSizeList = gridRef.current.getFitColumnSizeList(true);
		gridRef.current.setColumnSizeList(colSizeList);
	}

	/**
	 * 선택한 파일이 이미지인 경우 미리보기 세팅
	 * @param {object} event 파일 선택 변경 이벤트
	 */
	const registerRowSelectEvent = async (event: any) => {
		if (!dataRegex.isImage(gridRef.current.getCellValue(event.rowIndex, 'fileExtension')?.toLowerCase())) {
			setPreviewImage('');
			return;
		}

		// 업로드 대기열에 있는지 확인
		const previewNm = event.item.fileName;

		const previewFile = saveFormData.find(file => {
			return file.name == previewNm;
		});

		if (previewFile) {
			// 업로드 대기열에 있는 경우 미리보기
			setPreviewImage(window.URL.createObjectURL(previewFile));
		} else {
			// 서버 리소스(NAS/EDMS)에서 미리보기 구성
			const item = event.item || {};
			const ext = String(item.fileExtension || '').toLowerCase();
			if (!ext) {
				setPreviewImage('');
				return;
			}

			try {
				if (item.status === 'Y') {
					// EDMS 확정 파일
					const workplaceId = item.uploadWorkplaceId || '101';
					const fileId = item.uploadResDocId || item.uploadHashId;
					if (fileId) {
						setPreviewImage(`${VITE_EDMS_IMG_URL}/${workplaceId}/${fileId}`);
					} else {
						setPreviewImage('');
					}
				} else {
					// NAS 임시 파일

					const params = {
						attchFileNm: item.fileName,
						// attchFileNm: item.transFileName,
						dirType: 'saveFullPath',
						savePathNm: item.fileLocation,
						readOnly: true,
					};

					await fileUtil.downloadFile(params).then((data: string) => {
						setPreviewImage(data || '');
					});
				}
			} catch (err) {
				setPreviewImage('');
			}
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
		searchList();
		gridRef.current.bind('cellClick', (event: any) => {
			registerRowSelectEvent(event);
		});
	}, []);

	return (
		<>
			<PopupMenuTitle
				name={customPopupTitle || '고객배송조건 첨부파일 업로드'}
				showButtons={false}
				showChildrens={true}
			>
				{/* 파일업로드, 저장, 삭제 */}
				<Button onClick={onClickFileUpload}>{'파일추가'}</Button>
				<input
					ref={uploadFile}
					id="uploadInput"
					multiple
					type="file"
					accept="image/*"
					style={{ display: 'none' }}
					onChange={changeUploadEvent}
				/>

				<Button onClick={onClickRemoveButton}>{'파일삭제'}</Button>
				{/* 이미지 임시저장 */}
				<Button onClick={() => onClickSaveButton(true)}>{t('lbl.SAVE')}</Button>
				<Button type="primary" onClick={onClickConfirmButton}>
					{t('lbl.CONFIRM')}
				</Button>
			</PopupMenuTitle>
			{/* 그리드 */}
			<AGrid>
				<Row gutter={12} className="flex-wrap">
					<Col span={15}>
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</Col>
					{/* 미리보기 */}
					<Col span={9}>
						<div className="preview" style={containerStyle} {...containerHandlers}>
							{previewImage != '' ? (
								<Image src={previewImage} alt="미리보기" />
							) : (
								<span>이미지만 미리보기가 가능합니다</span>
							)}
						</div>
					</Col>
				</Row>
			</AGrid>
			<ButtonWrap data-props="message">
				<span>총 업로드 크기: {totalSizeMB} MB</span>
				<span>※ 총 파일 제한 사이즈: 30MB, 파일명내 허용된 특수문자: ., _, -, (, ), [, ]</span>
			</ButtonWrap>
		</>
	);
});
export default MsCustDeliveryInfoFileUploadPopup;
