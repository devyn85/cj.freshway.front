import { Button, Col, Row } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import Icon from '@/components/common/Icon';
import { useAppDispatch } from '@/store/core/coreHook';
import { setIsDeleteTab } from '@/store/core/tabStore';

const Error = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch(); // store 에 요청 전송

	const clickErrMain = (): void => {
		window.location.href = '/';
	};

	const clickErrBack = (): void => {
		dispatch(setIsDeleteTab(uuidv4()));
	};

	return (
		<div className="error">
			<Row className="error_desc">
				<Col span={24}>
					<Icon icon="icon-pc-error-72-px" />
					{/* <ErrorIcon name="icon-pc-error-72-px" /> */}
				</Col>
				<Col span={24}>
					{/* 요청하신 페이지를 찾을 수 없습니다. */}
					<p>{t('msg.pageNotFound')}</p>
				</Col>
				<Col span={24}>
					{/* 입력한 주소가 정확한지 다시 한번 확인해주세요. */}
					<p>{t('msg.checkUrl')}</p>
				</Col>
				<Col span={24}>
					<Button size="large" onClick={clickErrMain}>
						{t('lbl.MAIN')}
					</Button>
					<Button size="large" onClick={clickErrBack}>
						{t('lbl.PREV')}
					</Button>
				</Col>
			</Row>
		</div>
	);
};

export default Error;
