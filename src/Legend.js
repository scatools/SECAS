import React from 'react';

const Legend = () => {
	return (
		<div class="legend">
			<div class="legend-title">Legend</div>
			<div class="legend-scale">
				<ul class="legend-labels">
					<li>
						<span style={{background:'#ACFFAD'}} />0~1
					</li>
					<li>
						<span style={{background:"#71EFA3"}} />1~2
					</li>
					<li>
						<span style={{background:"#50CB93"}} />2~3
					</li>
					<li>
						<span style={{background:"#54436B"}} />3~4
					</li>
				</ul>
			</div>
		</div>
	);
};
export default Legend;
