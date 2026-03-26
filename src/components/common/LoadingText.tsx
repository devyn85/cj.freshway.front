import { useAppSelector } from '@/store/core/coreHook';
import { useProgressStore } from '@/store/progressStore';

const LoadingText = () => {
	const { loading} = useAppSelector(state => state.loading);
  const progress = useProgressStore(s => s.progress);
  if (!progress) return null;
	return (
		<>
			{loading && (
				<div className="loading-text-indicator">
        {`전체 ${progress.value}/${progress.total}`}
				</div>
		 )}
		</>
	);
};

export default LoadingText;
