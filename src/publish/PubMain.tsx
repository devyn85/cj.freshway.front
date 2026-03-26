import React from 'react';

import Title from '@/assets/styled/Title/Title';
import Icon from '@/components/common/Icon';

const PubMain: React.FC = () => {
	return (
		<>
			<Title>
				<h1>메인</h1>
			</Title>
			<div className="card-wrapper">
				<div className="card">
					<Icon icon="icon01" />
					<h2>공통코드 관리</h2>
					<p>업무시스템에서 공통코드를 통합하여 관리하고, 등록된 코드에 대한 다국어를 관리합니다.</p>
				</div>
				<div className="card">
					<Icon icon="icon02" />
					<h2>공통코드 다국어 관리</h2>
					<p>시스템 메뉴에 대한 정보를 관리 및 메뉴명에 대한 다국어를 관리합니다.</p>
				</div>
				<div className="card">
					<Icon icon="icon03" />
					<h2>메뉴 관리</h2>
					<p>시스템 메뉴에 대한 정보를 관리 및 메뉴명에 대한 다국어를 관리합니다.</p>
				</div>
				<div className="card">
					<Icon icon="icon04" />
					<h2>메뉴 다국어 관리</h2>
					<p>시스템의 사용자 권한을 관리하고, 권한별 접근 메뉴 및 권한별 사용자를 관리합니다.</p>
				</div>
				<div className="card">
					<Icon icon="icon05" />
					<h2>권한별 메뉴관리</h2>
					<p>시스템의 사용자 권한을 관리하고, 권한별 접근 메뉴 및 권한별 사용자를 관리합니다.</p>
				</div>
				<div className="card">
					<Icon icon="icon06" />
					<h2>사용자관리</h2>
					<p>
						오프라인에서 수기로 작성된 이미지를 Detecting Recognition하여 디지털 데이터로 변환하는 기술입니다. 이를
						데이터베이스로 만들어 빅데이터 분석에 활용합니다.
					</p>
				</div>
				<div className="card">
					<Icon icon="icon07" />
					<h2>IP허용 예외관리</h2>
					<p>소스 데이터(Face image data)를 학습하여 Destination object에 학습 데이터를 반영 및 변환하는 기술입니다.</p>
				</div>
				<div className="card">
					<Icon icon="icon08" />
					<h2>시스템 예외 이력</h2>
					<p>Text to Image&Drawing 기술로써 특정 키워드 입력시 이와 관련된 이미지, 드로잉 등을 구현할 수 있습니다.</p>
				</div>
				<div className="card">
					<Icon icon="icon09" />
					<h2>차트</h2>
					<p>
						특정 인물의 목소리 데이터를 학습 (pretraining)하여 텍스트를 입력하면 이를 학습한 인물의 음성으로 변환할 수
						있습니다.
					</p>
				</div>
				<div className="card">
					<Icon icon="icon10" />
					<h2>UI컴포넌트</h2>
					<p>업무 시스템에서 자주 사용되는 UI 컴포넌트들의 샘플을 제공합니다.</p>
				</div>
			</div>
		</>
	);
};

export default PubMain;
