/*
 ############################################################################
 # FiledataField	: SearchlatlngUploadExcelPopup.tsx
 # Description		:  GPS 좌표등록 일괄업로드 팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.09.02
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import axios from 'axios';
import pLimit from 'p-limit';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostSaveCustDeliveryInfo } from '@/api/ms/apiMsCustDeliveryInfo';

// store
import { dispatchSetLoading } from '@/store/core/loadingStore';

interface PropsType {
	close?: any;
	setMasterGridData?: any;
}

const SearchlatlngUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, setMasterGridData } = props;
	const APP_KEY = constants.TMAP.APP_KEY;
	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);
	const [apiData, setApiData] = useState([]);
	// 다국어
	const { t } = useTranslation();

	const gridCol = [
		// {
		// 	dataField: 'custtype',
		// 	headerText: '거래처유형',
		// 	dataType: 'code',
		// 	required: true,
		// },
		{
			dataField: 'custkey',
			headerText: '고객코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'custname',
			headerText: '고객명',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'address',
			headerText: '주소',
			required: true,
		},
		{
			dataField: 'address2',
			headerText: '상세',
			// required: true,
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
		fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 엑셀 업로드
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);

		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	// 위경도 조회 및 세팅
	const setLonLatFn = async (type: string) => {
		const dataList = gridRef.current.getGridData();
		// 변경 데이터 확인
		if (!dataList || dataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (type === 'save') {
			saveApi(apiData);
		} else if (type === 'excel') {
			const limit = pLimit(10); // 동시에 10개만 허용

			const editData = await Promise.all(
				dataList.map((data: any) =>
					limit(async () => {
						try {
							const response = await axios.get(
								'https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?format=json&callback=result',
								{
									params: {
										version: 1,
										format: 'json',
										coordType: 'WGS84GEO',
										fullAddr: data.address,
									},
									headers: {
										appKey: APP_KEY,
									},
									withCredentials: false,
								},
							);

							const { coordinateInfo } = response.data;
							if (coordinateInfo.coordinate.length === 0) {
								showAlert(null, t('msg.MSG_COM_ERR_007'));
								return;
							}

							const firstResult = coordinateInfo.coordinate[0];

							let lat = parseFloat(firstResult.lat);
							let lon = parseFloat(firstResult.lon);

							if (isNaN(lat) && isNaN(lon)) {
								lat = parseFloat(firstResult.newLat);
								lon = parseFloat(firstResult.newLon);
							}

							return {
								...data,
								latitude: lat,
								longitude: lon,
								// custtype: 'C',
							};
						} catch (error) {
							return {
								...data,
								latitude: '',
								longitude: '',
								// custtype: 'C',
							};
						}
					}),
				),
			);
			setApiData(editData);
			// api 유효성검사
			checkApi(editData);
		}
	};

	const checkApi = (editData: any) => {
		const gpsList = {
			gpsList: editData,
			avc_COMMAND: 'DATACHECK',
			processtype: 'SPMS_CUSTDLVINFO_EXLCHK',
		};

		apiPostSaveCustDeliveryInfo(gpsList).then((res: any) => {
			const checkColumn = [
				{
					dataField: 'processYn',
					headerText: t('lbl.CHECKRESULT'),
				},
				{
					dataField: 'processMsg',
					headerText: '체크메시지',
				},
			];
			gridRef.current.addColumn(checkColumn, 1);
			const rowsToUpdate = res.data;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				const rowKeys = Object.keys(row);
				const checkKeys = ['custkey', 'latitude', 'longitude'];
				// 3. GridData를 순회하며 일치하는 레코드를 찾습니다.
				const foundIndex = editData.findIndex((gridRow: any) => {
					// 모든 키에 대해 비교를 수행합니다.
					return rowKeys.every(key => {
						// 제외 키 목록에 포함되어 있으면 비교하지 않습니다.
						if (!checkKeys.includes(key)) {
							return true; // 제외할 필드는 항상 true로 간주하여 비교를 통과시킵니다.
						}

						// --- 값 정규화(Normalize) 로직 추가 ---
						// null, undefined를 ''(빈 문자열)로 통일 처리
						const normalize = (value: any) => {
							return value === null || value === undefined ? '' : value;
						};

						const normalizedRowValue = normalize(row[key]);
						const normalizedGridValue = normalize(gridRow[key]);

						// 현재 row의 값과 gridRow의 값이 동일한지 비교합니다.
						// (두 값이 모두 null이거나 undefined인 경우도 true로 처리)
						return normalizedRowValue == normalizedGridValue;
					});
				});

				const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [editData[foundIndex]._$uid]);

				if (rowIndex !== undefined) {
					updateData.push({
						processYn: row.processYn === 'N' ? 'Y' : 'N', // 프로시저에서 넘어올때 성공시 N 실패시 E로 넘어옴
						processMsg: row.processMsg,
					});
					updateIndex.push(rowIndex);
				}
			});
			gridRef.current.updateRows(updateData, updateIndex);

			// 오류케이스 체크 해제
			const uncheckedItems = gridRef.current.getGridData().filter((item: any) => {
				return item.processYn === 'N';
			});
			const uncheckedIds = uncheckedItems.map((item: any) => item._$uid);

			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
			dispatchSetLoading(false);
		});
	};

	const saveApi = (editData: any) => {
		const changedData = gridRef.current.getChangedData();
		// 체크결과 오류 케이스 유효성체크
		const isProcessYN = changedData.some((item: any) => item.processYn !== 'Y');
		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}
		const apiData = editData.filter((item: any) => {
			return changedData.some((editItem: any) => editItem._$uid === item._$uid);
		});

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const gpsList = {
				gpsList: apiData,
				avc_COMMAND: 'DATAUPLOAD',
				processtype: 'SPMS_CUSTDLVINFO_EXCEL',
			};
			apiPostSaveCustDeliveryInfo(gpsList).then((res: any) => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						close();
					},
				});
			});
		});
	};

	const validateExcelList = () => {
		dispatchSetLoading(true);
		// 주소 및 위.경도 체크
		setLonLatFn('excel');
	};

	const saveExcelList = () => {
		// 주소 및 위.경도 체크
		setLonLatFn('save');
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelSelect',
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
		],
	};
	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '고객_GPS_좌표_관리.xlsx',
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
			<PopupMenuTitle name="GPS 좌표등록 일괄업로드" showButtons={false} />

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

export default SearchlatlngUploadExcelPopup;
