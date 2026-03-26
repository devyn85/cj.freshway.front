/*
 ############################################################################
 # FiledataField	: MsCustDeliveryInfoUploadExcelPopup.tsx
 # Description		:  상품 엑셀 업로드 팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.07.22
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';

// store
import { dispatchSetLoading } from '@/store/core/loadingStore';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiGetValidateExcelList, apiPostSaveMasterList, selectAddressInfoList } from '@/api/ms/apiMsCustDeliveryInfo';

import axios from 'axios';
import pLimit from 'p-limit';

interface PropsType {
	close?: any;
}

const MsCustDeliveryInfoUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;
	const excelUploadFileRef = useRef(null);
	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const limit = pLimit(10); // tmap 호출시 동시에 10개만 허용
	const APP_KEY = constants.TMAP.APP_KEY;

	// 그리드 초기화
	const gridCol = [
		// {
		// 	dataField: 'dlvDccode',
		// 	headerText: t('lbl.DLV_DCCODE'),
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'custtype',
		// 	headerText: t('lbl.CUSTTYPE'),
		// 	dataType: 'code',
		// },
		{
			// 고객코드
			dataField: 'custkey',
			headerText: t('lbl.CUST_CODE'),
			dataType: 'code',
		},
		{
			// 고객명
			dataField: 'custname',
			headerText: t('lbl.CUST_NAME'),
		},
		{
			// 군납여부
			dataField: 'armyYn',
			headerText: t('lbl.ARMY_YN'),
		},
		{
			// 피킹유형
			dataField: 'distancetype',
			headerText: t('lbl.PICKINGTYPE'),
		},
		// {
		// 	dataField: 'districtname',
		// 	headerText: '권역(MDM)',
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'dlvInfoApplyYn',
		// 	headerText: '배송정보적용요청여부',
		// },

		// {
		// 	dataField: 'custgroup',
		// 	headerText: '고객분류',
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'hqCustkey',
		// 	headerText: t('lbl.BRAND_CUSTKEY'),
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'hqCustname',
		// 	headerText: t('lbl.BRAND_CUSTNAME2'),
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'saleCustkey',
		// 	headerText: t('lbl.TO_VATNO'),
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'saleCustname',
		// 	headerText: t('lbl.TO_VATOWNER'),
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'mngCustkey',
		// 	headerText: t('lbl.TO_CUSTKEY_WD'),
		// 	dataType: 'code',
		// },
		// {
		// 	dataField: 'mngCustname',
		// 	headerText: t('lbl.TO_CUSTNAME_WD'),
		// 	dataType: 'code',
		// },
		{
			//실착지코드
			dataField: 'truthcustkey',
			headerText: t('lbl.TRUTH_CUSTKEY'),
		},
		{
			dataField: 'floor',
			headerText: '층수',
		},
		{
			dataField: 'keytype2',
			headerText: t('lbl.ENTRANCEKEYINFO'),
		},
		{
			dataField: 'keydetail',
			headerText: t('lbl.ENTRANCEKEYDETAILINFO'),
		},
		{
			dataField: 'buildingopentime',
			headerText: '건물개방시간',
		},
		{
			dataField: 'deliveryavailabletime',
			headerText: '납품가능시간',
		},
		{
			dataField: 'parkingheight',
			headerText: '건물진입가능높이',
		},
		{
			dataField: 'accessway',
			headerText: '업장출입동선',
		},
		{
			dataField: 'freezeplace',
			headerText: '적재위치(냉동)',
		},
		{
			dataField: 'coldplace',
			headerText: '적재위치(냉장)',
		},
		{
			dataField: 'htemperature',
			headerText: '적재위치(상온)',
		},
		{
			// 회수위치
			dataField: 'loadplace2',
			headerText: t('lbl.LOADPLACE'),
		},
		// {
		// 	dataField: 'empname1',
		// 	headerText: 'MA명',
		// },
		// {
		// 	dataField: 'addwho',
		// 	headerText: t('lbl.ADDWHO'),
		// },
		// {
		// 	dataField: 'adddate',
		// 	headerText: t('lbl.CREATEDATE'),
		// 	dataType: 'date',
		// 	formatString: 'yyyy-mm-dd hh:MM:ss',
		// },
		// {
		// 	dataField: 'delYn',
		// 	headerText: t('lbl.DEL_YN'),
		// },
		// {
		// 	dataField: 'editwho',
		// 	headerText: t('lbl.EDITWHO'),
		// },
		// {
		// 	dataField: 'editdate',
		// 	headerText: t('lbl.MODIFYDATE'),
		// 	dataType: 'date',
		// 	formatString: 'yyyy-mm-dd hh:MM:ss',
		// },
		// {
		// 	dataField: 'cardmemo',
		// 	headerText: '요청사항(거래처카드)',
		// },
		{
			dataField: 'reqdlvtime2From',
			headerText: 'OTD(From)',
		},
		{
			dataField: 'reqdlvtime2To',
			headerText: 'OTD(To)',
		},
		{
			dataField: 'faceinspect',
			headerText: '대면검수여부',
		},
		{
			dataField: 'address1',
			headerText: '주소1',
			visible: false,
		},
		{
			dataField: 'address2',
			headerText: '주소2(상세주소)',
			visible: false,
		},
		{
			dataField: 'latitude',
			headerText: '위도',
			visible: false,
		},
		{
			dataField: 'longitude',
			headerText: '경도',
			visible: false,
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 시간변환
	const timeFormat: any = (value: string) => {
		if (!value) {
			return false;
		}
		const cleanedStr = value.trim();

		if (cleanedStr.includes(':')) {
			const parts = cleanedStr.split(':');
			let hour = parts[0];
			const minute = parts[1];

			// 시(hour) 부분이 한 자리 숫자(길이가 1)인 경우 앞에 0을 붙입니다.
			if (hour.length === 1 && !isNaN(parseInt(hour))) {
				hour = `0${hour}`; // 예: '9' -> '09'
			}

			// 시와 분이 모두 유효하면 조합하여 반환
			if (hour && minute) {
				return `${hour}:${minute}`;
			}

			// 포맷이 유효하지 않으면 기본값 반환
			return '99:99';
		}

		// 콜론이 없고 길이가 4인 경우 (예: '0000', '1430')
		if (cleanedStr.length === 4) {
			// 앞 두 자리는 시(Hour), 뒤 두 자리는 분(Minute)
			const hour = cleanedStr.substring(0, 2);
			const minute = cleanedStr.substring(2, 4);
			// HH:MM 포맷으로 조합하여 반환
			return `${hour}:${minute}`;
		}

		// 그 외 처리 불가능한 경우 (길이가 4가 아니거나 예상치 못한 포맷)
		return '99:99';
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		// dlvcustkey 사용 안 한다고 함 일단 강제 set
		const params = gridRef.current.getGridData().map((item: any) => {
			return {
				...item,
				dlvcustkey: item.custkey,
			};
		});

		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		apiGetValidateExcelList(params).then(res => {
			const checkColumn = [
				{
					dataField: 'processYn',
					headerText: '체크결과',
				},
				{
					dataField: 'processMsg',
					headerText: '체크메시지',
				},
			];
			gridRef.current.addColumn(checkColumn, 1);
			const rowsToUpdate = res.data.data;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				const rowKeys = Object.keys(row);
				const checkKeys = ['custkey', 'truthcustkey'];
				const foundIndex = params.findIndex((gridRow: any) => {
					// 모든 키에 대해 비교를 수행합니다.
					return rowKeys.every(key => {
						// 키 목록에 포함되어 있지 않으면 비교하지 않습니다.
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
				const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [params[foundIndex]._$uid]);
				if (rowIndex !== undefined) {
					let processMsg;
					let processYn;

					// 에디팅 유효성 검사
					let isValid = true;
					let otdFrom = timeFormat(row.reqdlvtime2From);
					if (otdFrom) {
						otdFrom = otdFrom.split(':');
						// 시간 영역 체크 00:00 ~ 23:59 까지만 가능
						if (parseInt(otdFrom[0]) > 23 || parseInt(otdFrom[1]) > 59 || isNaN(otdFrom[0]) || isNaN(otdFrom[1])) {
							isValid = false;
						}
					}

					let otdTo = timeFormat(row.reqdlvtime2To);
					if (otdTo) {
						otdTo = otdTo.split(':');
						// 시간 영역 체크 00:00 ~ 23:59 까지만 가능
						if (parseInt(otdTo[0]) > 23 || parseInt(otdTo[1]) > 59 || isNaN(otdTo[0]) || isNaN(otdTo[1])) {
							isValid = false;
						}
					}

					const validValues = ['Y', 'N', '', null, undefined];

					if (row.custkeyChk === 'N') {
						processMsg = '고객코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.truthcustkeyChk === 'N') {
						processMsg = '실착지코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.alreadiyChk === 'N') {
						processMsg = '등록된 고객이 없습니다.';
						processYn = 'N';
					} else if (row.duplicateChk === 'N') {
						processMsg = '중복된 고객코드입니다.';
						processYn = 'N';
					} else if (!validValues.includes(row.armyYn)) {
						processMsg = '군납여부는 Y,N 만 입력 가능합니다.';
						processYn = 'N';
					} else if (!validValues.includes(row.faceinspect)) {
						processMsg = '대면검수여부는 Y,N 만 입력 가능합니다.';
						processYn = 'N';
					} else if (!isValid) {
						processMsg = '유효하지 않은 시간 형식입니다.';
						processYn = 'N';
					} else if (row.buildingopentimeChk === 'N') {
						processMsg = '유효하지 않은 건물개방시간 형식입니다.';
						processYn = 'N';
					} else if (row.deliveryavailabletimeChk === 'N') {
						processMsg = '유효하지 않은 납품가능시간 형식입니다.';
						processYn = 'N';
					} else if (row.parkingheightChk === 'N') {
						processMsg = '유효하지 않은 건물진입가능높이 형식입니다.';
						processYn = 'N';
					} else if (row.accesswayChk === 'N') {
						processMsg = '유효하지 않은 업장출입이동동선 형식입니다.';
						processYn = 'N';
					} else {
						processMsg = '정상';
						processYn = 'Y';
					}
					updateData.push({
						processYn: processYn,
						processMsg: processMsg,
						rowStatus: 'U',
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
		});
	};

	const saveExcelList = async () => {
		// 변경 데이터 확인
		// dlvcustkey 사용 안 한다고 함 일단 강제 set
		const params = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
				dlvcustkey: item.custkey,
				isExcel: 'Y',
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = params.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : 0건
				수정 : ${params.length}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, async () => {
			// 실찾기 관리 코드를 기준으로 주소 정보 조회 후 위경도 값 조회
			await saveVataddressPartnerInfoByTruthcustkey(params);

			await apiPostSaveMasterList(params).then(() => {
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

	/**
	 *
	 * 실착지관리거래처코드 만 있을 경우 실작지 주소 조회 후 api 를 통한 위경도 정보 가져와서 조합하기.
	 * @param checkedRowItems
	 */
	const saveVataddressPartnerInfoByTruthcustkey = async (checkedRowItems: any) => {
		// console.time('func 시작시간');
		if (!checkedRowItems || checkedRowItems.length === 0) return;

		const trustCustKeyFilter = checkedRowItems.filter((item: any) => {
			// 살착지관리거래처코드가 있고, 위경도 정보가 없을 경우
			return (
				commUtil.isNotEmpty(item.truthcustkey) && (commUtil.isEmpty(item.latitude) || commUtil.isEmpty(item.longitude))
			);
		});

		if (commUtil.isEmpty(trustCustKeyFilter)) return;

		// 위경도 없는 정보 중에 주소 없는것만 취합.
		const emptyAddressFilter = trustCustKeyFilter.filter((item: any) => {
			return commUtil.isEmpty(item.address1);
		});

		// 주소 있는것만 모음.
		const addressFilter = trustCustKeyFilter.filter((item: any) => {
			return commUtil.isNotEmpty(item.address1);
		});

		// 주소 정보가 없으면 주소 조회 후 위경도 조회.
		if (commUtil.isNotEmpty(emptyAddressFilter)) {
			// 주소 정보 조회.
			const res = await selectAddressInfoList(emptyAddressFilter);
			if (res && res.data) {
				const resAddress = res.data;
				if (resAddress?.length !== 0) {
					// 주소 조회 요청 하여 주소 값이 있는것만.
					const addressList = resAddress.filter((item: any) => {
						return commUtil.isNotEmpty(item.address1);
					});

					await selectLatLonByAddress(addressList, checkedRowItems);
				}
			}
		}
		// 주소 있어서 위경도만 조회.
		if (commUtil.isNotEmpty(addressFilter)) {
			// 주소 정보가 있으면 위/경도 조회.
			await selectLatLonByAddress(addressFilter, checkedRowItems);
		}

		// checkedRowItems.some((item: any) => {
		// 	//console.log(`grid row data  truthCustKey : ${item.truthcustkey}`);
		// 	//console.log(`setting address : ${item.address1} latitude : ${item.latitude} || longitude : ${item.longitude}`);
		// });
	};

	/**
	 * 주소 정보가 있는 경우만 위경도 정보를 조회 한다.
	 * @param {any} addressList 주소 정보 목록
	 * @param {any} rowItem 대상 목록
	 */
	const selectLatLonByAddress = async (addressList: any, rowItem: any) => {
		// 로딩바 Start
		dispatchSetLoading(true);

		for (const addressInfo of addressList) {
			if (commUtil.isEmpty(addressInfo.address1)) continue;

			const resLatLon = await latLonInfoByAddress(addressInfo.address1);
			if (resLatLon && resLatLon.latitude) {
				// //console.log('resLatLon :', resLatLon.latitude);
				const findRow = rowItem.find((item: any) => item.truthcustkey == addressInfo.code);
				if (commUtil.isNotEmpty(findRow)) {
					findRow.truthaddress1 = addressInfo?.address1;
					findRow.truthaddress2 = addressInfo?.address2;
					findRow.address1 = addressInfo?.address1;
					findRow.address2 = addressInfo?.address2;
					findRow.latitude = resLatLon?.latitude;
					findRow.longitude = resLatLon?.longitude;
				}
			}
		}

		// 로딩바 End
		dispatchSetLoading(false);
	};

	/**
	 * 주소 정보를 가지고 api 통해서 위경도 정보를 가져옴.
	 * @param searchText 찾을 주소
	 * @returns {place} 위경도 정보 {latitude: fixValue(lat), longitude: fixValue(lon),}
	 */
	const latLonInfoByAddress = async (searchText: any) => {
		// if (!keyword.trim() && !searchText.trim()) return;
		try {
			const response = await limit(() =>
				axios.get('https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?format=json&callback=result', {
					params: {
						version: 1,
						format: 'json',
						coordType: 'WGS84GEO',
						fullAddr: searchText,
					},
					headers: {
						appKey: APP_KEY,
					},
					withCredentials: false,
				}),
			);
			const { coordinateInfo } = response.data;
			if (coordinateInfo?.coordinate?.length === 0) {
				return;
			}

			// 검색 결과가 여러개 일 경우
			let lat = parseFloat(coordinateInfo.coordinate[0].lat);
			let lon = parseFloat(coordinateInfo.coordinate[0].lon);
			if (isNaN(lat) && isNaN(lon)) {
				lat = parseFloat(coordinateInfo.coordinate[0].newLat);
				lon = parseFloat(coordinateInfo.coordinate[0].newLon);
			}

			const place = {
				latitude: fixValue(lat),
				longitude: fixValue(lon),
			};

			return place;
		} catch (error) {
			return;
		}
	};

	/**
	 * 지도 팝업 콜백 함수 (좌표)
	 * @param num
	 * @returns {string} 소수점 절삭
	 */
	const fixValue = (num: number): string => {
		// Math.trunc(num * 10000)을 이용해 버림 처리 후, 10000으로 나눔
		const truncatedNum = Math.trunc(num * 10000) / 10000;

		// toFixed(4)를 이용해 4자리 문자열 형식으로 변환
		return truncatedNum.toFixed(4);
	};
	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '고객_배송정보_관리.xlsx',
		};

		fileUtil.downloadFile(params);
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
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="고객배송조건 일괄업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
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

export default MsCustDeliveryInfoUploadExcelPopup;
