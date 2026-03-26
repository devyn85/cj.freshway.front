import {
	apiGetCustomerDetailPopupList,
	apiPostSaveCustomerDetailPopupMemo,
	TmPlanCustomerDetailPopupReqDto,
	TmPlanCustomerDetailPopupResDto,
} from '@/api/tm/apiTmCustomerDetailPopup';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import { InputText } from '@/components/common/custom/form';
import { convertApiToCustomerDetail, CustomerDetailInfo } from '@/types/tm/customer';
import { showAlert } from '@/util/MessageUtil';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const { TextArea } = Input;

interface CustomerDetailModalProps {
	open: boolean;
	onClose: () => void;
	// API 호출에 필요한 파라미터
	apiParams?: TmPlanCustomerDetailPopupReqDto;
	// 읽기 전용 여부
	isReadOnly?: boolean;
}

const CustomerDetailModal = ({ open, onClose, apiParams, isReadOnly = false }: CustomerDetailModalProps) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [customerList, setCustomerList] = useState<TmPlanCustomerDetailPopupResDto[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isSaveDisabled, setIsSaveDisabled] = useState(false);

	// 현재 선택된 거래처 데이터
	const currentCustomer = customerList[currentIndex];
	const displayData: CustomerDetailInfo | null = currentCustomer ? convertApiToCustomerDetail(currentCustomer) : null;

	// API 호출 - 거래처 목록 조회
	const fetchCustomerList = async () => {
		if (!apiParams) {
			return;
		}

		setLoading(true);
		try {
			const response = await apiGetCustomerDetailPopupList(apiParams);
			const result = response.data;
			if (result.statusCode === 0) {
				const customerData = Array.isArray(result.data) ? result.data : [];
				setCustomerList(customerData);
				setCurrentIndex(0);
				if (customerData.length > 0) {
					const firstCustomer = convertApiToCustomerDetail(customerData[0]);
					form.setFieldsValue(firstCustomer);
				}
			} else {
				showAlert('오류', result.statusMessage || '거래처 정보를 불러오는데 실패했습니다.');
			}
		} catch (error) {
			showAlert('오류', '거래처 정보를 불러오는데 실패했습니다. ');
		} finally {
			setLoading(false);
		}
	};

	// 모달이 열릴 때 데이터 로드
	useEffect(() => {
		if (open && apiParams) {
			fetchCustomerList();
		}
	}, [open, apiParams]);

	// 현재 인덱스 변경 시 폼 데이터 업데이트
	useEffect(() => {
		if (currentCustomer) {
			const customerData = convertApiToCustomerDetail(currentCustomer);
			form.setFieldsValue(customerData);

			const memo = customerData.dailyMemo;
			if (memo && memo.trim() !== '') {
				setIsSaveDisabled(true);
			} else {
				setIsSaveDisabled(false);
			}
		}
	}, [currentIndex, currentCustomer, form]);

	// 이전 버튼 - 거래처 목록 내 이동 (단일 주문일 때)
	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(prev => prev - 1);
		}
	};

	// 다음 버튼 - 거래처 목록 내 이동 (단일 주문일 때)
	const handleNext = () => {
		if (currentIndex < customerList.length - 1) {
			setCurrentIndex(prev => prev + 1);
		}
	};

	// 메모 저장
	const handleSaveMemo = async () => {
		if (!currentCustomer || !apiParams) return;

		const formValues = form.getFieldsValue();
		const dailyMemo = formValues.dailyMemo || '';

		setLoading(true);
		try {
			const response = await apiPostSaveCustomerDetailPopupMemo({
				custkey: currentCustomer.custkey,
				storerkey: apiParams.storerkey,
				custtype: apiParams.custtype,
				deliveryDate: apiParams.deliveryDate,
				tmDeliveryType: apiParams.tmDeliveryType,
				dccode: apiParams.dccode,
				dispatchStatus: apiParams.dispatchStatus,
				carno: apiParams.carno,
				memo: dailyMemo,
			});

			// Axios 응답: response.data = { statusCode, statusMessage, data }
			const result = response.data;

			if (result.statusCode === 0) {
				showAlert('알림', '메모가 저장되었습니다.');
				// 저장 후 목록 다시 조회
				await fetchCustomerList();
			} else {
				showAlert('오류', result.statusMessage || '메모 저장에 실패했습니다.');
			}
		} catch (error) {
			showAlert('오류', '메모 저장에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	const readOnly = useMemo(() => {
		return isReadOnly || !displayData?.tmMemoEditable;
	}, [isReadOnly, displayData]);

	const modalTitle = <h2 style={{ textAlign: 'center' }}>거래처 정보</h2>;

	return (
		<StyledModal title={modalTitle} open={open} onCancel={onClose} footer={null} width={650} centered>
			<Spin spinning={loading}>
				{customerList.length > 1 && (
					<NavigationWrap>
						<span style={{ fontSize: '14px', lineHeight: '28px' }}>
							({currentIndex + 1}/{customerList.length || 0})
						</span>
						<PaginationButton icon={<LeftOutlined />} size="small" onClick={handlePrev} disabled={currentIndex === 0} />
						<PaginationButton
							icon={<RightOutlined />}
							size="small"
							onClick={handleNext}
							disabled={currentIndex === customerList.length - 1}
						/>
					</NavigationWrap>
				)}

				{displayData ? (
					<Form form={form}>
						<UiDetailViewArea style={{ marginTop: 0, padding: '0 24px' }}>
							<UiDetailViewGroup className="grid-column-2">
								<li>
									<InputText label="거래처코드" name="custKey" disabled />
								</li>
								<li>
									<InputText label="거래처명" name="custName" disabled />
								</li>

								<li style={{ gridColumn: '1 / -1' }}>
									<InputText label="실 배송지 주소" name="custAddress" disabled />
								</li>
								<li>
									<InputText label="차량제한높이" name="vehicleHeightLimit" disabled />
								</li>

								<li>
									<InputText label="업장출입" name="businessAccess" disabled />
								</li>
								<li>
									<InputText label="납품가능시간" name="deliveryAvailableTime" disabled />
								</li>
								<li>
									<InputText label="건물출입가능" name="buildingAccessTime" disabled />
								</li>
								<li>
									<Form.Item label="OTD" style={{ marginBottom: 0 }}>
										<div className="input-area" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
											<Form.Item name="otdFrom" noStyle>
												<Input disabled style={{ flex: 1 }} />
											</Form.Item>
											<span>~</span>
											<Form.Item name="otdTo" noStyle>
												<Input disabled style={{ flex: 1 }} />
											</Form.Item>
										</div>
									</Form.Item>
								</li>
								<li>
									<InputText label="대면검수" name="faceInspection" disabled />
								</li>
								<li style={{ gridColumn: '1 / -1' }}>
									<InputText label="특수조건" name="specialCondition" disabled />
								</li>
								<li style={{ gridColumn: '1 / -1' }}>
									<InputText label="적재위치" name="loadingPosition" disabled />
								</li>
								<li>
									<InputText label="키 종류" name="keyType" disabled />
								</li>
								<li>
									<InputText label="키 상세" name="keyDetail" disabled />
								</li>
								<li style={{ gridColumn: '1 / -1' }}>
									<InputText label="고정메모" name="fixedMemo" disabled />
								</li>
								<li style={{ gridColumn: '1 / -1' }}>
									<InputText label="거래처카드 메모" name="cardMemo" disabled />
								</li>
								<li style={{ gridColumn: '1 / -1' }}>
									<InputText label="납품서 메모" name="supplyMemo" disabled />
								</li>
								<li style={{ gridColumn: '1 / -1' }}>
									<Form.Item label="일별메모" name="dailyMemo">
										<TextArea
											rows={3}
											placeholder={readOnly ? '일별메모를 입력하세요' : '일별메모 정보가 없습니다.'}
											disabled={readOnly || isSaveDisabled}
										/>
									</Form.Item>
								</li>
							</UiDetailViewGroup>
						</UiDetailViewArea>
					</Form>
				) : (
					<EmptyMessage>거래처 정보가 없습니다.</EmptyMessage>
				)}

				<ButtonWrap data-props="single">
					<Button onClick={onClose}>취소</Button>
					<Button type="primary" onClick={handleSaveMemo} disabled={!currentCustomer || readOnly || isSaveDisabled}>
						저장
					</Button>
				</ButtonWrap>
			</Spin>
		</StyledModal>
	);
};

export default CustomerDetailModal;

// Styled Components
const StyledModal = styled(Modal)`
	.ant-modal-content {
		position: relative;
	}
	.ant-modal-header {
		padding: 16px 24px 8px;
		margin: 0;
	}
	.ant-modal-body {
		padding: 8px 0 20px !important;
	}
	.ant-modal-close {
		top: 16px;
		right: 16px;
		width: 22px;
		height: 22px;
		.anticon {
			font-size: 14px;
		}
	}
`;

const ModalTitleWrap = styled.div`
	text-align: center;
	font-size: 16px;
	font-weight: 700;
`;

const NavigationWrap = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 4px;
	padding: 0 24px 8px;
`;

const PaginationButton = styled(Button)`
	&& {
		width: 28px;
		height: 28px;
		min-width: 28px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 1px solid #d9d9d9;

		.anticon {
			font-size: 12px;
		}

		&:disabled {
			background: transparent;
			border-color: #d9d9d9;

			.anticon {
				color: #d9d9d9;
			}
		}
	}
`;

const EmptyMessage = styled.div`
	padding: 40px;
	text-align: center;
	color: #8c8c8c;
`;
