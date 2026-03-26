import Icon from '@/components/common/Icon';
import { Button, Col, Row } from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 예외 페이지 (notfound)
const Exclusivescreen = (): ReactElement => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// 1초 후에 화면 표시 - 지연 노출
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

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
		<>
			{isVisible && (
				<div className="error">
					<Row className="error_desc">
						<Col span={24}>
							<Icon icon="icon-pc-error-72-px" />
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
			)}
		</>
	);
};

export default Exclusivescreen;
