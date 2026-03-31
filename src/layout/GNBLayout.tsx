import DropMenu from '@/layout/GNB/DropMenu';
import MainTabs from '@/layout/Tab/MainTabs';

const GNBLayout = ({ children }: any) => {
	return (
		<>
			<DropMenu />
			<main>
				<div className="content">
					<MainTabs />
					{children}
				</div>
			</main>
		</>
	);
};

export default GNBLayout;
