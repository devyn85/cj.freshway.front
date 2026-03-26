/*
 ############################################################################
 # FiledataField	: MsCarDriverUploadExcelPopup.tsx
 # Description		:  차량정보 엑셀 업로드 팝업
 # Author			: parkYoSep
 # Since			: 26.03.03
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useRef, useState } from 'react';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetValidateExcelList, apiPostSaveExcelList } from '@/api/ms/apiMsCarDriver';
import axios from 'axios';
import pLimit from 'p-limit';
const APP_KEY = constants.TMAP.APP_KEY;

interface PropsType {
	close?: any;
	dccode?: string;
}

const MsCarDriverUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, dccode } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);
	const limit = pLimit(10); // tmap 호출시 동시에 10개만 허용
	const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);

	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'), // 차량번호
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'contracttype',
			headerText: t('lbl.CONTRACTTYPE'), // 계약유형
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'carcapacity',
			headerText: t('차량톤수'), // 차량톤수
			dataType: 'code',
			required: true,
		},
		{
			headerText: '배송유형' + ' <span class="aui-grid-required-char" style="color:red">*</span>',
			children: [
				{
					dataField: 'deliveryyn',
					headerText: '배송', //배송
					required: true,
				},
				{
					dataField: 'carryyn',
					headerText: '수송', //수송
					required: true,
				},
				{
					dataField: 'procsamedayyn',
					headerText: '조달(일배)', //조달(일배)
					required: true,
				},
				{
					dataField: 'procstorageyn',
					headerText: '조달(저장)', // 조달(저장)
					required: true,
				},
				{
					dataField: 'owncaryn',
					headerText: '고객자차', // 고객자차
					required: true,
				},
				{
					dataField: 'returnyn',
					headerText: '반품', // 반품
					required: true,
				},
			],
		},
		{
			dataField: 'carorderclosecd',
			headerText: t('마감유형'), // 마감유형
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'reuseyn',
			headerText: t('2회전 가능여부'), // 2회전가능여부
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'outgroup',
			headerText: t('출차그룹'), // 출차그룹
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'courier',
			headerText: t('운송사'), // 운송사
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'caragentkey',
			headerText: t('2차 운송사'), // 2차운송사
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'fromdate',
			headerText: t('차량소독증유효기간TO'), // 차량소독증유효기간TO
			dataType: 'code',
		},
		{
			dataField: 'todate',
			headerText: t('보건증유효기간TO'), // 보건증유효기간TO
			dataType: 'code',
		},
		{
			dataField: 'todate2',
			headerText: t('차량등록증유효기간TO'), // 차량등록증유효기간TO
			dataType: 'code',
		},
		{
			dataField: 'vehicleyear',
			headerText: t('lbl.REGISTRATIONDATE'), // 차량연식
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'vehicletypecd',
			headerText: t('연료구분'), // 연료구분
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'fuelefficiency',
			headerText: t('lbl.FUELEFFICIENCY'), // 연비
			dataType: 'numeric',
		},
		{
			dataField: 'optloadweight',
			headerText: '기본적재량(Kg)',
			dataType: 'numeric',
			required: true,
		},
		{
			dataField: 'maxweight',
			headerText: '최대적재량(Kg)',
			dataType: 'numeric',
			required: true,
		},
		{
			dataField: 'other03',
			headerText: '기본착지수',
			dataType: 'numeric',
			required: true,
		},
		{
			dataField: 'maxlanding',
			headerText: '최대착지수',
			dataType: 'numeric',
			required: true,
		},
		{
			dataField: 'baseweight2nd',
			headerText: '2회전 기본적재량(Kg)',
			dataType: 'numeric',
		},
		{
			dataField: 'maxweight2nd',
			headerText: '2회전 최대적재량(Kg)',
			dataType: 'numeric',
		},
		{
			dataField: 'baselanding2nd',
			headerText: '2회전 기본착지수',
			dataType: 'numeric',
		},
		{
			dataField: 'maxlanding2nd',
			headerText: '2회전 최대착지수',
			dataType: 'numeric',
		},
		{
			dataField: 'subdriveryn',
			headerText: '보조원유무',
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'garageaddress1',
			headerText: '차고지주소(기본)',
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'garageaddress2',
			headerText: '차고지주소(상세)',
			dataType: 'code',
		},
		{
			dataField: 'drivername',
			headerText: '기사명',
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'phone1',
			headerText: '전화번호',
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'workfromhour',
			headerText: '총근무시간FROM',
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'worktohour',
			headerText: '총근무시간TO',
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'thermometerno',
			headerText: '온도기록장치ID',
			dataType: 'code',
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

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
	 * 엑셀 데이터 세팅 후 필수값 체크를 위한 delay
	 * 지정된 지연 시간 후 그리드 유효성 검사를 수행하고 결과를 Promise로 반환
	 * @returns {Promise<boolean>} 유효성 검사 결과 (true/false)
	 */
	const validateGridDataWithDelay = () => {
		return new Promise(resolve => {
			// AUIGrid가 데이터 처리를 완료할 지연 시간 설정
			setTimeout(() => {
				// 유효성 검사 로직 호출
				const isValid = gridRef.current.validateRequiredGridData();
				// 검사 결과를 Promise의 resolve를 통해 반환
				resolve(isValid);
			}, 50);
		});
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSaveBtnDisabled(true);
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		const gridData = gridRef.current.getGridData();
		const saveList = await Promise.all(
			gridData.map(async (item: any) => {
				const result = item.garageaddress1 ? await latLonInfoByAddress(item.garageaddress1) : null;
				return {
					...item,
					latitude: result?.latitude || '',
					longitude: result?.longitude || '',
				};
			}),
		);
		const params = {
			avc_COMMAND: 'DATACHECK',
			processtype: 'SPCM_CAR',
			saveList: saveList,
		};

		// if (!params || params.saveList.length < 1) {
		// 	showMessage({
		// 		content: t('msg.MSG_COM_VAL_020'),
		// 		modalType: 'info',
		// 	});
		// 	return;
		// }
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

			const rowsToUpdate = res.data;
			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				updateIndex.push(index);
				updateData.push({
					processYn: row.processYn,
					processMsg: row.processMsg,
				});
			});

			gridRef.current.updateRows(updateData, updateIndex);
			// 오류케이스 체크 해제
			const uncheckedItems = gridRef.current.getGridData().filter((item: any) => {
				return item.processYn === 'E';
			});
			const uncheckedIds = uncheckedItems.map((item: any) => item._$uid);

			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
			setSaveBtnDisabled(false);
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveExcelList = async () => {
		// validateExcelList 이 완료된 후 저장버튼이 동작하도록 saveBtnDisabled 상태로 제어
		if (saveBtnDisabled) {
			return;
		}
		// // 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		// const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		// if (!updatedItems || updatedItems.length < 1) {
		// 	showMessage({
		// 		content: t('msg.MSG_COM_VAL_020'),
		// 		modalType: 'info',
		// 	});
		// 	return;
		// }
		// if (!gridRef.current.validateRequiredGridData()) return;

		// // 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		// 	apiPostSaveMasterList(updatedItems).then(() => {
		// 		// 전체 체크 해제
		// 		gridRef.current.setAllCheckedRows(false);
		// 		// AUIGrid 변경이력 Cache 삭제
		// 		gridRef.current.resetUpdatedItems();
		// 		showMessage({
		// 			content: t('msg.MSG_COM_SUC_003'),
		// 			modalType: 'info',
		// 		});
		// 	});
		// });
		const gridData = gridRef.current.getGridData();

		// processYn이 'E'인 데이터는 저장 대상에서 제외
		const validGridData = gridData.filter((item: any) => item.processYn !== 'E');
		const saveList = await Promise.all(
			validGridData.map(async (item: any) => {
				const result = await latLonInfoByAddress(item.garageaddress1);
				// const result = item.garageaddress1 ? await latLonInfoByAddress(item.garageaddress1) : null;
				return {
					...item,
					latitude: result?.latitude || '',
					longitude: result?.longitude || '',
				};
			}),
		);
		const params = {
			avc_COMMAND: 'DATAUPLOAD',
			processtype: 'SPCM_CARDRIVER',
			saveList: saveList,
		};
		if (!params || params.saveList.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		// 유효성 검사 통과 못한 데이터 확인
		// const isProcessYN = params.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		// if (isProcessYN) {
		// 	showMessage({
		// 		content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
		// 		modalType: 'info',
		// 	});
		// 	return;
		// }
		const newCount = params.saveList.length;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${newCount}건
				수정 : 0건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveExcelList(params).then(res => {
				if (Array.isArray(res.data) && res.data.some((item: any) => item.processMsg)) {
					const rowsToUpdate = res.data;
					const updateData: any[] = [];
					const updateIndex: any[] = [];
					rowsToUpdate.forEach((row: any, index: any) => {
						updateIndex.push(index);
						updateData.push({
							processYn: row.processYn,
							processMsg: row.processMsg,
						});
					});

					gridRef.current.updateRows(updateData, updateIndex);
					showMessage({
						content: '정상 처리되지 않은 데이터가 있습니다.',
						modalType: 'info',
					});
					return;
				}

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

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
			// {
			// 	btnType: 'plus',
			// },
		],
	};

	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '차량_정보.xlsx',
		};

		fileUtil.downloadFile(params);
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	// 	gridRef.current.setGridData([
	// }, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="차량정보 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn
					gridBtn={gridBtn}
					gridTitle={'※텍스트 형식으로 입력해야 업로드 가능합니다.'}
					style={{ color: 'red' }}
				>
					{/* "양식 다운로드"를 gridBtn으로 넘기지 않고 버튼으로 추가 */}
					{/* <span>
						※엑셀 업로드 자료 생성 시 셀 서식에 텍스트, 숫자 포멧외 날짜, 사용자지정 포멧 등 사용 금지 및 셀에 서식 적용
						시 파일 업로드 시 오류 발생합니다.
					</span> */}
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

export default MsCarDriverUploadExcelPopup;
