import { useAppSelector } from '@/store/core/coreHook';
import { Spin } from 'antd';

const Loading = () => {
	const { loading } = useAppSelector(state => state.loading);

	return (
		<>
			{loading && (
				<div className="loading-indicator">
					<Spin size="large" delay={3}></Spin>
				</div>
			)}
		</>
	);
};

export default Loading;
