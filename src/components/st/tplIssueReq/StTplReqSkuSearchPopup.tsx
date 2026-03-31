/*
############################################################################
 # FiledataField	: TmSearchHjDong.tsx
 # Description		: 센터별구간설정(행정동팝업)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 2025.09.12
 ############################################################################
*/

import CustomModal from '@/components/common/custom/CustomModal';

import StTplReqSkuPopup from '@/components/st/tplIssueReq/StTplReqSkuPopup';
import { useCloseOnExternalScroll } from '@/hooks/cm/useCloseOnExternalScroll';
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';
import { showAlert } from '@/util/MessageUtil';
import { useForm } from 'antd/es/form/Form';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

interface PopupParams {
	gridRef: any;
	rowIndex: number;
	dataFieldMap: Record<string, string>; // 예: { custcd: "code", custnm: "name" }
	selectRow: any;
	selectData: any;
	// popupType: string;
	onConfirm?: (selectedRows: any[]) => void; // 추가 콜백 함수
}

const StTplReqSkuSearchPopup = forwardRef((_, ref) => {
	const { t } = useTranslation();
	const modalRef = useRef<any>(null);
	const [popupParams, setPopupParams] = useState<PopupParams | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const pasteTransform = usePopupPasteTransform();
	const [popupList, setPopupList] = useState([]);
	const [dropdownData, setDropdownData] = useState<any[]>([]);
	const [form] = useForm();
	// 외부에서 호출할 수 있는 open 메서드
	useImperativeHandle(ref, () => ({
		open: (params: PopupParams) => {
			setPopupParams(params);
			// 다음 tick에 modal open
			setTimeout(() => modalRef.current?.handlerOpen(), 0);
		},
		handlerClose: () => {
			modalRef.current?.handlerClose();
		},
	}));

	// 팝업 확인 시 실행될 콜백
	const handleConfirm = (selectedRows: any[]) => {
		if (!popupParams || !selectedRows || selectedRows.length === 0) {
			const { gridRef, rowIndex, dataFieldMap, selectData } = popupParams;
			gridRef?.current?.removeRow(rowIndex);
			modalRef.current?.handlerClose();
			showAlert(null, '선택된 데이터가 이미 존재합니다.'); // 데이터가 없습니다.
			return;
		}

		// 외부에서 전달받은 콜백 함수가 있으면 실행
		if (popupParams?.onConfirm) {
			popupParams.onConfirm(selectedRows);
		} else {
			const { gridRef, rowIndex, dataFieldMap, selectData } = popupParams;

			if (selectedRows.length === 1) {
				// 기존 로직 (콜백이 없는 경우)
				const selectRows = selectedRows[0];
				// 업데이트할 필드 구성
				const updateObj: Record<string, any> = {
					// ...selectData,
					sku: selectRows.sku,
					skuName: selectRows.skuName,
					baseUom: selectRows.uom,
					stockQty: selectRows.qty,
					orderQty: selectRows.orderQty,
					slipDt: selectRows.deliveryDate,
					duration: selectRows.duration,
					durationRate: selectRows.durationRate,
					durationFrom: selectRows.durationFrom,
					durationTo: selectRows.durationTo,
					convSerialNo: selectRows.convSerialNo,
					serialNo: selectRows.serialNo,
					// dcCode: selectRows.dcCode,
					// organize: selectRows.organize,
					// fromCustKey: selectRows.custKey,
					stockId: selectRows.barcode,
				};
				// 안전한 업데이트를 위해 next tick으로 밀기
				setTimeout(() => {
					gridRef?.current?.updateRow(updateObj, rowIndex);
					modalRef.current?.handlerClose();
				}, 0);
				// rowIndex 값으로 rowId 조회 후 체크박스 추가
				// popupParams?.gridRef?.current?.addCheckedRowsByIds(
				// 	popupParams?.gridRef?.current?.indexToRowId(popupParams?.rowIndex),
				// );
			} else if (selectedRows.length > 1) {
				const { gridRef, dataFieldMap, selectData } = popupParams;
				gridRef?.current?.removeRow(rowIndex);

				selectedRows.forEach(selectRows => {
					// 매핑된 필드로 새 row 생성

					const newRow: Record<string, any> = {
						sku: selectRows.sku,
						skuName: selectRows.skuName,
						baseUom: selectRows.uom,
						stockQty: selectRows.qty,
						orderQty: selectRows.orderQty,
						slipDt: selectRows.deliveryDate,
						duration: selectRows.duration,
						durationRate: selectRows.durationRate,
						durationFrom: selectRows.durationFrom,
						durationTo: selectRows.durationTo,
						convSerialNo: selectRows.convSerialNo,
						serialNo: selectRows.serialNo,
						// dcCode: selectRows.dcCode,
						// organize: selectRows.organize,
						fromCustKey: selectRows.custKey,
						toCustKey: popupParams.selectData.toCustKey,
						rowStatus: 'I',
						attachment: popupParams.selectData.attachment,
						tplBcnrId: popupParams.selectData.tplBcnrId,
						stockId: selectRows.barcode,
						docNo: popupParams.selectData.docNo,
						deliverytype: popupParams.selectData.deliverytype,
					};

					// row 추가
					gridRef?.current?.addRow(newRow);
				});
				// 모달 닫기
				setTimeout(() => {
					modalRef.current?.handlerClose();
				}, 0);
			}
		}
	};

	const handleClose = () => {
		modalRef.current?.handlerClose();
	};
	/**
	 *  검색결과 클릭
	 * @param {any} val 클릭한로우
	 */
	const handleDropdownClick = (val: any) => {
		form.setFieldsValue({
			name: commUtil.convertCodeWithName(val.code, val.name),
			code: val.code,
			custkey: val.custkey,
			vendor: val.vendor,
		});

		setDropdownOpen(false);
	};

	/**
	 * 검색결과 INPUT 하단 커스텀 그리드
	 * @returns {object} HTML
	 */
	const dropdownRenderFormat = () => {
		return (
			<>
				{
					<div className={'dropdown-content'}>
						<table className="data-table">
							<thead>
								<tr>
									<th>화주ID</th>
									<th>화주명</th>
									<th>거래처</th>
									<th>협력사</th>
								</tr>
							</thead>
							<tbody>
								{dropdownData.map(
									(item, index) => (
										//console.log('item', item),
										(
											<tr key={index} onClick={() => handleDropdownClick(item)}>
												<td id="dropdownTable">{item.code}</td>
												<td id="dropdownTable">{item.name}</td>
												<td id="dropdownTable">{item.custNm}</td>
												<td id="dropdownTable">{item.vendorNm}</td>
											</tr>
										)
									),
								)}
							</tbody>
						</table>
					</div>
				}
			</>
		);
	};
	// const search = (prarms: any) => {
	// 	apiPostStTplIssueReqPopupData(prarms).then((res: any) => {
	// 		setGridData(res.data);
	// 	});
	// };
	const refModal = useRef(null);
	const handleOpenPopup = () => {
		setPopupList([]);
		// setTotalCount(0);
		// popupForm.setFieldValue('dccode', dccode ? dccode : gDccode);
		refModal.current?.handlerOpen();
	};
	/**
	 * 버튼 클릭 검색
	 * @param {object} param 조회 param
	 * @param  {any} event 이벤트
	 * @param  {any} source clear, input
	 * @returns {void}
	 */
	// const onClickSearchButton = (param: string, event: any, source: any) => {
	// 	if (source.source === 'clear') {
	// 		return;
	// 	}
	// 	setPopupList([]);
	// 	if (event.key === 'Enter') {
	// 		searchEnter(param);
	// 	} else {
	// 		handleOpenPopup();
	// 	}
	// };

	// usePopupSearchValue({ form, name, code, value });
	useCloseOnExternalScroll({
		open: dropdownOpen,
		onClose: () => setDropdownOpen(false),
		allowScrollRefs: [refModal],
	});
	/**
	 * API 조회 - INPUT 하단 그리드
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	// const searchEnter = (value: string) => {
	// 	if (value === '') {
	// 		return;
	// 	}
	// 	const today = new Date();
	// 	const formattedDate = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today
	// 		.getDate()
	// 		.toString()
	// 		.padStart(2, '0')}`;
	// 	const params = {
	// 		name: value,
	// 		multiSelect: '',
	// 		date: formattedDate,
	// 		startRow: 0,
	// 		listCount: 500,
	// 		skipCount: true,
	// 	};

	// 	setDropdownData([]);
	// 	apiGetTplUserPopupList(params).then(res => {
	// 		if (res.data.list.length === 1) {
	// 			settingSelectData(res.data.list);
	// 		} else if (res.data.list.length > 0) {
	// 			const tempList = [];
	// 			for (const item of res.data.list) {
	// 				tempList.push(item);
	// 			}
	// 			setDropdownData(tempList);
	// 			setDropdownOpen(true);
	// 		} else if (res.data.list.length === 0) {
	// 			refModal.current.handlerOpen();
	// 		}
	// 	});
	// };
	return (
		<>
			{/* <Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={dropdownRenderFormat}
			>
				<InputSearch
					label={t('lbl.TPLUSER')}
					placeholder={t('msg.placeholder1', ['화주ID 또는 화주명'])}
					form={form}
					name={name}
					code={code}
					hidden={true}
					onSearch={onClickSearchButton}
					onPaste={pasteTransform(form, name, true, code)}
					onBlur={() => {
						// 의미 없는 값 입력시 삭제
						if (!dropdownOpen && commUtil.isEmpty(form.getFieldValue(code)) && !refModal.current?.getIsOpen()) {
							form.setFieldValue(name, '');
						}
					}}
					allowClear={!props.disabled && commUtil.isEmpty(form.getFieldValue(name))} // suffix가 노출 안될때 CSS 틀어져서 임시적으로 사용
					// onBlur={onBlurEvent}
					className={props.className ?? props.className}
					required={required}
					rules={[{ required: props.required, validateTrigger: 'none' }]}
					disabled={props.disabled}
					readOnly={commUtil.isNotEmpty(form.getFieldValue(code))}
					suffix={
						!props.disabled && commUtil.isNotEmpty(form.getFieldValue(name)) ? (
							<CloseCircleFilled
								style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.25)' }}
								onClick={() => {
									form.setFieldValue(name, '');
									form.setFieldValue(code, '');
								}}
							/>
						) : null
					}
					autoComplete="off"
				/>
			</Dropdown> */}
			<CustomModal ref={modalRef} width={popupParams && (popupParams.selectData.docType === 'WD' ? '1000px' : '650px')}>
				{/* {popupParams && <CmSearchPopup type={popupParams.popupType} callBack={handleConfirm} close={handleClose} />} */}
				{popupParams && <StTplReqSkuPopup callBack={handleConfirm} close={handleClose} data={popupParams.selectData} />}
			</CustomModal>
		</>
	);
});

export default StTplReqSkuSearchPopup;
