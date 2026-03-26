/*
############################################################################
# Component: TmTempHistoryPopup (온도 기록지 모달)
############################################################################
*/

import {
	apiTmTempMonitorPopupPostGetTempPreviewPopup,
	apiTmTempMonitorPopupPostupload,
} from '@/api/tm/apiTmTempMonitor';
import { SearchFormResponsive } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import Modal from '@/components/common/Modal';
import htmlToPdf from '@/lib/htmlToPdf';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import html2pdf from 'html2pdf.js'; //html2pdf 라이브러리 import
import _ from 'lodash';
import React, { useCallback, useEffect } from 'react';

// 배차옵션 모달 Props 타입 정의
export type TmTempHistoryModalProps = {
	open: boolean; // 모달 열림/닫힘 상태
	onClose: () => void; // 모달 닫기 함수
	title?: string; // 모달 제목 (차량 설정)
	pForm?: any; // 검색 form
	reqTempReport: any; // edms 문서 정보
	setTempHistoryPopup: any; // 팝업 닫기 state
	description?: string; // 거래처코드/명
	gridRef: any; // 그리드 ref
};

const TmTempHistoryPopup = ({
	open,
	onClose,
	title,
	pForm,
	reqTempReport,
	setTempHistoryPopup,
	description,
	gridRef,
}: TmTempHistoryModalProps) => {
	const [form] = Form.useForm();
	const printEl: any = useRef(null);
	const [popListData, setPopListData] = useState([]);

	// 다국어
	const { t } = useTranslation();

	if (!open) return null;

	const formatRecordTime = (value: any) => {
		if (value == null) return '';
		const d = dayjs(value);
		if (d.isValid()) return d.format('HH:mm');
	
		const s = String(value).trim();
		const t = s.split('T')[1] || s.split(' ')[1] || s;
		if (/^\d{4,6}$/.test(t)) return `${t.slice(0, 2)}:${t.slice(2, 4)}`;
		return t.slice(0, 5);
	};

	// 모달 열림 시
	useEffect(() => {
		onMakeList();
	}, [open]);

	// 모달 닫기
	const handleAttemptClose = useCallback(() => {
		onClose();
	}, [onClose]);

	const onMakeList = () => {
		const tempCheckedItems = gridRef.current.getCheckedRowItemsAll(); // 그리드 체크 row

		const checkedItems = _.orderBy(tempCheckedItems, [ 'carno', 'workdate' ], [ 'asc', 'desc' ]); // 차량번호, 작업시간 정렬

		if (checkedItems?.length === 0) {
			showAlert('', '선택된 데이터가 없습니다.');
			onClose();
		} else {
			const sepNum: number = 22; // 페이지당 개수
			const tempGroupList = _.groupBy(checkedItems, (row: any) => `${row.deliverydt}@${row.carno}`); // 일자, 차량번호 그룹
			const keys = Object.keys(tempGroupList);
			const rtnArr: any = [];
			keys.forEach((key, kIdx) => {
				const tempItemsList = tempGroupList[key];
				tempItemsList[tempItemsList.length - 1].userStop = true;
				const pageNum = Math.ceil(tempItemsList.length / sepNum); // page 당 계산
				if (pageNum > 1) {
					// paging 처리
					Array(pageNum)
						.fill('1')
						.forEach((row, idx) => {
							rtnArr.push(tempItemsList.slice(idx * sepNum, idx * sepNum + sepNum - 1));
						});
				} else {
					rtnArr.push(tempItemsList);
				}

				// 최종 데이터 set
				if (kIdx === keys.length - 1) {
					setPopListData(rtnArr);
				}
			});
		}
	};

	const onSearchList = () => {
		const searchParams = pForm.getFieldsValue();

		// dccode?: string; // 물류센터 코드
		// fromDeliverydt?: any; // 시작배송일자
		// toDeliverydt?: any; // 종료배송일자
		// tempStatus?: string; // 온도상태코드 코드
		// timeUnit?: string; // 시간단위(1분/5분/10분/30분/60분)
		form.setFieldValue('dccode', searchParams?.dccode || '');
		form.setFieldValue('fromDeliverydt', searchParams?.deliveryDt?.[0]?.format('YYYYMMDD') || '');
		form.setFieldValue('toDeliverydt', searchParams?.deliveryDt?.[1]?.format('YYYYMMDD') || '');
		form.setFieldValue('tempStatus', searchParams?.tempStatus || '');
		form.setFieldValue('timeUnit', searchParams?.timeUnit || '');
		form.setFieldValue('description', description || '');

		const values = form.getFieldsValue();
		values.exclTempLogMulti = [
			// 제외할 차번호, 운행일시 목록
			// {
			// 	carno: "TEST01가1234", //차량번호
			// 	workdate: "2025-10-01 19:15" //운행일시
			// }
		];

		try {
			apiTmTempMonitorPopupPostGetTempPreviewPopup(values).then(res => {
				if (res.statusCode === 0) {
					if (res.data.length === 0) {
						setTempHistoryPopup(false);
						showAlert('', '조회된 목록이 없습니다.');
					} else {
						setPopListData(res.data);
					}
				}
			});
		} catch (e) {
			//console.warn('WM API failed', e);
		}
	};
	// {사업자등록번호}_온도기록지_{배송일자}.pdf
	return (
		<Modal closeModal={handleAttemptClose} width={'1090px'}>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={title} showButtons={false} showChildrens={true}>
				{/* <Button onClick={onSearchList}>임시조회</Button> */}
				<Button
					onClick={() => {
						const fileNm = '온도기록지_' + dayjs(reqTempReport.deliveryDt).format('YYYYMMDD');
						htmlToPdf.downPdf(printEl.current, fileNm);
					}}
				>
					PDF 저장
				</Button>
				<Button
					disabled={commUtil.isEmpty(reqTempReport.reqDoc) || commUtil.isEmpty(reqTempReport.reqNo) ? true : false}
					onClick={() => {
						html2pdf()
							.from(printEl.current)
							.outputPdf('blob')
							.then((pdfBlob: Blob) => {
								const fileNm = '온도기록지_' + dayjs(reqTempReport.deliveryDt).format('YYYYMMDD') + '.pdf';
								const fd = new FormData();
								const file = new File([pdfBlob], fileNm, { type: 'application/pdf' });

								fd.append('files', file);
								fd.append(
									'fileInfoList',
									new Blob(
										[
											JSON.stringify([
												{
													attchFileNm: fileNm,
													attchFileSz: file.size,
													rowStatus: 'I',
												},
											]),
										],
										{ type: 'application/json' },
									),
								);
								fd.append(
									'docReqDto',
									new Blob(
										[
											JSON.stringify({
												serialKey: reqTempReport.serialKey || '',
												reqDoc: reqTempReport.reqDoc || '', //필수 요청 문서
												reqNo: reqTempReport.reqNo || '', //필수 요청 번호
											}),
										],
										{ type: 'application/json' },
									),
								);
								apiTmTempMonitorPopupPostupload(fd).then(res => {
									setTimeout(() => {
										if (res.statusCode != -1) {
											showMessage({
												content: t('msg.MSG_COM_SUC_012'), // 업로드 되었습니다.
												modalType: 'info',
											});
										}
									}, 2000);
								}).catch(error => {
									showMessage({
										content: error,
										modalType: 'info',
									});
								});;
							});
					}}
				>
					EDMS 전송
				</Button>
			</PopupMenuTitle>

			<SearchFormResponsive form={form} groupClass={'grid-column-1'}>
				{/* 기준 차량(CAR), 거래처(CUST) */}
				<Form.Item name="base" hidden initialValue={'CAR'}></Form.Item>
				{/* 센터 포함 보기 */}
				<Form.Item name="dcIncYn" hidden initialValue={'Y'}></Form.Item>
				{/* 출/도착건만 보기 */}
				<Form.Item name="depArrYn" hidden initialValue={'N'}></Form.Item>

				{/* 센터코드 */}
				<Form.Item name="dccode" hidden></Form.Item>
				{/* 시작배송일자 */}
				<Form.Item name="fromDeliverydt" hidden></Form.Item>
				{/* 종료배송일자 */}
				<Form.Item name="toDeliverydt" hidden></Form.Item>
				{/* 차량번호 */}
				<Form.Item name="carno" hidden></Form.Item>
				{/* 온도상태코드 */}
				<Form.Item name="tempStatus" hidden></Form.Item>
				{/* 시간단위(1분/5분/10분/30분/60분) */}
				{/* <Form.Item name="timeUnit" hidden></Form.Item> */}
				{/* 거래처코드/명 */}
				<Form.Item name="description" hidden></Form.Item>

				<Form.Item name="timeUnit" hidden initialValue={'10'}></Form.Item>

				{/* 페이지 당 개수 */}
				<Form.Item name="listCount" hidden initialValue={'99999999'}></Form.Item>
				{/* 페이지 */}
				<Form.Item name="pageNum" hidden initialValue={'1'}></Form.Item>
			</SearchFormResponsive>

			{/* 기록지 본문 */}
			<div style={{ width: '1080px', height: '84%', overflow: 'auto' }} ref={printEl}>
				<ul style={{ display: 'flex', flexWrap: 'wrap' }}>
					{
						popListData.map((item: any, index: number) => (
							// childItem
							<li style={{ padding: '0 6px 20px 6px' }} key={index}>
								<div
									style={{
										width: '254px',
										borderStyle: 'solid solid none solid',
										borderWidth: '0.15em',
										padding: '10px 10px 5px 10px',
										borderColor: 'rgb(199, 199, 199)',
										fontSize: '0.9em',
									}}
								>
									{/* 차량번호, 기록간격 */}
									<ul>
										<li style={{ padding: '5px 0 10px 0' }}>
											<table>
												<tbody>
													<tr>
														<td style={{ width: '30%', color: 'rgb(131 131 131)' }}>차량번호 :</td>
														<td style={{ fontWeight: 'bold' }}>{item[0].carno}</td>
													</tr>
												</tbody>
											</table>
										</li>
										<li style={{ padding: '5px 0 10px 0' }}>
											<table>
												<tbody>
													<tr>
														<td style={{ width: '30%', color: 'rgb(131 131 131)' }}>기록간격 :</td>
														<td style={{ fontWeight: 'bold' }}>{item[0].timeUnit}분</td>
													</tr>
												</tbody>
											</table>
										</li>
									</ul>
								</div>
								{/* 구분선 */}
								<div style={{ width: '254px', borderStyle: 'solid', borderWidth: '0px' }}>
									<ul key={'ul_' + index}>
										<li
											key={'_' + index}
											style={{
												padding: '0',
												height: '1px',
												borderStyle: 'none none dashed none',
												borderWidth: '0.15em',
												borderColor: 'rgb(199, 199, 199)',
											}}
										></li>
									</ul>
								</div>
								{/* 년월일, 기록지 */}
								<div
									style={{
										width: '254px',
										borderStyle: 'none solid solid solid',
										borderWidth: '0.15em',
										padding: '5px 10px 10px 10px',
										borderColor: 'rgb(199, 199, 199)',
										fontSize: '0.9em',
										color: 'rgb(131 131 131)',
									}}
								>
									<ul>
										<li style={{ padding: '10px 0px 15px 0', fontWeight: 'bold' }}>
											{dayjs(item[0].deliverydt).format('YYYY년 MM월 DD일')}
										</li>
									</ul>
									{/* 기록지 내용 */}
									<ul>
										<li>
											<table>
												<tbody>
													{item.map((childItem: any, childIndex: number) =>
														// USER STOP 처리
														childItem.userStop ? (
															<React.Fragment key={index + '-' + childIndex}>
																<tr>
																	<td style={{ width: '22%', padding: '5px 0 5px 0', fontWeight: 'bold' }}>
																	{formatRecordTime(childItem.recordTime)}
																	</td>
																	<td
																		style={{
																			width: '39%',
																			fontWeight: 'bold',
																			paddingLeft: commUtil.isEmpty(childItem.refrig) ? '30px' : '0',
																		}}
																	>
																		{commUtil.isEmpty(childItem.refrig) ? '-' : '냉장:' + childItem.refrig}
																	</td>
																	<td
																		style={{
																			width: '39%',
																			fontWeight: 'bold',
																			paddingLeft: commUtil.isEmpty(childItem.freeze) ? '30px' : '0',
																		}}
																	>
																		{commUtil.isEmpty(childItem.freeze) ? '-' : '냉동:' + childItem.freeze}
																	</td>
																</tr>
																<tr>
																	<td colSpan={3} style={{ width: '22%', padding: '10px 0 0 0', fontWeight: 'bold' }}>
																		USER STOP
																	</td>
																</tr>
															</React.Fragment>
														) : (
															<tr key={index + '-' + childIndex}>
																<td style={{ width: '22%', padding: '5px 0 5px 0', fontWeight: 'bold' }}>
																{formatRecordTime(childItem.recordTime)}
																</td>
																<td
																	style={{
																		width: '39%',
																		fontWeight: 'bold',
																		paddingLeft: commUtil.isEmpty(childItem.refrig) ? '30px' : '0',
																	}}
																>
																	{commUtil.isEmpty(childItem.refrig) ? '-' : '냉장:' + Number(childItem.refrig).toFixed(1)}
																</td>
																<td
																	style={{
																		width: '39%',
																		fontWeight: 'bold',
																		paddingLeft: commUtil.isEmpty(childItem.freeze) ? '30px' : '0',
																	}}
																>
																	{commUtil.isEmpty(childItem.freeze) ? '-' : '냉동:' + Number(childItem.freeze).toFixed(1)}
																</td>
															</tr>
														),
													)}
												</tbody>
											</table>
										</li>
									</ul>
								</div>
							</li>
						))
					}
				</ul>
			</div>
		</Modal>
	);
};

export default TmTempHistoryPopup;
