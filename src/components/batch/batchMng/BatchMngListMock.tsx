// Mock version of BatchMngList for Storybook
import React from 'react';

interface BatchMngListMockProps {
	data?: any[];
	onExecute?: (id: number) => void;
	onStop?: (id: number) => void;
	onSchedule?: (id: number) => void;
	onViewLog?: (id: number) => void;
	totalCnt?: number;
}

const BatchMngListMock: React.FC<BatchMngListMockProps> = ({
	data = [],
	onExecute,
	onStop,
	onSchedule,
	onViewLog,
	totalCnt,
}) => {
	return (
		<div style={{ width: '100%', padding: '20px' }}>
			<div style={{ marginBottom: '20px' }}>
				<h3>배치 작업 관리 리스트 ({totalCnt || data.length}개)</h3>
			</div>
			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
					<tr style={{ backgroundColor: '#f5f5f5' }}>
						<th style={{ padding: '10px', border: '1px solid #ddd' }}>JOB 구분</th>
						<th style={{ padding: '10px', border: '1px solid #ddd' }}>JOB 이름</th>
						<th style={{ padding: '10px', border: '1px solid #ddd' }}>JOB 설명</th>
						<th style={{ padding: '10px', border: '1px solid #ddd' }}>스케줄</th>
						<th style={{ padding: '10px', border: '1px solid #ddd' }}>상태</th>
						<th style={{ padding: '10px', border: '1px solid #ddd' }}>작업</th>
					</tr>
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr>
							<td colSpan={6} style={{ textAlign: 'center', padding: '40px', border: '1px solid #ddd' }}>
								데이터가 없습니다.
							</td>
						</tr>
					) : (
						data.map((item, index) => (
							<tr key={item.id || index}>
								<td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.category || 'BATCH'}</td>
								<td style={{ padding: '10px', border: '1px solid #ddd' }}>
									{item.batchName || item.jobName || `작업 ${index + 1}`}
								</td>
								<td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.description || item.jobDesc || '-'}</td>
								<td style={{ padding: '10px', border: '1px solid #ddd' }}>
									{item.scheduleText || item.jobSchedule || '-'}
								</td>
								<td style={{ padding: '10px', border: '1px solid #ddd' }}>
									<span
										style={{
											padding: '2px 8px',
											borderRadius: '4px',
											fontSize: '12px',
											backgroundColor:
												item.status === '실행중'
													? '#28a745'
													: item.status === '오류'
													? '#dc3545'
													: item.status === '대기중'
													? '#ffc107'
													: '#6c757d',
											color: item.status === '대기중' ? '#000' : '#fff',
										}}
									>
										{item.status || '대기중'}
									</span>
								</td>
								<td style={{ padding: '10px', border: '1px solid #ddd' }}>
									<button
										onClick={() => onExecute?.(item.id)}
										style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}
									>
										실행
									</button>
									<button
										onClick={() => onSchedule?.(item.id)}
										style={{ marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}
									>
										스케줄
									</button>
									<button onClick={() => onViewLog?.(item.id)} style={{ padding: '5px 10px', cursor: 'pointer' }}>
										로그
									</button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};

export default BatchMngListMock;
