/*
 ############################################################################
 # FiledataField	: Layout.tsx
 # Description		: 레이아웃
 # Author			: Canal Frame
 # Since			: 23.10.02
 ############################################################################
*/
// lib
import { ReactNode, Suspense } from 'react';
import KeepAlive from 'react-activation';
// component
import GNBLayout from '@/layout/GNBLayout';
import LNBLayout from '@/layout/LNBLayout';
import Constants from '@/util/constants';

export interface ComponentReactElement {
	children?: ReactNode | ReactNode[];
	route?: ReactNode | ReactNode[];
	layout?: string;
}

type Props = ComponentReactElement;

const Layout = ({ route, layout }: Props) => {
	const location = useLocation();
	const locationParams = new URLSearchParams(location.search);
	const window = locationParams.get(Constants.WIN_POPUP.KEY);
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [isLayout, setIsLayout] = useState(true);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 레이아웃 변경 이벤트
	 * @param {boolean} checked 체크 여부
	 * @returns {void}
	 */
	const onChange = (checked: boolean) => {
		setIsLayout(checked);
	};

	return (
		<>
			{window === Constants.WIN_POPUP.VALUE || !layout ? (
				<>
					{/* 팝업 화면 레이아웃 미적용 */}
					<Suspense>{route}</Suspense>
				</>
			) : (
				<>
					{/* 레이아웃 화면 */}
					{/* <Form.Item
						label="레이아웃 변경"
						colon={false}
						style={{
							width: '200px',
							position: 'absolute',
							top: '1.1rem',
							left: '70%',
							zIndex: '999',
						}}
					> */}
					{/* 레이아웃 변경 */}
					{/* <Switch checkedChildren={true} unCheckedChildren={false} onClick={onChange} defaultChecked={isLayout} />
					</Form.Item> */}

					{/* 레이아웃 */}
					{isLayout ? (
						<LNBLayout>
							<RouteKeepAlive route={route} />
						</LNBLayout>
					) : (
						<GNBLayout>
							<RouteKeepAlive route={route} />
						</GNBLayout>
					)}
				</>
			)}
		</>
	);
};
export default memo(Layout);

/**
 * Route KeepAlive
 * @param {any} param props
 * @param {any} param.route route prop
 * @returns {*} KeepAlive Route component
 */
const RouteKeepAlive = ({ route }: Props) => {
	const location = useLocation();
	// const cachedTabs = useAppSelector(state => state.tab.cachedTabs);
	return (
		<>
			<Suspense>
				<KeepAlive id={location.state?.uuid} name={location.state?.uuid}>
					<div className="keep-alive-content">{route}</div>
				</KeepAlive>
			</Suspense>
		</>
	);
};
