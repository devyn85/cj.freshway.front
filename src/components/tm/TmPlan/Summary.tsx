import { TmVehiclesDto } from '@/api/tm/apiTmDispatch';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { useMemo, useState } from 'react';

interface SummaryProps {
	vehicles: TmVehiclesDto[];
}

const Summary = React.memo(({ vehicles: vehiclesApi }: SummaryProps) => {
	const [deliverySummaryOpen, setDeliverySummaryOpen] = useState(false);

	// 통계 데이터 계산 함수 (API 응답 기반 - vehicles 데이터만 사용)
	const statistics = useMemo(() => {
		// 총 거래처 수 계산 (각 차량의 orderCount 합산)
		const totalCustomers = vehiclesApi.reduce((sum, v) => sum + (Number(v?.orderCount) || 0), 0);

		// 총 차량 수 (사용한 차량 수)
		const usedVehicles = vehiclesApi.length;
		// 가용 가능 차량 수 - 현재는 사용한 차량 수와 동일하게 표시 (추후 API 추가 시 수정)
		const availableVehicles = usedVehicles;

		// 실비차량 수 (vehicleType이 '실비용차'인 차량 카운트)
		const actualCostVehicles = vehiclesApi.filter(
			v => v?.vehicleType === '실비' || v?.vehicleType === '실비용차',
		).length;

		// 총 적재량 (전체 차량의 loadedWeight 합산)
		const totalLoadedWeight = vehiclesApi.reduce((sum, v) => sum + (Number(v?.loadedWeight) || 0), 0);

		// 총 CBM (전체 차량의 loadedCbm 합산)
		const totalLoadedCbm = vehiclesApi.reduce((sum, v) => sum + (Number(v?.loadedCbm) || 0), 0);

		// 총 차량 최대적재중량 (전체 차량의 maxWeight 합산)
		const totalMaxWeight = vehiclesApi.reduce((sum, v) => sum + (Number(v?.maxWeight) || 0), 0);

		// 총 차량 최대적재CBM (전체 차량의 maxCbm 합산)
		const totalMaxCbm = vehiclesApi.reduce((sum, v) => sum + (Number(v?.maxCbm) || 0), 0);

		// 총 중량 적재율 = (총 적재량 / 총 차량 최대적재량) * 100
		const totalWeightRate = totalMaxWeight > 0 ? Math.round((totalLoadedWeight / totalMaxWeight) * 100) : 0;

		// 총 CBM 적재율 = (총 적재CBM / 총 차량 최대CBM) * 100
		const totalCbmRate = totalMaxCbm > 0 ? Math.round((totalLoadedCbm / totalMaxCbm) * 100) : 0;

		// 추가 통계 (접힘 영역용)
		// OTD 거래처 수: steps에서 reqdlvtime1From/To가 있는 job 카운트
		const otdCustomers = vehiclesApi.reduce((sum, v) => {
			const otdSteps = (v?.steps || []).filter(
				(s: any) => s?.type === 'job' && (s?.reqdlvtime1From || s?.reqdlvtime1To),
			);
			return sum + otdSteps.length;
		}, 0);

		// 대면검수 거래처 수: faceInspect가 'Y'인 job 카운트
		const faceToFaceCustomers = vehiclesApi.reduce((sum, v) => {
			const faceSteps = (v?.steps || []).filter((s: any) => s?.type === 'job' && s?.faceInspect === 'Y');
			return sum + faceSteps.length;
		}, 0);

		// 특수조건 거래처 수: specialConditionYn이 'Y'인 job 카운트
		const specialConditionCustomers = vehiclesApi.reduce((sum, v) => {
			const specialSteps = (v?.steps || []).filter((s: any) => s?.type === 'job' && s?.specialConditionYn === 'Y');
			return sum + specialSteps.length;
		}, 0);

		// 총 이동거리 (각 차량의 totalDistanceKm 합산)
		const totalDistanceKm = vehiclesApi.reduce((sum, v) => {
			const km = Number(v?.totalDistanceKm) || 0;
			return sum + km;
		}, 0);
		const totalDistanceKmRounded = Math.round(totalDistanceKm * 10) / 10;

		// 총 운행시간 (각 차량의 totalTimeMinutes 합산)
		const totalDurationMinutes = vehiclesApi.reduce((sum, v) => {
			const minutes = Number(v?.totalTimeMinutes) || 0;
			return sum + minutes;
		}, 0);

		// 시간/분 형식으로 변환
		const hours = Math.floor(totalDurationMinutes / 60);
		const minutes = totalDurationMinutes % 60;
		const totalDurationFormatted = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;

		return {
			totalCustomers,
			usedVehicles,
			availableVehicles,
			actualCostVehicles,
			totalWeightRate,
			totalCbmRate,
			otdCustomers,
			faceToFaceCustomers,
			specialConditionCustomers,
			totalLoadedWeight,
			totalLoadedCbm,
			totalDistanceKm,
			totalDistanceKmRounded,
			totalDurationFormatted,
		};
	}, [vehiclesApi]);

	const StatItem = ({ icon, label, value, suffix = '' }: any) => (
		<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
			<span style={{ color: '#1890ff', fontSize: '14px' }}>{icon}</span>
			<span style={{ fontSize: '12px', color: '#595959' }}>{label}</span>
			<span style={{ fontSize: '13px', fontWeight: 600, color: '#464646' }}>
				{value} {suffix}
			</span>
		</div>
	);

	const ProgressBar = ({ rate, color }: { rate: number; color: string }) => (
		<div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '110px' }}>
			<div
				style={{
					flex: 1,
					height: '6px',
					backgroundColor: '#f0f0f0',
					borderRadius: '3px',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						width: `${Math.min(rate, 100)}%`,
						height: '100%',
						backgroundColor: color,
						transition: 'width 0.3s ease',
					}}
				/>
			</div>
			<span style={{ fontSize: '12px', fontWeight: 600, color, minWidth: '35px' }}>{rate}%</span>
		</div>
	);

	return (
		<div
			style={{
				padding: '12px 16px',
				borderBottom: '1px solid #d9d9d9',
				marginTop: -18,
				marginBottom: '10px',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
					<StatItem label="거래처" value={statistics.totalCustomers} suffix="건" />
					<StatItem label="차량" value={statistics.usedVehicles} suffix="대" />
					<StatItem label="실비차" value={statistics.actualCostVehicles} suffix="대" />
					<Divider type="vertical" style={{ height: '24px', margin: 0 }} />
					<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
						<span style={{ fontSize: '12px' }}>중량</span>
						<ProgressBar rate={statistics.totalWeightRate} color="#464646" />
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
						<span style={{ fontSize: '12px' }}>체적</span>
						<ProgressBar rate={statistics.totalCbmRate} color="#464646" />
					</div>
				</div>
				<Button
					type="text"
					size="small"
					onClick={() => setDeliverySummaryOpen(prev => !prev)}
					icon={deliverySummaryOpen ? <UpOutlined /> : <DownOutlined />}
					style={{ color: '#8c8c8c' }}
				/>
			</div>

			{deliverySummaryOpen && (
				<>
					<Divider style={{ margin: '12px 0' }} />
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
							gap: '8px',
							padding: '8px 0',
						}}
					>
						<StatItem label="OTD" value={statistics.otdCustomers} suffix="건" />
						<StatItem label="대면검수" value={statistics.faceToFaceCustomers} suffix="건" />
						<StatItem label="특수조건" value={statistics.specialConditionCustomers} suffix="건" />
						<StatItem label="적재량" value={statistics.totalLoadedWeight?.toFixed(3)} suffix="kg" />
						<StatItem label="체적" value={(statistics.totalLoadedCbm || 0).toFixed(2)} suffix="m³" />
						<StatItem label="이동거리" value={statistics.totalDistanceKm?.toFixed(3)} suffix="km" />
						<StatItem label="운행시간" value={statistics.totalDurationFormatted} />
					</div>
				</>
			)}
		</div>
	);
});

export default Summary;
