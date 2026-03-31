/**
 * @file typography.tsx
 * @description 가이드 - 폰트 페이지
 */

const Sample = () => {
	return (
		<>
			<section className="guide__section">
				<h1 className="guide__hidden">Typography</h1>
				<h2 className="guide__title">Body</h2>
				<div className="guide__group">
					<ul className="guide__list-column">
						<li className="guide__item">
							<p className="font-body14-light">font-Body14-Light</p>
							<code className="guide__code">className="font-body14-light"</code>
							<code className="guide__code">@include fontBody14(300)</code>
						</li>
						<li className="guide__item">
							<p className="font-body14">font-body14</p>
							<code className="guide__code">className="font-body14"</code>
							<code className="guide__code">@include fontBody14(400)</code>
						</li>
						<li className="guide__item">
							<p className="font-body14-medium">font-body14-medium</p>
							<code className="guide__code">className="font-body14-medium"</code>
							<code className="guide__code">@include fontBody14(500)</code>
						</li>
						<li className="guide__item">
							<p className="font-body14-bold">font-body14-bold</p>
							<code className="guide__code">className="font-body14-bold"</code>
							<code className="guide__code">@include fontBody14(700)</code>
						</li>

						<li className="guide__item">
							<p className="font-body14-italic">font-body14-italic</p>
							<code className="guide__code">className="font-body14-italic"</code>
							<code className="guide__code">@include fontBody14(400, italic)</code>
						</li>
						<li className="guide__item">
							<p className="font-body14-underline">font-body14-underline</p>
							<code className="guide__code">className="font-body14-underline"</code>
							<code className="guide__code">@include fontBody14(400, normal, underline)</code>
						</li>
						<li className="guide__item">
							<p className="font-body14-strike">font-body14-strike</p>
							<code className="guide__code">className="font-body14-strike"</code>
							<code className="guide__code">@include fontBody14(400, normal, line-through)</code>
						</li>
						<li className="guide__item">
							<p className="font-body12">font-body12</p>
							<code className="guide__code">className="font-body12"</code>
							<code className="guide__code">@include fontBody12</code>
						</li>
						<li className="guide__item">
							<p className="font-body11">font-body11</p>
							<code className="guide__code">className="font-body11"</code>
							<code className="guide__code">@include fontBody11</code>
						</li>
						<li className="guide__item">
							<p className="font-body10">font-body10</p>
							<code className="guide__code">className="font-body10"</code>
							<code className="guide__code">@include fontBody10</code>
						</li>
						<li className="guide__item">
							<p className="font-body16">font-body16</p>
							<code className="guide__code">className="font-body16"</code>
							<code className="guide__code">@include fontBody16</code>
						</li>

						<li className="guide__item">
							<p className="font-body18">font-body18</p>
							<code className="guide__code">className="font-body18"</code>
							<code className="guide__code">@include fontBody18</code>
						</li>

						<li className="guide__item">
							<p className="font-body20">font-body20</p>
							<code className="guide__code">className="font-body20"</code>
							<code className="guide__code">@include fontBody20</code>
						</li>
						<li className="guide__item">
							<p className="font-body24">font-body24</p>
							<code className="guide__code">className="font-body24"</code>
							<code className="guide__code">@include fontBody24</code>
						</li>
						<li className="guide__item">
							<p className="font-body28">font-body28</p>
							<code className="guide__code">className="font-body28"</code>
							<code className="guide__code">@include fontBody28</code>
						</li>
					</ul>
				</div>

				<h2 className="guide__title">Headings</h2>
				<div className="guide__group">
					<ul className="guide__list-column">
						<li className="guide__item">
							<p className="font-heading-h1">font-heading-h1</p>
							<code className="guide__code">className="font-heading-h1"</code>
							<code className="guide__code">@include fontHeadings(h1)</code>
						</li>
						<li className="guide__item">
							<p className="font-heading-h2">font-heading-h2</p>
							<code className="guide__code">className="font-heading-h2"</code>
							<code className="guide__code">@include fontHeadings(h2)</code>
						</li>
						<li className="guide__item">
							<p className="font-heading-h3">font-heading-h3</p>
							<code className="guide__code">className="font-heading-h3"</code>
							<code className="guide__code">@include fontHeadings(h3)</code>
						</li>
						<li className="guide__item">
							<p className="font-heading-h4">font-heading-h4</p>
							<code className="guide__code">className="font-heading-h4"</code>
							<code className="guide__code">@include fontHeadings(h4)</code>
						</li>
						<li className="guide__item">
							<p className="font-heading-h5">font-heading-h5</p>
							<code className="guide__code">className="font-heading-h5"</code>
							<code className="guide__code">@include fontHeadings(h5)</code>
						</li>
						<li className="guide__item">
							<p className="font-heading-h6">font-heading-h6</p>
							<code className="guide__code">className="font-heading-h6"</code>
							<code className="guide__code">@include fontHeadings(h6)</code>
						</li>
					</ul>
				</div>
			</section>
		</>
	);
};

export default Sample;
Sample.PublishingLayout = 'BLANK';
