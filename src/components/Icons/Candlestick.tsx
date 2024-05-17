export function Candlestick({...props}) {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g opacity="0.12">
				<path
					d="M20 14C20 15 19 16 18 16H16C15 16 14 15 14 14V7C14 6 15 5 16 5H18C19 5 20 6 20 7V14Z"
					fill="black"
				/>
				<path
					d="M6 10C5 10 4 11 4 12V17C4 18 5 19 6 19H8C9 19 10 18 10 17V12C10 11 9 10 8 10H6Z"
					fill="black"
				/>
			</g>
			<path
				d="M7 19V22M7 5V10M17 16V20M17 2V5M6 10H8C9.10457 10 10 10.8954 10 12V17C10 18.1046 9.10457 19 8 19H6C4.89543 19 4 18.1046 4 17V12C4 10.8954 4.89543 10 6 10ZM16 5H18C19.1046 5 20 5.89543 20 7V14C20 15.1046 19.1046 16 18 16H16C14.8954 16 14 15.1046 14 14V7C14 5.89543 14.8954 5 16 5Z"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				{...props}
			/>
		</svg>
	);
}
