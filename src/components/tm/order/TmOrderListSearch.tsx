/*
############################################################################
# Component: TmOrderListSearch (주문목록 검색 영역)
# 목적: TmOrderList 화면의 검색 조건 입력 폼 제공
# 
# [주요 기능]
# - 배송일자 선택 (Datepicker 컴포넌트)
# - 배송유형 선택 (배송 고정, 향후 확장 가능)
# - 거래처 검색 (CmCustSearch 컴포넌트를 통한 다중 선택)
# - DC코드 선택 (middleSlot으로 전달받아 표시)
# 
# [사용처]
# - TmOrderList.tsx에서 검색 폼으로 사용
# - SearchFormResponsive 컴포넌트 내부에 배치
# 
# [Props]
# - form: Ant Design Form 인스턴스 (검색 조건 값 관리)
# - middleSlot: 중간 영역에 표시할 컴포넌트 (DC코드 선택 등)
############################################################################
*/
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Datepicker, SelectBox } from '@/components/common/custom/form';

const TmOrderListSearch = ({ form, searchSelectDeliveryType }: any) => {
	return (
		<>
			{/* 배송일자 선택 */}
			<li>
				<Datepicker label={'배송일자'} name={'deliveryDate'} />
			</li>
			{/* 물류센터 검색 */}
			<li>
				<CmGMultiDccodeSelectBox mode={'single'} name={'gDccode'} rules={[{ required: true }]} />
			</li>
			{/* 배송유형 선택 (현재는 배송만 지원, 향후 확장 가능) */}
			<li>
				<SelectBox
					label={'배송유형'}
					name={'deliveryType'}
					allowClear
					defaultValue={'1'}
					initval={'1'}
					options={searchSelectDeliveryType}
				/>
			</li>
			{/* 거래처 검색 (다중 선택 가능) */}
			<li>
				<CmCustSearch
					form={form}
					name="customerName" // 화면에 표시될 거래처명
					code="customer" // 실제 전송될 거래처 코드
					selectionMode="multipleRows" // 다중 선택 모드
					returnValueFormat="name" // 이름 형식으로 반환
					label="거래처"
				/>
			</li>
		</>
	);
};

export default TmOrderListSearch;
