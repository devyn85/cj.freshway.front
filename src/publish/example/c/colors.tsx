/**
 * @file colors.tsx
 * @description 가이드 - 컬러 페이지
 */

const Sample = () => {
	const $colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'keyword'];
	const $num = [100, 200, 300, 400, 500, 600, 700, 800, 900];
	const $validGreenNums = [300, 600, 700, 900];
	return (
		<>
			<section className="guide__section">
				<h1 className="guide__hidden">Colors</h1>
				<h2 className="guide__title">Font Color</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{$colors.map((c, i) => (
							<li className="guide__item" key={i}>
								<p className={`color-${c}`}>{c}</p>
								<code className="guide__code">className={`color-${c}`}</code>
								<code className="guide__code">color: map-get($colors, {c})</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">Font Color - grays</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{$num.map(n => (
							<li className="guide__item" key={n}>
								<p className={`color-gray--${n}`}>gray-{n}</p>
								<code className="guide__code">className="color-gray--{n}"</code>
								<code className="guide__code">color: $gray-{n}</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">Font Color - greens</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{$validGreenNums.map(n => (
							<li className="guide__item" key={n}>
								<p className={`color-green--${n}`}>green-{n}</p>
								<code className="guide__code">className="color-green--{n}"</code>
								<code className="guide__code">color: $green-{n}</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">Font Color - reds</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{[700].map(n => (
							<li className="guide__item" key={n}>
								<p className={`color-red--${n}`}>red-{n}</p>
								<code className="guide__code">className="color-red--{n}"</code>
								<code className="guide__code">color: $red-{n}</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">Font Color - yellows</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{[700].map(n => (
							<li className="guide__item" key={n}>
								<p className={`color-yellow--${n}`}>yellow-{n}</p>
								<code className="guide__code">className="color-yellow--{n}"</code>
								<code className="guide__code">color: $yellow-{n}</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">Font Color - black</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						<li className="guide__item">
							<p className="color-black">black</p>
							<code className="guide__code">className="color-black"</code>
							<code className="guide__code">color: $black</code>
						</li>
					</ul>
				</div>

				<h2 className="guide__title">Font Color - white</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						<li className="guide__item">
							<p className="color-white">white</p>
							<code className="guide__code">className="color-white"</code>
							<code className="guide__code">color: $white</code>
						</li>
					</ul>
				</div>

				<h2 className="guide__title">BG Color</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{$colors.map((c, i) => (
							<li className="guide__item" key={i}>
								<p className={`bg-${c}`}>{c}</p>
								<code className="guide__code">className={`bg-${c}`}</code>
								<code className="guide__code">background-color: map-get($colors, {c})</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">BG Color - grays</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{$num.map(n => (
							<li className="guide__item" key={n}>
								<p className={`bg-gray--${n}`}>gray-{n}</p>
								<code className="guide__code">className="bg-gray--{n}"</code>
								<code className="guide__code">background-color: $gray-{n}</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">BG Color - greens</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{[300, 600, 700, 900].map(n => (
							<li className="guide__item" key={n}>
								<p className={`bg-green--${n}`}>green-{n}</p>
								<code className="guide__code">className="bg-green--{n}"</code>
								<code className="guide__code">background-color: $green-{n}</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">BG Color - reds</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{[700].map(n => (
							<li className="guide__item" key={n}>
								<p className={`bg-red--${n}`}>red-{n}</p>
								<code className="guide__code">className="bg-red--{n}"</code>
								<code className="guide__code">background-color: $red-{n}</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">BG Color - yellows</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						{[700].map(n => (
							<li className="guide__item" key={n}>
								<p className={`bg-yellow--${n}`}>yellow-{n}</p>
								<code className="guide__code">className="bg-yellow--{n}"</code>
								<code className="guide__code">background-color: $yellow-{n}</code>
							</li>
						))}
					</ul>
				</div>

				<h2 className="guide__title">BG Color - black</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						<li className="guide__item">
							<p className="bg-black">black</p>
							<code className="guide__code">className="bg-black"</code>
							<code className="guide__code">background-color: $black</code>
						</li>
					</ul>
				</div>

				<h2 className="guide__title">BG Color - white</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						<li className="guide__item">
							<p className="bg-white">white</p>
							<code className="guide__code">className="bg-white"</code>
							<code className="guide__code">background-color: $white</code>
						</li>
					</ul>
				</div>

				<h2 className="guide__title">Body</h2>
				<div className="guide__group">
					<ul className="guide__list--column">
						<li className="guide__item">
							<p className="body-text">body-text</p>
							<code className="guide__code">className="body-text"</code>
							<code className="guide__code">color: $body-text</code>
						</li>
						<li className="guide__item">
							<p className="body-link">body-link</p>
							<code className="guide__code">className="body-link"</code>
							<code className="guide__code">color: $body-link</code>
						</li>
						<li className="guide__item">
							<p className="body-selected">body-selected</p>
							<code className="guide__code">className="body-selected"</code>
							<code className="guide__code">background-color: $body-selected</code>
						</li>
						<li className="guide__item">
							<p className="body-background">body-background</p>
							<code className="guide__code">className="body-background"</code>
							<code className="guide__code">background-color: $body-background</code>
						</li>
					</ul>
				</div>
			</section>
		</>
	);
};

export default Sample;
Sample.PublishingLayout = 'BLANK';
