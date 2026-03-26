import { Button, Divider, Select, Space, Typography } from 'antd';

export type ChangeVehicleInfo = {
	id: number | string;
	type?: string;
	group?: string;
	driverName?: string;
	carNo?: string;
	color?: string;
};

export type TmChangeVehicleModalProps = {
	currentVehicle: ChangeVehicleInfo | null;
	options: ChangeVehicleInfo[];
	selectedId?: number | string | null;
	onChange: (id: number | string | null) => void;
	onCancel: () => void;
	onSave: () => void;
};

const TmChangeVehicleModal = ({
	currentVehicle,
	options,
	selectedId,
	onChange,
	onCancel,
	onSave,
}: TmChangeVehicleModalProps) => {
	return (
		<div style={{ width: '100%' }}>
			<Typography.Text strong style={{ fontSize: 16 }}>
				차량변경
			</Typography.Text>
			<div style={{ marginTop: 16 }}>
				<Typography.Text type="secondary">기존차량</Typography.Text>
				<div
					style={{
						marginTop: 8,
						padding: '10px 12px',
						background: '#f5f5f5',
						borderRadius: 6,
						display: 'flex',
						alignItems: 'center',
						gap: 10,
					}}
				>
					<span
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							height: 24,
							padding: '0 8px',
							border: '1px solid #d9d9d9',
							borderRadius: 6,
							fontSize: 12,
						}}
					>
						{currentVehicle?.type || '고정'}
					</span>
					<Typography.Text>
						{currentVehicle?.driverName || '기사'} {currentVehicle?.carNo || '999가9999'}
					</Typography.Text>
				</div>
				<div style={{ textAlign: 'center', marginTop: 8 }}>
					<Typography.Text type="secondary">⇩</Typography.Text>
				</div>
				<Typography.Text type="secondary">변경차량</Typography.Text>
				<div style={{ marginTop: 8 }}>
					<Select
						placeholder="차량을 선택하세요."
						style={{ width: '100%' }}
						size="large"
						getPopupContainer={trigger => trigger.parentElement!}
						dropdownStyle={{ paddingTop: 6, paddingBottom: 6 }}
						optionLabelProp="label"
						value={(selectedId as any) ?? null}
						options={options.map(v => ({
							value: v.id as any,
							label: (
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
									<span
										style={{
											display: 'inline-flex',
											alignItems: 'center',
											height: 24,
											padding: '0 8px',
											border: '1px solid #d9d9d9',
											borderRadius: 6,
											fontSize: 12,
										}}
									>
										{v.type === '실비' ? '실비' : '고정'}
									</span>
									<span>{`${v.driverName || '기사'} (${v.id})`}</span>
								</div>
							),
						}))}
						onChange={v => onChange(v as any)}
					/>
				</div>
			</div>
			<Divider style={{ margin: '16px 0' }} />
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Space>
					<Button onClick={onCancel}>닫기</Button>
					<Button type="primary" onClick={onSave} disabled={!selectedId}>
						저장
					</Button>
				</Space>
			</div>
		</div>
	);
};

export default TmChangeVehicleModal;
