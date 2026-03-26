/**
 * @file button.tsx
 * @description 가이드 - 버튼 모음 페이지
 */
import IcoSvg from '@/components/common/IcoSvg';
import { Button } from '@/components/common/custom/form';
import icoSvgData from '@/components/common/icoSvgData.json';
import { Flex } from 'antd';
const Sample = () => {
	return (
		<>
			<section className="guide__section">
				<h2 className="guide__title">버튼</h2>
				<code className="guide__code">
					&lt;Button 속성명=&#123;'속성값'&#125; /&gt;
					{/*<br />- 속성 : elem, url, target, label, size, cate, color, count, icoLeft, icoLeftData, icoRight,*/}
					{/*icoRightData, icoSize, disabled, onClick*/}
				</code>
				<code className="guide__code">
					- size : small | middle | large | xlarge
					<br />- type : default| primary| secondary| danger| success| warning| info | outline-primary|
				</code>

				<div style={{ marginTop: '30px' }}>
					<h2 className="guide__item--title">type="icon"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item w100">
								<div className="guide__box flex">
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoSearch} label={'검색'} />} />
										</Flex>
										<p className="cate">find</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoPlus} label={'####'} />} />
										</Flex>
										<p className="cate">plus</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoMinus} label={'####'} />} />
										</Flex>
										<p className="cate">minus</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoClose} label={'####'} />} />
										</Flex>
										<p className="cate">close</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoArrowUp} label={'####'} />} />
										</Flex>
										<p className="cate">up</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoArrowDown} label={'####'} />} />
										</Flex>
										<p className="cate">down</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoArrowLeft} label={'####'} />} />
										</Flex>
										<p className="cate">left</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoArrowRight} label={'####'} />} />
										</Flex>
										<p className="cate">right</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoArrowDoubleLeft} label={'####'} />} />
										</Flex>
										<p className="cate">@@@</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoArrowDoubleRight} label={'####'} />} />
										</Flex>
										<p className="cate">f right</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoChevronDown} label={'####'} />} />
										</Flex>
										<p className="cate">@@@</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoChevronUp} label={'####'} />} />
										</Flex>
										<p className="cate">@@@</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoArrowCheck} label={'####'} />} />
										</Flex>
										<p className="cate">check</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoExpansion} label={'####'} />} />
										</Flex>
										<p className="cate">expation</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoReduce} label={'####'} />} />
										</Flex>
										<p className="cate">reduce</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoUserSetting} label={'####'} />} />
										</Flex>
										<p className="cate">more</p>
									</div>
									<div>
										<Flex>
											<Button icon={<IcoSvg data={icoSvgData.icoInfoCircle} label={'####'} />} />
										</Flex>
										<p className="cate">info</p>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div style={{ marginTop: '30px' }}>
					{/* DEFAULT */}
					<h2 className="guide__item--title">type="default"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="default" size="small">
											default
										</Button>
										<Button type="default" size="small" disabled>
											default
										</Button>
									</Flex>
									<p className="cate">default / small</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="default" size="middle">
											default
										</Button>
										<Button type="default" size="middle" disabled>
											default
										</Button>
									</Flex>
									<p className="cate">default / middle</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="default" size="large">
											default
										</Button>
										<Button type="default" size="large" disabled>
											default
										</Button>
									</Flex>
									<p className="cate">default / large</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="default" size="xlarge">
											default
										</Button>
										<Button type="default" size="xlarge" disabled>
											default
										</Button>
										{/*<Button type="default"    size="xlarge">*/}
										{/*	xlarge*/}
										{/*</Button>*/}
									</Flex>
									<p className="cate">default / xlarge</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div style={{ marginTop: '30px' }}>
					{/* PRIMARY */}
					<h2 className="guide__item--title">type="primary"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="primary" size="small">
											primary
										</Button>
										<Button type="primary" size="small" disabled>
											primary
										</Button>
									</Flex>
									<p className="cate">primary / small</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="primary" size="middle">
											primary
										</Button>
										<Button type="primary" size="middle" disabled>
											primary
										</Button>
									</Flex>
									<p className="cate">primary / middle</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="primary" size="large">
											primary
										</Button>
										<Button type="primary" size="large" disabled>
											primary
										</Button>
									</Flex>
									<p className="cate">primary / large</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="primary" size="xlarge">
											primary
										</Button>
										<Button type="primary" size="xlarge" disabled>
											primary
										</Button>
									</Flex>
									<p className="cate">primary / xlarge</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div style={{ marginTop: '30px' }}>
					{/* PRIMARY */}
					<h2 className="guide__item--title">type="outline-primary"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="outline-primary" size="small">
											outline-primary
										</Button>
										<Button type="outline-primary" size="small" disabled>
											outline-primary
										</Button>
									</Flex>
									<p className="cate">outline-primary / small</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="outline-primary" size="middle">
											outline-primary
										</Button>
										<Button type="outline-primary" size="middle" disabled>
											outline-primary
										</Button>
									</Flex>
									<p className="cate">outline-primary / middle</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="outline-primary" size="large">
											outline-primary
										</Button>
										<Button type="outline-primary" size="large" disabled>
											outline-primary
										</Button>
									</Flex>
									<p className="cate">outline-primary / large</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="outline-primary" size="xlarge">
											outline-primary
										</Button>
										<Button type="outline-primary" size="xlarge" disabled>
											outline-primary
										</Button>
									</Flex>
									<p className="cate">outline-primary / xlarge</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div style={{ marginTop: '30px' }}>
					{' '}
					{/* SECONDARY */}
					<h2 className="guide__item--title">type="secondary"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="secondary" size="small">
											secondary
										</Button>
										<Button type="secondary" size="small" disabled>
											secondary
										</Button>
									</Flex>
									<p className="cate">secondary / small</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="secondary" size="middle">
											secondary
										</Button>
										<Button type="secondary" size="middle" disabled>
											secondary
										</Button>
									</Flex>
									<p className="cate">secondary / middle</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="secondary" size="large">
											secondary
										</Button>
										<Button type="secondary" size="large" disabled>
											secondary
										</Button>
									</Flex>
									<p className="cate">secondary / large</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="secondary" size="xlarge">
											secondary
										</Button>
										<Button type="secondary" size="xlarge" disabled>
											secondary
										</Button>
									</Flex>
									<p className="cate">secondary / xlarge</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div style={{ marginTop: '30px' }}>
					{' '}
					{/* type="danger" */}
					<h2 className="guide__item--title">type="danger"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="danger" size="small">
											danger
										</Button>
										<Button type="danger" size="small" disabled>
											danger
										</Button>
									</Flex>
									<p className="cate">danger / small</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="danger" size="middle">
											danger
										</Button>
										<Button type="danger" size="middle" disabled>
											danger
										</Button>
									</Flex>
									<p className="cate">danger / middle</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="danger" size="large">
											danger
										</Button>
										<Button type="danger" size="large" disabled>
											danger
										</Button>
									</Flex>
									<p className="cate">danger / large</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="danger" size="xlarge">
											danger
										</Button>
										<Button type="danger" size="xlarge" disabled>
											danger
										</Button>
									</Flex>
									<p className="cate">danger / xlarge</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div style={{ marginTop: '30px' }}>
					<h2 className="guide__item--title">type="warning"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="warning" size="small">
											warning
										</Button>
										<Button type="warning" size="small" disabled>
											warning
										</Button>
									</Flex>
									<p className="cate">warning / small</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="warning" size="middle">
											warning
										</Button>
										<Button type="warning" size="middle" disabled>
											warning
										</Button>
									</Flex>
									<p className="cate">warning / middle</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="warning" size="large">
											warning
										</Button>
										<Button type="warning" size="large" disabled>
											warning
										</Button>
									</Flex>
									<p className="cate">warning / large</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="warning" size="xlarge">
											warning
										</Button>
										<Button type="warning" size="xlarge" disabled>
											warning
										</Button>
									</Flex>
									<p className="cate">warning / xlarge</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div style={{ marginTop: '30px' }}>
					<h2 className="guide__item--title">type="success"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="success" size="small">
											success
										</Button>
										<Button type="success" size="small" disabled>
											success
										</Button>
									</Flex>
									<p className="cate">success / small</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="success" size="middle">
											success
										</Button>
										<Button type="success" size="middle" disabled>
											warning
										</Button>
									</Flex>
									<p className="cate">success / middle</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="success" size="large">
											success
										</Button>
										<Button type="success" size="large" disabled>
											success
										</Button>
									</Flex>
									<p className="cate">success / large</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="success" size="xlarge">
											success
										</Button>
										<Button type="success" size="xlarge" disabled>
											success
										</Button>
									</Flex>
									<p className="cate">success / xlarge</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div style={{ marginTop: '30px' }}>
					<h2 className="guide__item--title">type="info"</h2>
					<div className="guide__group">
						<ul className="guide__list--row">
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="info" size="small">
											info
										</Button>
										<Button type="info" size="small" disabled>
											info
										</Button>
									</Flex>
									<p className="cate">info / small</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="info" size="middle">
											info
										</Button>
										<Button type="info" size="middle" disabled>
											warning
										</Button>
									</Flex>
									<p className="cate">info / middle</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="info" size="large">
											info
										</Button>
										<Button type="info" size="large" disabled>
											success
										</Button>
									</Flex>
									<p className="cate">info / large</p>
								</div>
							</li>
							<li className="guide__item">
								<div className="guide__box g--type2">
									<Flex vertical gap="small" style={{ display: 'inline-flex' }}>
										<Button type="info" size="xlarge">
											info
										</Button>
										<Button type="info" size="xlarge" disabled>
											success
										</Button>
									</Flex>
									<p className="cate">info / xlarge</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</section>
		</>
	);
};

export default Sample;
Sample.PublishingLayout = 'BLANK';
