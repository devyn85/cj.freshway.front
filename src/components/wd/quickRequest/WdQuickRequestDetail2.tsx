/*
 ############################################################################
 # FiledataField	: WdQuickRequestDetail2.tsx
 # Description		: 출고 > 출고작업 > 퀵주문접수(VOC)
 # Author			: sss
 # Since			: 25.12.10


 	const gridCol = [
	const gridCol1 = [
	const gridCol2 = [

 	상세 조회 - 집하지
	 ->searchDetail01List

	 	 
저장 - 접수처리	
	saveMasterListCenterRecept01 


 집하지 이동
   ->handleSelectApply	 

행삭제 버튼 클릭
	const deleteRows

 집하지 저장
 	saveDetailListDelivery01 

 저장 - 도착지
	saveDetailListDestination01

  외부 주문접수 API 호출
	  saveMasterListOrderRequest01Imp
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import {
	apiGetCenterList,
	apiGetTab2DetailList,
	apiPostGetOrderRequest01,
	apiPostsaveDetailListDelivery01,
	apiPostsaveDetailListDestination01,
	apiPostSaveMasterListCenterRecept01,
} from '@/api/wd/apiWdQuickRequest';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import { Button, InputText, InputTextArea, RadioBox, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Address } from 'react-daum-postcode';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
// Utils
import CmTextAreaPopup from '@/components/cm/popup/CmTextAreaPopup';
import CmZipSearch from '@/components/cm/popup/CmZipSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import {
	bindGridEvents,
	fnResize,
	handleRadioChange,
	handleSelectApply1,
	isChanged01,
	isDisabled,
	isGridChangedData,
	openDeliveryMemoModal,
	pickGridFields,
	tabClickDetail1,
	useOpenDaumPostcode,
} from '@/components/wd/quickRequest/WdQuickRequest';
import { validateForm } from '@/util/FormUtil';
import styled from 'styled-components';
// Redux
// API Call Function

const centerListData = apiGetCenterList;

const WdQuickRequestDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, formRef, formRef2 } = props; // Antd Form
	const [formGridRef1] = Form.useForm(); // 귀책정보 form
	const [formRef4] = Form.useForm(); // 귀책정보 form
	const [formRefChanged, setFormRefChanged] = useState(false); // 배송정보 form 변경여부
	const [formRef4Changed, setFormRef4Changed] = useState(false); // 귀책정보 form 변경여부
	const [formRefDisabled, setFormRefDisabled] = useState(true); // 배송정보 form 비활성화 여부
	const [formRef4Disabled, setFormRef4Disabled] = useState(true); // 귀책정보 form 비활성화 여부
	const [detailTotalCnt1, setDetailTotalCnt1] = useState(0);
	const [detailTotalCnt2, setDetailTotalCnt2] = useState(0);
	const [centerList, setCenterList] = useState<any[]>([]);
	const [radioValue, setRadioValue] = useState('1');
	const [radioValue1, setradioValue1] = useState('1');
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const [activeKeyDetail, setActiveKeyDetail] = useState('1'); // useState는 렌더링시간이 있어 정확하지 않아 activeKey 사용
	const [params, setParams] = useState(null);
	const respReasonOptions = getCommonCodeList('RESP_REASON_QUICK', ''); // 귀책사유 옵션
	const islVisibleCol = false; // 컬럼 보이기/숨기기 토글용 변수

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(); //	집하지 그리드
	ref.gridRef2 = useRef(); // 도착지 그리드
	const groupRef = useRef<HTMLUListElement>(null);
	const groupRef3 = useRef<HTMLUListElement>(null);
	const callPopModal01 = useRef(null);
	const deliveryMemoModalRef = useRef(null);

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 센터 리스트 조회
	 */
	const getCenterList = async () => {
		try {
			const params = {
				dccode: '',
				dcname: '',
			};
			const res = await centerListData(params);
			if (res && res.data) {
				const formattedData = [
					{ label: '선택', value: '' },
					...res.data.map((item: any) => ({
						cdNm: item.name,
						comCd: item.code,
						address1: item.address1,
						address2: item.address2,
						empname1: item.empname1,
						empphone1: item.empphone1,
						location: item.location,
					})),
				];
				//console.log(('센터 리스트 조회 성공');
				setCenterList(formattedData);
			}
		} catch (error) {}

		formRef2?.setFieldValue('center', gDccode || '');
	};

	/**
	 * 선택적용(집하지이동)) 버튼 클릭 시
	 * gridRef의 선택된 데이터를 gridRef1로 이동
	 * @param flag
	 */
	const handleSelectApply = async (flag: string) => {
		const gridRef = ref.gridRef.current;
		const gridRef1 = ref.gridRef1.current;
		const checkedItems = gridRef?.getCheckedRowItems();

		// 입력 값 검증
		const isValid = await validateForm(formRef);
		if (!isValid) {
			return;
		}

		// 선택된 행 체크
		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// vocQty 0보다 큰지 체크
		const invalidQty = checkedItems.find((item: any) => !item.item.vocQty || item.item.vocQty <= 0);
		if (invalidQty) {
			showAlert(null, 'VOC량이 0보다 큰 항목만 선택할 수 있습니다.');
			return;
		}

		// reservedate1이 있다면 reservedate2 필수 체크
		const reservedate1 = formRef.getFieldValue('reservedate1');
		const reservedate2 = formRef.getFieldValue('reservedate2');
		if (reservedate1 && !reservedate2) {
			showAlert(null, '예약일시(시분)를 선택해주세요.');
			return;
		}

		// ===== START: formRef 값으로 메인 그리드 업데이트 (체크된 ROW만) =====
		const formValues = formRef.getFieldsValue();

		// 체크된 첫 번째 행만 업데이트
		if (checkedItems && checkedItems.length > 0) {
			// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경(1/2)
			const allData = gridRef.getGridData();
			// checkedItems 구조에서 직접 _$uid 추출
			const checkedRowIds = checkedItems.map((item: any) => item._$uid);

			const checkedRowIndexes = new Set(checkedItems.map((item: any) => item.rowIndex));

			const newData = allData.map((row: any, index: number) => {
				if (checkedRowIndexes.has(index)) {
					return {
						...row,
						deliverytype: formValues.deliverytype ?? row.deliverytype,
						deliveryMethod: formValues.deliveryMethod ?? row.deliveryMethod,
						articleType: formValues.articleType ?? row.articleType,
						payType: formValues.payType ?? row.payType,
						reservedate1: formValues.reservedate1 ?? row.reservedate1,
						reservedate2: formValues.reservedate2 ?? row.reservedate2,
					};
				}
				return row;
			});

			// setGridData 대신 updateRowsById 사용햐여 변경된 행만 업데이트
			if (newData.length > 0) {
				gridRef.updateRowsById(newData, true); // isMarkEdited: true
			}
			// 이전에 체크된 행들을 다시 체크합니다. (비동기로 처리하여 grid 업데이트 후 실행)
			setTimeout(() => {
				gridRef.setCheckedRowsByIds(checkedRowIds);
			}, 0);
		}
		// ===== END: formRef 값으로 메인 그리드 업데이트 =====

		// 탭을 1번째(집하지)로 이동
		setActiveKeyDetail('1');
		formRef2.setFieldValue('activeKey', '1');
		fnResize('1', ref);

		// 센터 또는 주소 검증
		const center = formRef2.getFieldValue('center'); // 센터 선택 값
		const address1 = formRef2.getFieldValue('address1'); // 주소 입력 값
		const address2 = formRef2.getFieldValue('address2'); // 상세주소 입력 값
		//const zonecode = formRef2.getFieldValue('zonecode'); // 우편번호 입력 값

		if (radioValue === '1' && !center) {
			showAlert(null, '센터를 선택해주세요.');
			return;
		}

		if (radioValue === '2' && !address1) {
			showAlert(null, '주소를 입력해주세요.');
			return;
		}
		// radioValue가 2일 때 address2 필수 체크
		if (radioValue === '2' && !address2) {
			showAlert(null, '상세주소를 입력해주세요.');
			return;
		}

		// 센터 정보 조회 (센터 선택 시)
		let centerInfo = null;
		if (radioValue === '1') {
			const centerObj = centerList.find((c: any) => c.comCd === center);
			if (centerObj) {
				centerInfo = {
					address1: centerObj?.address1 || '',
					address2: centerObj?.address2 || '',
					empname1: centerObj.empname1 || '',
					empphone1: centerObj.empphone1 || '',
					location: centerObj.location || '',
				};
			} else {
				showAlert(null, '센터 정보를 조회할 수 없습니다.');
				return;
			}
		}

		const existingData = gridRef1?.getGridData() || [];
		const gthNm = radioValue === '1' ? centerList.find((c: any) => c.comCd === center)?.cdNm || '' : '';

		// checkedItems를 기존 sku 밑에 추가
		let updatedData = [...existingData];
		checkedItems.forEach((checkedItem: any) => {
			const rowData = checkedItem.item;
			// formRef의 모든 필드값 가져오기
			let reservedate = '';
			if (formRef && typeof formRef.getFieldsValue === 'function') {
				// reservedate1/reservedate2 합치기
				const rd1 = formRef.getFieldValue('reservedate1');
				const rd2 = formRef.getFieldValue('reservedate2');
				if (rd1 && rd2) {
					reservedate = `${rd1} ${rd2}`;
				} else if (rd1) {
					reservedate = rd1;
				} else if (rd2) {
					reservedate = rd2;
				}
			}
			const newRow = {
				gthSeq: 0, // 임시, 아래서 재정렬
				gthCd: radioValue === '1' ? center : '',
				gthNm: gthNm,
				gthAddr: radioValue === '1' ? centerInfo?.address1 || '' : address1,
				gthAddrdtl: radioValue === '1' ? centerInfo?.address2 || '' : address2,
				gthEmpNm: radioValue === '1' ? centerInfo?.empname1 || '' : '',
				gthTel: radioValue === '1' ? centerInfo?.empphone1 || '' : '', // 집하지연락처
				location: radioValue === '1' ? centerInfo?.location || '' : '',
				sku: rowData.sku || '',
				skuInfo: rowData.skuInfo || '',
				uom: rowData.uom || '',
				vocQty: rowData.vocQty || 0,
				loc: rowData.loc || 0,
				rcptNo: rowData.rcptNo,
				vocno: rowData.vocno,
				vsrno: rowData.vsrno,
				vocUom: rowData.vocUom || '',
				docno: rowData.docno,
				docline: rowData.docline,
				serialkey: rowData.serialkey,
				dccode: form.getFieldValue('fixdccode') ?? '',
				reservedate,
				deliverytype: formValues.deliverytype,
				deliveryMethod: formValues.deliveryMethod,
				articleType: formValues.articleType,
				payType: formValues.payType,
				rowStatus: 'I', // 신규 행 상태로 설정
			};

			if (rowData.sku) {
				// 같은 sku가 있는 마지막 위치 찾기
				const lastIdx = [...updatedData].reverse().findIndex(item => item.sku === rowData.sku);
				if (lastIdx !== -1) {
					const insertIdx = updatedData.length - lastIdx;
					updatedData.splice(insertIdx, 0, newRow);
				} else {
					updatedData.push(newRow);
				}
			} else {
				updatedData.push(newRow);
			}
		});

		// vocno/vsrno 중복 체크 및 중복 제거 (추가 후 전체 데이터 기준)
		const filteredData = removeDuplicateVocnoVsrno(updatedData);
		if (filteredData.length < updatedData.length) {
			// 중복이 있었음을 알림 (하지만 처리는 계속)
			const removedCount = updatedData.length - filteredData.length;
			showAlert(null, `VOC번호/VSR번호가 중복된 ${removedCount}개 행이 제외되었습니다.`);
		}
		updatedData = filteredData;

		// gthSeq 재정렬
		updatedData = updatedData.map((item, idx) => ({ ...item, gthSeq: idx + 1 }));
		gridRef1?.setGridData(updatedData);

		// 모든 행 체크박스 체크 (gridRef1)
		if (gridRef1 && typeof gridRef1.setAllCheckedRows === 'function') {
			gridRef1.setAllCheckedRows(true);
		}

		// 상세목록 총 개수 업데이트
		setDetailTotalCnt1(updatedData.length);
	};

	/**
	 * 선택적용 - 집하지 적용
	 * ref.gridRef1의 데이터를 ref.gridRef2(도착지)에 적용
	 */
	/**
	 * 행삭제 버튼 클릭
	 * @returns
	 */
	const deleteRows = () => {
		const gridRef = ref.gridRef1.current;
		const chk = gridRef.getCheckedRowItems();

		if (chk.length === 0) {
			showAlert('', '삭제할 행을 선택해 주세요.');
			return;
		}
		if (chk.filter((row: any) => row.item.delYn === 'Y').length > 0) {
			showAlert('', '이미 삭제된 행이 존재합니다.');
			return;
		}
		// chk.forEach((row: any) => {
		// 	gridRef.removeRowByRowId(row.item._$uid);
		// });
		chk.forEach((row: any) => {
			const item = row.item ?? row;

			// rowStatus가 'I'면 그리드에서 완전히 삭제
			if (item.rowStatus === 'I') {
				// START.행을 아예 안보이게 삭제
				const gridRef = ref.gridRef1.current;
				// 1. 하단 그리드 체크된 항목
				const checkedItems = gridRef?.getCheckedRowItemsAll();
				// 2. 하단 그리드 전체 데이터
				const newGridData = gridRef?.getGridData();
				// 3. 하단 그리드에서 체크된 데이터
				const checkedUids = checkedItems.map((item: any) => item._$uid);
				// 4. 하단 그리드에서 체크된 데이터 제외 한 나머지 데이터
				const newData = newGridData.filter((item: any) => !checkedUids.includes(item._$uid));
				// 6. 나머지 데이터를 하단 그리드에 바인딩
				gridRef?.setGridData(newData);
				// 7. 상세목록 총 개수 업데이트
				setDetailTotalCnt1(newData.length);
				// END.행을 아예 안보이게 삭제
			} else {
				// 기존 행은 삭제 상태로 표시만 하고 그리드에서 제거
				item.rowStatus = 'D';
				item.delYn = 'Y';
				gridRef.removeRowByRowId(item._$uid);
			}
		});
	};

	/**
	 * 저장 - 접수마스터
	 */
	const saveMasterListCenterRecept01 = async () => {
		const gridRef = ref.gridRef.current;

		// START.rowStatus 처리
		// 체크된 행 + 삭제된 행(rowStatus === 'D') 모두 포함
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		const removedItems = gridRef.getRemovedItems(); // 삭제된 행
		const removedUidSet = new Set<string>((removedItems || []).map((ri: any) => ri.item?._$uid ?? ri._$uid));
		// 체크된 데이터 중 삭제된 행은 rowStatus='D'로, 신규행은 'I'로, 수정된 행은 'U'로 세팅
		const saveList = (checkedRows || []).map((ci: any) => {
			const it = ci.item ?? ci;
			if (removedUidSet.has(it._$uid) || it.delYn === 'Y' || it.rowStatus === 'D') {
				return { ...it, rowStatus: 'D', delYn: it.delYn ?? 'Y' };
			}
			// 신규 행 체크 (rowStatus가 'I'이거나 기존에 없던 행)
			if (it.rowStatus === 'I') {
				return { ...it, rowStatus: 'I' };
			}
			return { ...it, rowStatus: 'U' };
		});
		// END.rowStatus 처리

		if (!isChanged01(formRefChanged, ref.gridRef.current, removedItems)) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		if (removedItems.length === 0 && removedItems.length === 0) {
			// 행삭제가 없을 경우만 체크
			// validation
			if (!gridRef.validateRequiredGridData()) return;

			// 입력 값 검증 (필수 입력 체크)
			const isValid = await validateForm(formRef4);
			if (!isValid) {
				return;
			}

			// validation
			if (!gridRef.validateRequiredGridData()) return;
		}

		// 저장하시겠습니까? - 접수정보
		showConfirm(null, t('msg.confirmSave'), () => {
			const formRef1Values = formRef && typeof formRef.getFieldsValue === 'function' ? formRef.getFieldsValue() : {};
			const formRef4Values = formRef4 && typeof formRef4.getFieldsValue === 'function' ? formRef4.getFieldsValue() : {};

			const params = {
				saveList01: saveList, // 선택된 행의 데이터
				fixdccode: form.getFieldValue('fixdccode') ?? '',
				...formRef1Values, // 배송정보-상단
				...formRef4Values, // 귀속정보-하단
			};

			apiPostSaveMasterListCenterRecept01(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					ref.gridRef1?.current?.clearGridData();
					ref.gridRef2?.current?.clearGridData();
					props.search();
				}
			});
		});
	};

	/**
	 * 저장 - 집하지
	 */
	const saveDetailListDelivery01 = async () => {
		const gridRef = ref.gridRef1.current;
		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		const checkedRows = gridRef.getCheckedRowItemsAll();
		if (!selectedRow || !selectedRow[0]) return;

		setActiveKeyDetail('1');

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, '집하지 목록에' + t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 입력 값 검증 (필수 입력 체크) - 집하지 저장 시에는 필수 입력 체크만 수행
		const isValid = await validateForm(formRef);
		if (!isValid) {
			return;
		}

		// 입력 값 검증 (필수 입력 체크) - 귀책정보 탭의 필수 입력 체크도 함께 수행
		const isValid3 = await validateForm(formRef4);
		if (!isValid3) {
			return;
		}

		// validation
		if (!gridRef.validateRequiredGridData()) return;

		const gridData = gridRef.getGridData();

		// gthSeq 0 체크
		const zeroSeqRow = gridData.find((row: any) => row.gthSeq === 0 || row.gthSeq === '0');
		if (zeroSeqRow) {
			showAlert(null, '집하지순서 값이 0인 행이 있습니다. 1 이상의 값을 입력해주세요.');
			return;
		}

		// gthSeq 중복 체크
		const seqCount: { [key: string]: number } = {};
		gridData.forEach((row: any) => {
			const seq = row.gthSeq;
			if (seq !== undefined && seq !== null && seq !== '') {
				seqCount[seq] = (seqCount[seq] || 0) + 1;
			}
		});

		const dupSeqs = Object.keys(seqCount).filter(seq => seqCount[seq] > 1);
		if (dupSeqs.length > 0) {
			showAlert(null, `집하지순서(gthSeq) 값이 중복된 행이 있습니다: ${dupSeqs.join(', ')}`);
			return;
		}

		// gthSeq 순서 체크 (1부터 순차적으로 증가하는지 검증)
		const seqValues = gridData.map((row: any) => Number(row.gthSeq)).sort((a: number, b: number) => a - b);
		const expectedSeq = Array.from({ length: seqValues.length }, (_, i) => i + 1);
		const isSequential = seqValues.every((val: number, idx: number) => val === expectedSeq[idx]);
		if (!isSequential) {
			showAlert(null, `집하지순서(gthSeq)가 1부터 순차적으로 증가하지 않습니다.\n현재 값: [${seqValues.join(', ')}]`);
			return;
		}

		// 주소 패턴 체크 (유틸 함수 사용)
		// const invalidAddressRow = gridData.find((row: any) => row.gthAddr && !isValidAddressPattern(row.gthAddr));
		// if (invalidAddressRow) {
		// 	showAlert(null, `주소 형식이 올바르지 않은 행이 있습니다.\n[${invalidAddressRow.gthAddr}]`);
		// 	return;
		// }

		// START.rowStatus 처리
		// 체크된 데이터 중 삭제된 행은 rowStatus='D'로, 신규행은 'I'로, 수정된 행은 'U'로 세팅
		const removedItems = gridRef.getRemovedItems(); // 삭제된 행
		const removedUidSet = new Set<string>((removedItems || []).map((ri: any) => ri.item?._$uid ?? ri._$uid));
		const saveList = (checkedRows || []).map((ci: any) => {
			const it = ci.item ?? ci;
			if (removedUidSet.has(it._$uid) || it.delYn === 'Y' || it.rowStatus === 'D') {
				return { ...it, rowStatus: 'D', delYn: it.delYn ?? 'Y' };
			}
			// 신규 행 체크 (rowStatus가 'I'이거나 기존에 없던 행)
			if (it.rowStatus === 'I') {
				return { ...it, rowStatus: 'I' };
			}
			return { ...it, rowStatus: 'U' };
		});
		// END.rowStatus 처리

		// 저장하시겠습니까? - 집하지
		showConfirm(null, t('msg.confirmSave'), () => {
			const formRef1Values = formRef && typeof formRef.getFieldsValue === 'function' ? formRef.getFieldsValue() : {};
			const formRef4Values = formRef4 && typeof formRef4.getFieldsValue === 'function' ? formRef4.getFieldsValue() : {};

			// ...formRef1Values, // 배송정보-상단

			const params = {
				saveList02: saveList, // 선택된 행의 데이터 - 디테일
				fixdccode: form.getFieldValue('fixdccode') ?? '',
				//...pickGridFields(selectedRow[0], gridCol), // 마스터 정보 - 그리드 dataField만 추출
				...formRef1Values, // 배송정보-상단
				...formRef4Values, // 귀속정보
			};

			apiPostsaveDetailListDelivery01(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
			});
		});
	};

	/**
	 * 저장 - 도착지
	 */
	const saveDetailListDestination01 = async () => {
		const gridRef = ref.gridRef2.current;
		const checkedRows = ref.gridRef2?.current.getCheckedRowItemsAll();
		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		if (!selectedRow || !selectedRow[0]) return;

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, '도착지 목록에' + t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// const isChanged = gridRef.getChangedData({ validationYn: false });
		// if (!isChanged || isChanged.length < 1) {
		// 	showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
		// 	return;
		// }

		// validation
		if (!gridRef.validateRequiredGridData()) return;
		const gridData = gridRef.getGridData();

		// toSeq 0 체크
		const zeroSeqRow = gridData.find((row: any) => row.toSeq === 0 || row.toSeq === '0');
		if (zeroSeqRow) {
			showAlert(null, '도착지순서 값이 0인 행이 있습니다. 1 이상의 값을 입력해주세요.');
			return;
		}

		// toSeq 중복 체크
		const seqCount: { [key: string]: number } = {};
		gridData.forEach((row: any) => {
			const seq = row.toSeq;
			if (seq !== undefined && seq !== null && seq !== '') {
				seqCount[seq] = (seqCount[seq] || 0) + 1;
			}
		});
		const dupSeqs = Object.keys(seqCount).filter(seq => seqCount[seq] > 1);
		if (dupSeqs.length > 0) {
			showAlert(null, `도착지순서(toSeq) 값이 중복된 행이 있습니다: ${dupSeqs.join(', ')}`);
			return;
		}

		// 주소 패턴 체크 (유틸 함수 사용)
		// const invalidAddressRow = gridData.find((row: any) => row.gthAddr && !isValidAddressPattern(row.address));
		// if (invalidAddressRow) {
		// 	showAlert(null, `주소 형식이 올바르지 않은 행이 있습니다.\n[${invalidAddressRow.address}]`);
		// 	return;
		// }

		// 입력 값 검증
		const isValid = await validateForm(formRef);
		if (!isValid) {
			return;
		}

		// 입력 값 검증 (필수 입력 체크) - 귀책정보 탭의 필수 입력 체크도 함께 수행
		const isValid3 = await validateForm(formRef4);
		if (!isValid3) {
			return;
		}

		// START.rowStatus 처리
		// 체크된 데이터 중 삭제된 행은 rowStatus='D'로, 신규행은 'I'로, 수정된 행은 'U'로 세팅
		const removedItems = gridRef.getRemovedItems(); // 삭제된 행
		const removedUidSet = new Set<string>((removedItems || []).map((ri: any) => ri.item?._$uid ?? ri._$uid));
		const saveList = (checkedRows || []).map((ci: any) => {
			const it = ci.item ?? ci;
			if (removedUidSet.has(it._$uid) || it.delYn === 'Y' || it.rowStatus === 'D') {
				return { ...it, rowStatus: 'D', delYn: it.delYn ?? 'Y' };
			}
			// 신규 행 체크 (rowStatus가 'I'이거나 기존에 없던 행)
			if (it.rowStatus === 'I') {
				return { ...it, rowStatus: 'I' };
			}
			return { ...it, rowStatus: 'U' };
		});
		// END.rowStatus 처리

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const formRef4Values = formRef4 && typeof formRef4.getFieldsValue === 'function' ? formRef4.getFieldsValue() : {};
			const params = {
				saveList03: saveList, // 선택된 행의 데이터
				fixdccode: form.getFieldValue('fixdccode') ?? '',
				...pickGridFields(selectedRow[0], gridCol), // 마스터 정보 - 그리드 dataField만 추출
				...formRef4Values, // 귀속정보
			};

			// 집하지처리 저장 API 호출
			apiPostsaveDetailListDestination01(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
					//searchDetail02List();
				}
			});
		});
	};

	/**
	 * VOC번호/VSR번호 중복 제거 함수
	 * 중복된 항목 중 첫 번째만 유지하고 나머지는 제거
	 * @param data
	 * @returns 중복이 제거된 데이터
	 */
	function removeDuplicateVocnoVsrno(data: any[]): any[] {
		const seenKeys = new Set<string>();
		return data.filter((row: any) => {
			const vocno = row.vocno ?? '';
			const vsrno = row.vsrno ?? '';
			const key = `${vocno}__${vsrno}`;

			// vocno와 vsrno가 모두 있는 경우에만 중복 체크
			if (vocno !== '' && vsrno !== '') {
				if (seenKeys.has(key)) {
					return false; // 중복 제거
				}
				seenKeys.add(key);
			}
			return true; // 유지
		});
	}

	// SATART.그리드 우편번호 팝업 (직접 열기용, ref 준비 전 대비)
	const openDaumPostcode = useOpenDaumPostcode();
	const zipPopupContext = useRef<{ dataField: string; gridRef: any; rowIndex: number } | null>(null);
	const fnZipPopup = (dataField: string, gridRef: any, rowIndex: any) => {
		// 컨텍스트 저장
		zipPopupContext.current = { dataField, gridRef, rowIndex };
		openDaumPostcode({ onComplete: handleComplete });
	};

	// 우편번호 팝업 완료 콜백
	const handleComplete = (data: Address) => {
		let fullAddress = data.address;
		let extraAddress = '';

		if (data.addressType === 'R') {
			if (data.bname !== '') {
				extraAddress += data.bname;
			}
			if (data.buildingName !== '') {
				extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
			}
			fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
		}

		// 저장된 컨텍스트 사용
		if (zipPopupContext.current) {
			const { dataField, gridRef, rowIndex } = zipPopupContext.current;
			const addressInfo = { fullAddress: '', zonecode: '' };
			addressInfo.zonecode = data.zonecode;
			addressInfo.fullAddress = fullAddress;

			// 그리드에 적용
			const gridData = gridRef.current.getGridData();
			if (gridData && gridData[rowIndex]) {
				const updatedRow = { ...gridData[rowIndex] };

				updatedRow[dataField] = addressInfo.fullAddress;

				gridData[rowIndex] = updatedRow;
				gridRef.current.setGridData(gridData);
			}
		}
	};
	// END.그리드 우편번호 팝업

	/**
	 * 팝업 콜백 함수 (주소)
	 * @param idx
	 * @param gridRef
	 * @param {object} addressInfo 주소 정보
	 */
	const handleAddressCallback = (addressInfo: any) => {
		formRef2.setFieldValue('address1', addressInfo.fullAddress);
		formRef2.setFieldValue('zonecode', addressInfo.zonecode);

		formRef2.scrollToField('address2');
		(document.querySelector('input[name="address2"]') as HTMLInputElement)?.focus();
	};

	/**
	 * 팝업 콜백 함수 (주소)
	 * @param idx
	 * @param gridRef
	 * @param {object} addressInfo 주소 정보
	 */
	const handleAddressCallback3 = (addressInfo: any) => {
		formGridRef1.setFieldValue('address1', addressInfo.fullAddress);
		formGridRef1.setFieldValue('zonecode', addressInfo.zonecode);

		formGridRef1.scrollToField('address2');
		(document.querySelector('input[name="address2"]') as HTMLInputElement)?.focus();
	};

	/**
	 * 배송메모 팝업 열기
	 * @param memo - 배송메모 값
	 * @param rmk
	 */
	/**
	 * 배송메모 팝업 닫기
	 */
	const callClosePopPopup02 = () => {
		deliveryMemoModalRef.current?.handlerClose?.();
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼 - 접수목록 접수내역 - tab2
	const gridCol = [
		{
			dataField: 'statusnm',
			headerText: t('lbl.STATUS_DP'), // 진행상태
			width: 80,
			dataType: 'code',
			editable: false,
			cellMerge: true,
			mergeRef: 'rcptNo',
			mergePolicy: 'restrict',
			styleFunction: commUtil.styleBackGround01,
		}, // 진행상태
		{
			dataField: 'rcptNo',
			headerText: t('센터접수번호'),
			width: 120,
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'rcptNo',
			mergePolicy: 'restrict',
			editable: false,
		}, // 센터접수번호
		{
			dataField: 'rcptDate',
			headerText: t('센터접수일자'),
			width: 100,
			dataType: 'date',
			editable: false,
		}, // 센터접수일자
		{
			dataField: 'quickDocno',
			headerText: t('퀵주문번호'),
			width: 120,
			dataType: 'code',
			cellMerge: true,
			mergeRef: 'rcptNo',
			mergePolicy: 'restrict',
			editable: false,
		}, // 센터접수번호
		{
			dataField: 'reqDepartment',
			headerText: t('요청부서'), // 			headerText: t('요청부서'), // 담당자
			width: 200,
			dataType: 'name',
			editable: false,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true, // ssss
			},
			maxlength: 20,
		},
		{ dataField: 'reqId', editable: false, visible: islVisibleCol }, // 요청자id
		{
			dataField: 'reqNm',
			headerText: t('요청자'), // 요청자
			width: 100,
			dataType: 'name',
			editable: false,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
		},
		{ dataField: 'vocno', headerText: t('VOC번호'), width: 120, dataType: 'code', editable: false }, // VOC번호
		{ dataField: 'vsrtypenm', headerText: t('VSR유형명'), width: 120, dataType: 'code', editable: false }, // VSR유형명
		{ dataField: 'vsrno', headerText: t('VSR번호'), width: 120, dataType: 'code', editable: false }, // VSR번호
		{ dataField: 'docno', headerText: t('주문번호'), width: 120, dataType: 'code', editable: false }, // 주문번호
		{ dataField: 'docline', headerText: t('주문순번'), width: 120, dataType: 'code', editable: false }, // 주문순번
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			disableMoving: true,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		},
		// {
		// 	dataField: 'skuname',
		// 	headerText: t('lbl.SKUNAME'), // 상품명
		// 	width: 120,
		// 	editable: false,
		// 	filter: { showIcon: true },
		// 	disableMoving: true,
		// },

		{ dataField: 'skuInfo', headerText: t('상품내역'), editable: false, dataType: 'name' }, // 상품내역
		{ dataField: 'orderqty', headerText: t('주문량'), editable: false, dataType: 'numeric' }, // 주문량
		{ dataField: 'orderuom', headerText: t('주문단위'), editable: false, dataType: 'code' }, //  주문단위
		{ dataField: 'vocQty', headerText: t('VOC량'), editable: false, dataType: 'numeric' }, // VOC량
		{ dataField: 'vocUom', headerText: t('VOC단위'), editable: false, dataType: 'code' }, // VOC단위
		{ dataField: 'qty2600', headerText: '이천(2600)', dataType: 'numeric', editable: false },
		{ dataField: 'qty2620', headerText: '수원(2620)', dataType: 'numeric', editable: false },
		{ dataField: 'qty2630', headerText: '수원2(2630)', dataType: 'numeric', editable: false },
		{ dataField: 'qty2650', headerText: '동탄(2650)', dataType: 'numeric', editable: false },
		{ dataField: 'qty2660', headerText: '동탄2(2660)', dataType: 'numeric', editable: false },
		{ dataField: 'qty2230', headerText: '장성(2230)', dataType: 'numeric', editable: false },
		{ dataField: 'qty2260', headerText: '양산(2260)', dataType: 'numeric', editable: false },

		{
			dataField: 'deliverymemo',
			headerText: t('배송메모'), // 배송메모
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					// 편집 불가능한 상태에서는 팝업을 띄우지 않음
					// if (isDisabled(e.item)) {
					// 	return;
					// }
					openDeliveryMemoModal(e.item.deliverymemo || '', setParams, deliveryMemoModalRef);
				},
			},
			editable: false,
			width: 150,
			style: 'left',
		},
		{
			dataField: 'loc',
			headerText: t('로케이션'),
			width: 120,
			dataType: 'code',
			editable: false,
		}, // 로케이션

		/*START.hidden 컬럼*/
		// 배송정보 - VOC퀵은 1개이상의 VOC번호가 있을 수 있으므로, 배송정보는 그리드 숨김컬럼으로 처리
		{ dataField: 'deliverytype', editable: false, visible: islVisibleCol }, // 배송방법
		{ dataField: 'deliveryMethod', editable: false, visible: islVisibleCol }, // 배송수단
		//{ dataField: 'deliveryOption', editable: false, visible: islVisibleCol }, // 배송선택
		{ dataField: 'articleType', editable: false, visible: islVisibleCol }, // 물품종류
		{ dataField: 'payType', editable: false, visible: islVisibleCol }, // 지급구분
		{ dataField: 'reservedate1', editable: false, visible: islVisibleCol }, // 예약일
		{ dataField: 'reservedate2', editable: false, visible: islVisibleCol }, // 예약일시
		//
		{ dataField: 'gthAddrFull', editable: false, visible: islVisibleCol }, // 주소(풀주소)
		//

		{ dataField: 'vsrtype', headerText: t('VSR유형'), dataType: 'code', visible: islVisibleCol }, // VSR유형
		{ dataField: 'status', editable: false, visible: islVisibleCol }, // 상태(01:VOC퀵요청,02:센터접수,03:퀵주문등록,04:퀵주문취소등록,05:퀵주문처리완료,06:퀵주문취소완료))
		{ dataField: 'gthCd', editable: false, visible: islVisibleCol }, // 집하지코드
		{ dataField: 'gthNm', visible: islVisibleCol }, // 센터/상호
		{ dataField: 'gthSeq', visible: islVisibleCol }, // 경유지순서
		{ dataField: 'serialkey', editable: false, visible: islVisibleCol }, // serialkey
		{ dataField: 'dccode', editable: false, visible: islVisibleCol }, // dccode
		//
		{ dataField: 'respDept', editable: false, visible: islVisibleCol }, // 귀책부서
		{ dataField: 'respReason', editable: false, visible: islVisibleCol }, // 귀책사유
		{ dataField: 'respEmp', editable: false, visible: islVisibleCol }, // 귀책담당자
		{ dataField: 'memo', editable: false, visible: islVisibleCol }, // 메모
		{ dataField: 'rmk', editable: false, visible: islVisibleCol }, // 비고

		/*END.hidden 컬럼*/
	];

	// 그리드 Props - 집하지 목록
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		independentAllCheckBox: false,
		// 헤더 전체체크 숨김
		showRowAllCheckBox: false,
		fillColumnSizeMode: false,
		showFooter: false,
		fixedColumnCount: 2,
		enableCellMerge: true, // 셀 병합 실행
		// 행 체크 칼럼(엑스트라 체크박스)의 병합은 rcptNo 필드와 동일하게 병합 설정
		rowCheckMergeField: 'rcptNo',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
		//height: 150,
		//autoGridHeight: true,
	};
	// FooterLayout Props
	const footerLayout = [{ dataField: 'vocQty', positionField: 'vocQty', operation: 'SUM', formatString: '#,##0' }];

	// 실제로는 버튼 클릭 등에서 아래 함수를 호출하면 됨
	const saveMasterListOrderRequest01 = async () => {
		await saveMasterListOrderRequest01Imp();
	};

	// 그리드 버튼 - 마스터
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'save', // 저장
			// 	btnLabel: t('lbl.SAVE'), // 저장
			// 	authType: 'save', // 권한
			// 	callBackFn: saveMasterListCenterRecept02, // 접수내역 저장
			// },
			{
				btnType: 'delete', // 행삭제
				isActionEvent: false,
				callBackFn: () => {
					const gridRef = ref.gridRef.current;
					const chk = gridRef.getCheckedRowItems();

					if (chk.length === 0) {
						showAlert('', '삭제할 행을 선택해 주세요.');
						return;
					}
					if (chk.filter((row: any) => row.item.delYn === 'Y').length > 0) {
						showAlert('', '이미 삭제된 행이 존재합니다.');
						return;
					}
					// chk.forEach((row: any) => {
					// 	gridRef.removeRowByRowId(row.item._$uid);
					// });
					chk.forEach((row: any) => {
						const item = row.item ?? row;
						// 삭제 상태를 원본 객체에 직접 세팅
						item.rowStatus = 'D';
						item.delYn = 'Y';
						// 그리드에서 제거
						gridRef.removeRowByRowId(item._$uid);
					});
				},
			},
			{
				btnType: 'btn2', // 저장
				btnLabel: t('lbl.SAVE'), // 저장
				authType: 'save', // 권한
				callBackFn: saveMasterListCenterRecept01, // 접수내역 저장
			},
			{
				btnType: 'save', // 퀵주문접수
				btnLabel: t('퀵센터접수'), // 퀵주문접수
				authType: 'save', // 권한
				callBackFn: saveMasterListOrderRequest01,
			},
		],
	};

	/**
	 * 외부 주문접수 API 호출
	 * @param payload
	 * @param params
	 * @param params1
	 */
	const saveMasterListOrderRequest01Imp = async (): Promise<any> => {
		const gridRef = ref.gridRef.current;
		const checkedItems = gridRef?.getCheckedRowItems();
		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		if (!selectedRow || !selectedRow[0]) return;

		// 선택된 행 체크
		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		if (ref.gridRef1.current.getGridData().length < 1) {
			showAlert(null, '집하지 목록에 데이터가 없습니다.');
			return;
		}

		// if (ref.gridRef2.current.getGridData().length < 1) {
		// 	showAlert(null, '도착지 목록에 데이터가 없습니다.');
		// 	return;
		// }

		const formRef4Values = formRef4 && typeof formRef4.getFieldsValue === 'function' ? formRef4.getFieldsValue() : {};

		const params = {
			saveList01: ref.gridRef.current.getCheckedRowItemsAll(), // 선택된 행의 데이터
			fixdccode: form.getFieldValue('fixdccode') ?? '',
			...pickGridFields(selectedRow[0], gridCol), // 마스터 정보 - 그리드 dataField만 추출
			...formRef4Values, // 귀속정보
		};

		// 퀵주문접수 등록을 처리하시겠습니까?
		showConfirm(null, t('퀵주문접수 등록을 처리하시겠습니까?'), () => {
			apiPostGetOrderRequest01(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다 xxxx
					props.search();
				}
			});
		});
	};

	// 그리드 컬럼(상세목록 그리드) - 집하지
	const gridCol1 = [
		{
			dataField: 'gthSeq',
			headerText: t('경유지순서'), // 경유지순서
			width: 100,
			dataType: 'numeric',
			editable: true,
			required: true,
			maxlength: 20,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'gthCd',
			headerText: t('센터/상호코드'), // 센터/상호코드
			width: 120,
			dataType: 'code',
			required: true,
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'gthNm',
			headerText: t('센터/상호명'),
			width: 150,
			dataType: 'name',
			required: true,
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				maxlength: 10,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					return 'isEdit';
				}
			},
		}, // 센터/상호
		{
			dataField: 'gthAddr',
			headerText: t('주소'), // 주소 - 집하지
			commRenderer: {
				type: 'search',
				//iconPosition: 'aisleRight',
				onClick: function (e: any) {
					// 편집 불가능한 상태에서는 팝업을 띄우지 않음
					if (isDisabled(e.item)) {
						return;
					}
					fnZipPopup('gthAddr', ref.gridRef1, e.rowIndex);
				},
			},
			editable: false,
			width: 250,
			style: 'left',
			required: true,
		},
		{
			dataField: 'gthAddrdtl',
			headerText: t('상세주소'), // 상세주소- 집하지
			width: 100,
			dataType: 'name',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			required: true,
			maxlength: 20,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'gthEmpNm',
			headerText: t('담당자'), // 담당자- 집하지
			width: 100,
			dataType: 'name',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			required: true,
			maxlength: 20,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'gthTel',
			headerText: t('연락처'), // 연락처- 집하지
			width: 120,
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			required: true,
			maxlength: 20,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'loc',
			headerText: t('로케이션'),
			width: 120,
			dataType: 'code',
			editable: false,
			required: true,
		}, // 로케이션
		{
			dataField: 'sku',
			headerText: t('상품코드'),
			width: 120,
			dataType: 'code',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		}, // 상품코드
		//{ dataField: 'skuname', headerText: t('상품명'), width: 200, dataType: 'name', editable: true }, // 상품명
		{
			dataField: 'skuInfo',
			headerText: t('상품내역'),
			dataType: 'name',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		}, // 상품내역 - 집하지
		{ dataField: 'vocUom', headerText: t('VOC단위'), editable: false, dataType: 'code' }, // VOC단위
		{ dataField: 'vocUomnm', headerText: t('VOC단위명'), editable: false, dataType: 'code', visible: false }, // VOC단위명
		{
			dataField: 'vocQty',
			headerText: t('수량'),
			width: 100,
			dataType: 'numeric',
			editable: false,
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (isDisabled(item)) {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef1.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		}, // 수량
		{
			dataField: 'memo',
			headerText: t('메모'),
			width: 300,
			dataType: 'name',
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef1.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		}, // 메모

		/*START.hidden 컬럼 */
		{ dataField: 'vsrno', headerText: t('VSR번호'), editable: false, visible: islVisibleCol }, // VSR번호
		{ dataField: 'docno', headerText: t('주문번호'), editable: false, visible: islVisibleCol }, // 주문번호
		{ dataField: 'dccode', editable: false, visible: islVisibleCol }, // dccode
		//
		{ dataField: 'deliverytype', editable: false, visible: islVisibleCol }, // 배송방법
		{ dataField: 'deliveryMethod', editable: false, visible: islVisibleCol }, // 배송수단
		{ dataField: 'articleType', editable: false, visible: islVisibleCol }, // 물품종류
		{ dataField: 'payType', editable: false, visible: islVisibleCol }, // 지급구분
		{ dataField: 'reservedate', editable: false, visible: islVisibleCol }, // 예약일시
		{ dataField: 'docno', headerText: t('주문번호'), editable: false, visible: islVisibleCol }, // 주문번호
		{ dataField: 'docline', headerText: t('주문순번'), editable: false, visible: islVisibleCol }, // 주문순번
		{ dataField: 'uom', headerText: t('상품단위'), editable: false, visible: islVisibleCol }, // 상품단위
		//
		{ dataField: 'serialkey', editable: false, visible: islVisibleCol }, // serialkey
		{ dataField: 'rcptNo', editable: false, visible: islVisibleCol }, // 센터접수번호
		{ dataField: 'status', editable: false, visible: islVisibleCol }, // 상태(01:VOC퀵요청,02:센터접수,03:퀵주문등록,04:퀵주문취소등록,05:퀵주문처리완료,06:퀵주문취소완료))

		{ dataField: 'respDept', editable: false, visible: islVisibleCol }, // 귀책부서
		{ dataField: 'respReason', editable: false, visible: islVisibleCol }, // 귀책사유
		{ dataField: 'respEmp', editable: false, visible: islVisibleCol }, // 귀책담당자
		{ dataField: 'itemCnt', editable: false, visible: islVisibleCol }, // 아이템수
		{ dataField: 'rowStatus', editable: false, visible: islVisibleCol }, // rowStatus
		/*END.hidden 컬럼*/
	];

	// FooterLayout Props
	const footerLayout1 = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol1[0].dataField, // 첫 번째 dataField 사용
		},
	];

	// 그리드 Props - 집하지
	const gridProps1 = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		independentAllCheckBox: false,
		fillColumnSizeMode: false,
		showFooter: false,
		//fixedColumnCount: 2,
		isLegacyRemove: true, // 화면에서 직접 행삭제 방식 사용
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
	};

	// 그리드 버튼 - 집하지
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete' as const, // 행삭제
				isActionEvent: false,
				authType: 'save', // 권한
				callBackFn: deleteRows,
			},
			{
				btnType: 'btn1' as const, // 저장
				btnLabel: t('lbl.SAVE'), // 저장
				authType: 'save', // 권한
				callBackFn: saveDetailListDelivery01,
			},
		],
	};

	// 그리드 컬럼(상세목록 그리드) - 도착지
	const gridCol2 = [
		{
			dataField: 'toSeq',
			headerText: t('도착지방문순서'), // 도착지방문순서
			width: 100,
			dataType: 'numeric',
			editable: true,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'mgmtCustkey',
			headerText: t('고객코드'), // 고객코드 - 도착지
			width: 150,
			dataType: 'name',
			required: true,
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		}, // 고객코드
		{
			dataField: 'mgmtCustname',
			headerText: t('고객명'),
			width: 150,
			dataType: 'name',
			required: true,
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		}, // 센터/상호
		{
			dataField: 'address',
			headerText: t('주소'), // 주소 - 집하지
			commRenderer: {
				type: 'search',
				//iconPosition: 'aisleRight',
				onClick: function (e: any) {
					// 편집 불가능한 상태에서는 팝업을 띄우지 않음
					if (isDisabled(e.item)) {
						return;
					}
					fnZipPopup('address', ref.gridRef2, e.rowIndex);
				},
			},
			editable: false,
			width: 250,
			style: 'left',
			required: true,
		},
		{
			dataField: 'address2',
			headerText: t('상세주소'), // 상세주소- 도착지
			width: 100,
			dataType: 'name',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			required: true,
			maxlength: 20,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'phone',
			headerText: t('연락처'), // 연락처 - 도착지
			width: 120,
			dataType: 'code',
			editable: true,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		}, // 연락처

		{
			dataField: 'sku',
			headerText: t('상품코드'),
			width: 120,
			dataType: 'code',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		}, // 상품코드
		//{ dataField: 'skuname', headerText: t('상품명'), width: 200, dataType: 'name', editable: false }, // 상품명
		{
			dataField: 'skuInfo',
			headerText: t('상품내역'),
			dataType: 'name',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyEdit: true,
			},
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		}, // 상품내역
		{ dataField: 'vocUom', headerText: t('VOC단위'), editable: false, dataType: 'code' }, // VOC단위
		{ dataField: 'vocUomnm', headerText: t('VOC단위명'), editable: false, dataType: 'code', visible: false }, // VOC단위명
		{
			dataField: 'vocQty',
			headerText: t('수량'), // 수량
			width: 100,
			dataType: 'numeric',
			editable: false,
		},

		/*START.hidden 컬럼 - 도착지 */
		{ dataField: 'vsrno', headerText: t('VSR번호'), dataType: 'code', editable: false, visible: islVisibleCol }, // VSR번호
		{ dataField: 'docno', headerText: t('주문번호'), dataType: 'code', editable: false, visible: islVisibleCol }, // 주문번호
		{ dataField: 'dccode', editable: false, visible: islVisibleCol }, // dccode
		{ dataField: 'reservedate', editable: false, visible: islVisibleCol }, // 예약일시
		{ dataField: 'docno', headerText: t('주문번호'), editable: false, visible: islVisibleCol }, // 주문번호
		{ dataField: 'docline', headerText: t('주문순번'), editable: false, visible: islVisibleCol }, // 주문순번
		{ dataField: 'uom', headerText: t('상품단위'), editable: false, visible: islVisibleCol }, // 상품단위
		//
		{ dataField: 'serialkey', editable: false, visible: islVisibleCol }, // serialkey
		{ dataField: 'rcptNo', headerText: t('센터접수번호'), editable: false, visible: islVisibleCol }, // 센터접수번호
		{ dataField: 'status', editable: false, visible: islVisibleCol }, // 상태(01:VOC퀵요청,02:센터접수,03:퀵주문등록,04:퀵주문취소등록,05:퀵주문처리완료,06:퀵주문취소완료))
		//
		{ dataField: 'respDept', editable: false, visible: islVisibleCol }, // 귀책부서
		{ dataField: 'respReason', editable: false, visible: islVisibleCol }, // 귀책사유
		{ dataField: 'respEmp', editable: false, visible: islVisibleCol }, // 귀책담당자
		{ dataField: 'memo', editable: false, visible: islVisibleCol }, // 전달사항
		/*END.hidden 컬럼*/
	];

	// FooterLayout Props
	const footerLayout2 = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol2[0].dataField, // 첫 번째 dataField 사용
		},
	];

	// 그리드 Props - 도착지
	const gridProps2 = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		independentAllCheckBox: false,
		fillColumnSizeMode: false,
		showFooter: false,
		//fixedColumnCount: 2,
		isLegacyRemove: true, // 화면에서 직접 행삭제 방식 사용
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
	};

	// 그리드 버튼 - 도착지
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'delete', // 행삭제
			// 	btnLabel: t('lbl.DELETE'), // 삭제
			// 	authType: 'save', // 권한
			// 	callBackFn: deleteRows,
			// },
			{
				btnType: 'save', // 저장
				btnLabel: t('lbl.SAVE'), // 저장
				authType: 'save', // 권한
				callBackFn: saveDetailListDestination01,
			},
		],
	};

	/**
	 * 상세 조회
	 */
	const searchDetailList = () => {
		if (formRef2.getFieldValue('activeKey') === '1') {
			// 상세정보 조회 - 집하지
			searchDetail01List();
		} else if (formRef2.getFieldValue('activeKey') === '2') {
			// 상세정보 조회 - 고객
			searchDetail02List();
		}
	};

	/**
	 * 상세 조회 - 집하지
	 */
	const searchDetail01List = () => {
		ref.gridRef1.current?.clearGridData();

		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		if (!selectedRow || !selectedRow[0]) return;

		const params = {
			reqFlag: '1', // 1:집하지, 2:고객
			dccode: selectedRow[0].dccode,
			rcptNo: selectedRow[0].rcptNo,
		};

		apiGetTab2DetailList(params).then(res => {
			const gridData = res.data;
			const gridRef = ref.gridRef1.current;
			if (gridRef) {
				gridRef?.setGridData(gridData);
				gridRef?.setSelectionByIndex(0, 0);

				if (gridData.length > 0) {
					const colSizeList = gridRef.getFitColumnSizeList(true);
					gridRef.setColumnSizeList(colSizeList);
				}
				// status '02'일 때만 체크박스 자동 체크
				if (selectedRow[0]?.status === '02') {
					gridRef.setAllCheckedRows(true);
					// 필요 시 첫 행만 체크하려면 아래 사용
					// gridRef.setCheckedRowByIndex(0, true);
				} else {
					gridRef.setAllCheckedRows(false);
				}
			}
			// 상세 조회 후 formRef4 값 세팅
			searchDetailListAfter(ref.gridRef1);
		});
	};

	/**
	 * 상세 조회 - 고객
	 */
	const searchDetail02List = () => {
		ref.gridRef2.current?.clearGridData();
		ref.gridRef2.current?.setGridData([]);

		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		if (!selectedRow || !selectedRow[0]) return;

		const params = {
			reqFlag: '2', // 1:집하지, 2:고객
			dccode: selectedRow[0].dccode,
			rcptNo: selectedRow[0].rcptNo,
		};

		apiGetTab2DetailList(params).then(res => {
			let gridData = res.data;
			// toSeq가 없거나 0/빈값이면 1부터 순차로 부여
			if (Array.isArray(gridData) && gridData.length > 0) {
				const needSeq = gridData.some(row => !row.toSeq || row.toSeq === 0 || row.toSeq === '');
				if (needSeq) {
					gridData = gridData.map((row, idx) => ({ ...row, toSeq: idx + 1 }));
				}
			}

			ref.gridRef2.current.setGridData(gridData);
			ref.gridRef2.current.setSelectionByIndex(0, 0);
			if (gridData.length > 0) {
				const colSizeList = ref.gridRef2.current.getFitColumnSizeList(true);
				ref.gridRef2.current.setColumnSizeList(colSizeList);
			}

			// 상세 조회 후 formRef4 값 세팅
			searchDetailListAfter(ref.gridRef2);
		});
	};

	// 상세 조회 후 formRef4 값 세팅 - 그리드에서 첫 번째 row의 dataField 기준으로 formRef4 필드에 값 세팅
	const searchDetailListAfter = (gridRef: any) => {
		const selectedRow = ref.gridRef.current?.getSelectedRows?.();

		// Add safety check
		if (!selectedRow || selectedRow.length === 0 || !selectedRow[0]) {
			return;
		}

		// START.formRef 값 세팅
		// formRef 값 초기화 및 세팅
		formRef.resetFields();
		// formRef에서 필드명 자동 추출 및 세팅
		let formRefFields: string[] = [];
		formRefFields = Object.keys(formRef.getFieldsValue());
		const formRefValues: Record<string, any> = {};
		try {
			formRefFields.forEach(field => {
				formRefValues[field] = selectedRow[0][field] !== undefined ? selectedRow[0][field] : '';
			});
			formRef.setFieldsValue(formRefValues);
			// formRef 초기값 저장
			setFormRefChanged(false);
		} catch (error) {}
		// END.formRef 값 세팅

		//

		// START.formRef4 값 세팅
		// formRef4 값 초기화
		formRef4.resetFields();

		// formRef4에 첫 번째 row의 관련 필드만 dataField 기준으로 세팅
		// formRef4에서 필드명 자동 추출
		let formFields: string[] = [];
		formFields = Object.keys(formRef4.getFieldsValue());
		const values: Record<string, any> = {};
		try {
			formFields.forEach(field => {
				values[field] = selectedRow[0][field] !== undefined ? selectedRow[0][field] : '';
			});
			formRef4.setFieldsValue(values);
		} catch (error) {}
		// 센터접수번호는 별도로 세팅
		formRef4.setFieldValue('rcptNo', selectedRow[0]?.rcptNo ?? '');
		// END.formRef4 값 세팅

		// 변경 여부 초기화
		setFormRefChanged(false);
		setFormRef4Changed(false);
	};

	const callClosePopPopup01 = () => {
		callPopModal01?.current?.handlerClose?.();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// 부모 컴포넌트에서 ref로 접근할 메서드 정의
	useImperativeHandle(
		ref,
		() => ({
			isChangedData: () => {
				// formRef 또는 formRef4에 변경사항이 있은지 체크
				// 메인 그리드, 집하지 그리드, 도착지 그리드 모두 변경여부 확인
				return (
					formRefChanged ||
					formRef4Changed ||
					isGridChangedData(ref.gridRef.current) ||
					isGridChangedData(ref.gridRef1.current) ||
					isGridChangedData(ref.gridRef2.current)
				);
			},
		}),
		[formRefChanged, formRef4Changed],
	);

	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경(2/2)
			const newRows = props.data.map((row: any, idx: any) => ({
				...row,
				uid: `ua-${idx + 1}`,
			}));
			ref.gridRef.current?.setGridData(newRows);
			gridRef.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// START.칼럼 넓이 고정
				const idx = gridCol.findIndex((col: any) => col.dataField === 'deliverymemo');
				if (idx !== -1) {
					colSizeList[idx] = 150; // deliverymemo 열 너비 150으로 고정
				}
				// END.칼럼 넓이 고정

				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// rowCheckClick는 그리드의 체크박스에서만 이벤트가 발생
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef.bind('rowCheckClick', (event: any) => {
				const clickedRow = event.item;
				const allRows = gridRef.getGridData();
				const targetRcptNo = clickedRow.rcptNo;

				// 먼저 현재 체크 상태 확인
				const isCurrentlyChecked = gridRef.isCheckedRowByValue('_$uid', clickedRow._$uid);

				// 모든 행 언체크
				gridRef.setAllCheckedRows(false);

				// 이전에 체크되지 않았으면 같은 rcptNo의 모든 행 체크 (토글)
				if (!isCurrentlyChecked) {
					allRows.forEach((row: any, idx: number) => {
						if (row.rcptNo === targetRcptNo) {
							gridRef?.addCheckedRowsByValue('_$uid', row._$uid);
						}
					});
				}
			});
		}
	}, []);

	useEffect(() => {
		setTimeout(() => {
			// 그리드 자동 리사이즈(1/2)
			if (activeKeyDetail === '1') {
				ref.gridRef1?.current?.resize('100%', '100%');
			} else if (activeKeyDetail === '2') {
				ref.gridRef2?.current?.resize('100%', '100%');
			}
		}, 100);
	}, [activeKeyDetail]);

	useEffect(() => {
		// 셀 편집 완료 이벤트 바인딩
		bindGridEvents(ref, t);

		// 센터 리스트 조회
		getCenterList();

		// formRef 기본값 세팅
		if (formRef) {
			formRef.setFieldValue('deliverytype', '1'); // 1:편도
			formRef.setFieldValue('deliveryMethod', '1'); // 1:오토바이
			formRef.setFieldValue('articleType', '2'); // 2:소박스
			formRef.setFieldValue('payType', '3'); // 3:신용
		}

		// formRef2 기본값 세팅
		if (formRef2) {
			formRef2.setFieldValue('radioBasic1', '1'); // 센터
			formRef2.setFieldValue('center', '');
			formRef2.setFieldValue('address1', '');
			formRef2.setFieldValue('address2', '');
			formRef2.setFieldValue('zonecode', '');
		}

		if (formRef2) {
			formRef2.setFieldValue('activeKey', '1');
		}

		// 그리드 행 선택 이벤트 바인딩
		let prevRowItem: any = null;

		ref.gridRef.current?.unbind('selectionChange'); // 기존 이벤트 핸들러 제거
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			if (event.primeCell.item === prevRowItem) return; // 동일 행 선택 시 무시
			prevRowItem = event.primeCell.item;

			if (isDisabled(event.primeCell.item)) {
				setFormRefDisabled(true);
				setFormRef4Disabled(true);
			} else {
				setFormRefDisabled(false);
				setFormRef4Disabled(false);
			}

			searchDetailList();
		});

		setFormRef4Changed(false); // formRef4 변경 플래그 초기화
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '집하지',
			children: (
				<>
					<AGrid style={{ paddingTop: 10 }}>
						<GridTopBtn gridBtn={gridBtn1} gridTitle={t('집하지 목록')} totalCnt={detailTotalCnt1}>
							<CustomListForm form={formGridRef1} layout="inline">
								<RadioBox
									name="radioBasic1"
									options={[
										{
											label: '센터',
											value: '1',
										},
										{
											label: '주소',
											value: '2',
										},
									]}
									defaultValue="1"
									onChange={(event: any) => handleRadioChange(event, setradioValue1, formGridRef1)}
									className="bg-white"
								/>
								{/* 센터리스트 */}
								{radioValue1 === '1' && (
									<li>
										<SelectBox
											name="center"
											options={centerList}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											style={{ width: '180px' }}
											className="bg-white"
										/>
									</li>
								)}

								{radioValue1 === '2' && (
									<li>
										<InputText
											name="address1"
											disabled
											className="bg-white"
											maxLength={100}
											style={{ width: '190px', marginRight: '5px' }}
											required
										/>
										<CmZipSearch form={formGridRef1} callback={handleAddressCallback3}></CmZipSearch>
										<InputText
											name="address2"
											className="bg-white"
											maxLength={140}
											style={{ width: '160px' }}
											required
										/>
										<input type="hidden" name="zonecode" />
										<input type="text" name="activeKey" />
									</li>
								)}

								{/* START.선택적용 */}
								<li>
									<Button onClick={() => handleSelectApply1(ref, radioValue1, formGridRef1, centerList, showAlert)}>
										{t('선택적용')} {/* 선택적용 */}
									</Button>
								</li>
								{/* END.선택적용 */}
							</CustomListForm>
						</GridTopBtn>
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} footerLayout={footerLayout1} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '2',
			label: '도착지',
			children: (
				<>
					<AGrid style={{ paddingTop: 10 }}>
						<GridTopBtn gridBtn={gridBtn2} gridTitle={t('도착지 목록')} totalCnt={detailTotalCnt2} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
					</GridAutoHeight>
				</>
			),
		},
	];

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							{/* 상품LIST */}
							<CustomForm form={formRef} onValuesChange={() => setFormRefChanged(true)}>
								<UiDetailViewGroup ref={groupRef}>
									<li>
										<RadioBox
											label="배송방법"
											name="deliverytype"
											options={getCommonCodeList('DOC_QUICK', '')}
											optionValue="comCd"
											optionLabel="cdNm"
											required
											defaultValue="1" // 1:편도
											rules={[{ required: true, validateTrigger: 'none' }]}
											disabled={formRefDisabled}
										/>
									</li>
									<li>
										<SelectBox
											label={t('배송수단')} // 배송수단
											name="deliveryMethod"
											options={getCommonCodeList('KIND_QUICK')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
											disabled={formRefDisabled}
										/>
									</li>
									{/* <li>
								<RadioBox
									label="배송선택"
									name="deliveryOption"
									options={getCommonCodeList('DELIVERY_QUICK', '')}
									optionValue="comCd"
									optionLabel="cdNm"
									defaultValue="1" // 1:일반
									required
									disabled={formRefDisabled}
								/>
							</li> */}
									<li>
										<SelectBox
											name="articleType"
											label="물품종류"
											options={getCommonCodeList('ITEMTYPE_QUICK', '')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
											defaultValue="2" // 2:소박스
											disabled={formRefDisabled}
										/>
									</li>
									<li>
										<RadioBox
											label="지급구분"
											name="payType"
											options={getCommonCodeList('PAYGBN_QUICK', '')}
											optionValue="comCd"
											optionLabel="cdNm"
											required
											rules={[{ required: true, validateTrigger: 'none' }]}
											defaultValue="3" // 3:신용
											disabled={formRefDisabled}
										/>
									</li>
									<li>
										<DatePicker label={'예약일시'} name="reservedate1" />
										<DatePicker
											name="reservedate2"
											format="HH:mm"
											picker="time"
											placeholder={'시분 선택'}
											showNow={false}
											//onChange={onChange}
											allowClear
											style={{ width: '80px' }}
											disabled={formRefDisabled}
										/>
									</li>
								</UiDetailViewGroup>
							</CustomForm>

							<GridTopBtn gridBtn={gridBtn} gridTitle={t('접수목록')} totalCnt={props.totalCnt}>
								<CustomListForm form={formRef2} layout="inline">
									<RadioBox
										name="radioBasic1"
										options={[
											{
												label: '센터',
												value: '1',
											},
											{
												label: '주소',
												value: '2',
											},
										]}
										defaultValue="1"
										onChange={(event: any) => handleRadioChange(event, setRadioValue, formRef2)}
										className="bg-white"
									/>
									{/* 센터리스트 */}
									{radioValue === '1' && (
										<li>
											<SelectBox
												name="center"
												options={centerList}
												fieldNames={{ label: 'cdNm', value: 'comCd' }}
												style={{ width: '180px' }}
												className="bg-white"
											/>
										</li>
									)}

									{radioValue === '2' && (
										<li>
											<InputText
												name="address1"
												disabled
												className="bg-white"
												maxLength={100}
												style={{ width: '190px', marginRight: '5px' }}
												required
											/>
											<CmZipSearch form={formRef2} callback={handleAddressCallback}></CmZipSearch>
											<InputText
												name="address2"
												className="bg-white"
												maxLength={140}
												style={{ width: '160px' }}
												required
											/>
											<input type="hidden" name="zonecode" />
											<input type="text" name="activeKey" />
										</li>
									)}

									{/* START.일괄적용영역 */}
									<li>
										<Button onClick={() => handleSelectApply('1')}>
											{t('집하지이동')} {/* 집하지이동 */}
										</Button>
									</li>
									{/* END.일괄적용영역 */}
								</CustomListForm>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<TabsArray
						key="wdQuickRequestDetail2-tabs"
						activeKey={activeKeyDetail}
						onChange={(key: string) =>
							tabClickDetail1(
								key,
								ref,
								formRefChanged,
								isChanged01,
								showAlert,
								setActiveKeyDetail,
								formRef2,
								searchDetailList,
							)
						}
						items={tabItems}
					/>,
				]}
			/>
			<div style={{ height: 'fit-content', paddingTop: 10 }}>
				<CustomListForm
					form={formRef4}
					onValuesChange={changedValues => {
						setFormRef4Changed(true);
						if (changedValues.respDept === '49') {
							formRef.setFieldValue('payType', '2');
						}
					}}
				>
					<ScrollBox>
						<div>
							<UiDetailViewGroup ref={groupRef3}>
								<li>
									<InputText
										label={t('센터접수번호')} // 센터접수번호
										name="rcptNo"
										maxLength={20}
										disabled={true}
									/>
								</li>
								<li>
									<SelectBox
										name="respDept"
										label={t('귀책부서')} // 귀책부서
										options={getCommonCodeList('RESP_DEPT_QUICK', '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
										placeholder="선택해주세요"
										disabled={formRef4Disabled}
									/>
								</li>
								<li>
									<SelectBox
										name="respReason"
										label={t('귀책사유')} // 귀책사유
										options={respReasonOptions}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
										placeholder="선택해주세요"
										disabled={formRef4Disabled}
									/>
								</li>
								<li>
									<InputText
										label={t('귀책담당자')} // 귀책담당자
										name="respEmp"
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
										maxLength={20}
										disabled={formRef4Disabled}
									/>
								</li>
								<li style={{ gridColumn: 'span 4' }}>
									<InputTextArea
										label={t('전달사항')}
										autoSize={{ minRows: 3, maxRows: 3 }}
										placeholder="내용을 입력해주세요"
										name="rmk"
										maxLength={2000}
										disabled={formRef4Disabled}
									/>
								</li>
							</UiDetailViewGroup>
						</div>
					</ScrollBox>
				</CustomListForm>
			</div>
			{/* 배송메모 */}
			<CustomModal ref={deliveryMemoModalRef} width="600px" title="배송메모">
				<CmTextAreaPopup close={callClosePopPopup02} params={params} />
			</CustomModal>
		</>
	);
});
export default WdQuickRequestDetail2;

const CustomForm = styled(Form)`
	padding-top: 10px;
	ul {
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
		li {
			height: 39px;
			.ant-row.ant-form-item-row {
				.ant-form-item-label {
					min-width: 100px;
					max-width: 100px;
				}
			}
		}
	}
`;

const CustomListForm = styled(Form)`
	li {
		display: flex;
	}
`;
