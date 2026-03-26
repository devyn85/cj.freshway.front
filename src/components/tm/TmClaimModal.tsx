/*
############################################################################
# Component: TmDispatchVehicleModal (차량 설정 모달)
# 목적: TmOrderList 화면에서 배차 조건을 설정하는 모달 컴포넌트
# 
# [주요 기능]
# - 차량 설정(조회, 상태 저장)
# 
# [Props]
# - open: 모달 열림/닫힘 상태
# - onClose: 모달 닫기 함수
# - title: 모달 제목
# - dccode: 물류센터 코드 (옵션 저장/조회 시 사용)
# - deliveryDate : 조회 일자
# - tmDeliveryType : 배송 타입
# 
# [API 연동]
# - apiGetPlanCarGridList: 조회
# - setDispatchOptions: 저장
############################################################################
*/

import { apiGetClaimListGridList } from '@/api/wm/apiWmDocument';
import AGrid from '@/assets/styled/AGrid/AGrid';
import Title from '@/assets/styled/Title/Title';
import { InputText, Rangepicker, SearchFormResponsive } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { Flex } from 'antd/lib';
import dayjs from 'dayjs';

// 배차옵션 모달 Props 타입 정의
export type TmClaimModalProps = {
	row: any; // 선택한 row
};

const TmClaimModal = ({ row }: TmClaimModalProps) => {
	const [form] = Form.useForm();
	const gridRef: any = useRef(null);

	useEffect(() => {}, [row]);

	// 다국어
	const { t } = useTranslation();

	// if (!open) return null;

	// // 모달 열림 시
	// useEffect(() => {
	// 	gridRef.current.clearGridData();
	// 	gridRef.current.clearSortingAll();
	// }, [open]);

	// 모달 닫기 시도 시 변경사항 확인
	// const handleAttemptClose = useCallback(() => {
	// 	onClose();
	// }, [onClose]);

	const gridCol = [
		// 물류센터 (단일 컬럼)
		{
			headerText: '전표일자',
			dataField: 'slipdt',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			width: 100,
			editable: false,
		},
		{
			headerText: '클레임(소)유형',
			dataField: 'claimdtlids',
			width: 70,
			colSpan: 2,
		},
		{
			dataField: 'specdescr',
			width: 100,
		},
		{
			headerText: '반품번호',
			dataField: 'rtDocno',
			width: 110,
		},
		{
			headerText: '반품품번',
			dataField: 'rtDocline',
			width: 80,
		},
		{
			headerText: '출고번호',
			dataField: 'wdDocno',
			width: 100,
		},
		{
			headerText: '출고품번',
			dataField: 'wdDocline',
			width: 100,
		},
		{
			headerText: '상품',
			dataField: 'sku',
			dataType: 'code',
			width: 100,
		},
		{
			headerText: '수량',
			dataField: 'claimqty',
			dataType: 'numeric',
			width: 70,
		},
		{
			headerText: '단위',
			dataField: 'claimuom',
			width: 70,
		},
		{
			headerText: '메모',
			dataField: 'memo',
			width: 400,
		},
	];

	const gridProps = {
		showRowNumColumn: true,
		editable: false,
		fillColumnSizeMode: false,
		enableFilter: true,
		selectionMode: 'singleRow',
	} as any;

	const onSearchList = () => {
		const values = form.getFieldsValue();
		values.dccode = row.dccode;
		// values.deliverydtFrom = dayjs(values.deliverydtFrom).format('YYYYMMDD');
		// values.deliverydtTo = dayjs(values.deliverydtTo).format('YYYYMMDD');
		values.deliverydtFrom = dayjs(values.deliveryDt[0]).format('YYYYMMDD');
		values.deliverydtTo = dayjs(values.deliveryDt[1]).format('YYYYMMDD');

		try {
			apiGetClaimListGridList(values).then(res => {
				if (res.statusCode === 0) {
					gridRef.current.setGridData(res?.data?.list);
				}
			});
		} catch (e) {
			//console.warn('WM API failed', e);
			// message.error(t('msg.MSG_COM_ERR_014'));
			// setGridData([]);
			// setTotalCnt(0);
		}
	};

	useEffect(() => {
		if (!commUtil.isEmpty(row)) {
			form.setFieldValue('dccodeText', row?.dccode);
			form.setFieldValue('dcnameText', row?.dcname);

			// form.setFieldValue('deliverydtFrom' , dayjs(row?.deliverydate).subtract(3, 'day'));
			// // form.setFieldValue('deliverydtFrom' , dayjs('20250310'));
			// form.setFieldValue('deliverydtTo' , dayjs(row?.deliverydate));

			// form.setFieldValue('customerName', `[${row?.managerCode}] ${row?.manager}`);
			// form.setFieldValue('customer', row?.managerCode);

			form.setFieldsValue({
				dccodeText: row?.dccode,
				dcnameText: row?.dcname,
				deliveryDt: [dayjs(row?.deliverydate).subtract(60, 'day'), dayjs(row?.deliverydate)],
				// custName: `[${row?.managerCode}] ${row?.manager}`,
				custName: `${row?.toCustname}`,
				custkey: row?.toCustkey,
			});

			onSearchList();
		}
	}, []);

	const [dates, setDates] = useState([]);
	const dateFormat = 'YYYY-MM-DD';

	return (
		<>
			<Title>
				<h2>배송 클레임 내역</h2>
				<Flex gap="small" wrap>
					<Button variant="solid" onClick={onSearchList}>
						{'조회'}
					</Button>
				</Flex>
			</Title>
			<SearchFormResponsive form={form} groupClass={'grid-column-2'}>
				<li>
					{/* 센터코드/센터명 */}
					<div style={{display:'flex'}}>
						<InputText
							label="물류센터"
							name="dccodeText"
							placeholder=""
							disabled
						/>
						<InputText
							name="dcnameText"
							placeholder=""
							disabled
						/>
					</div>
				</li>
				<li>
					{/* <DateRange
						label="배송일자"
						name="deliverydt"
						span={24}
						format="YYYY-MM-DD"
						fromName="deliverydtFrom"
						toName="deliverydtTo"
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/> */}
					<Rangepicker
						label={'배송일자'}
						name="deliveryDt"
						// defaultValue={dates}
						value={dates}
						format={dateFormat}
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
					<Form.Item name="dccode" hidden></Form.Item>
					<Form.Item name="pageNum" hidden initialValue={'1'}></Form.Item>
					<Form.Item name="listCount" hidden initialValue={'10000'}></Form.Item>
				</li>
				<li>
					{/* <CmCustSearch
						form={form}
						name="custName" // 화면에 표시될 거래처명
						code="custkey" // 실제 전송될 거래처 코드
						selectionMode="multipleRows" // 다중 선택 모드
						returnValueFormat="name" // 이름 형식으로 반환
						label="고객처"
						disabled
					/> */}
					<div style={{display:'flex'}}>
						<InputText
							label="고객처"
							name="custkey"
							placeholder=""
							disabled
						/>
						<InputText
							name="custName"
							placeholder=""
							disabled
						/>
					</div>
				</li>
			</SearchFormResponsive>

			<div style={{ width: '100%', height: '70%' }}>
				<AGrid>
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</div>
		</>
	);
};

export default TmClaimModal;
