import Icon from '@/components/common/Icon';
import { Button, Col, Row } from 'antd';
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// 예외 페이지 notfound
const ErrorScreen = (): ReactElement => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	/**
	 * 메인 화면
	 */
	const clickErrMain = (): void => {
		navigate('/');
	};

	/**
	 * 이번 페이지
	 */
	const clickErrBack = (): void => {
		navigate(-1);
	};

	return (
		<div className="error">
			<Row className="error_desc">
				<Col span={24}>
					<Icon icon="icon-pc-error-72-px" />
				</Col>
				<Col span={24}>
					{/* 일시적인 오류가 발생했습니다. */}
					<p>{t('etc.msg.error')}</p>
				</Col>
				<Col span={24}>
					{/* "페이지를 새로고침하거나 잠시 후 다시 접속해주세요. */}
					<p>{t('etc.msg.refresh')}</p>
				</Col>
				<Col span={24}>
					<Button size="large" onClick={clickErrMain}>
						{t('etc.btn.main')}
					</Button>
					<Button size="large" onClick={clickErrBack}>
						{t('etc.btn.prev')}
					</Button>
				</Col>
			</Row>
		</div>
	);
};

export default ErrorScreen;
