export const dataLayer = {
	'id': 'secas-data',
	'type': 'fill',
	'source': 'secas',
	'source-layer': 'Hex_mSE_blueprint_WGS84',
	'minzoom': 0,
	'maxzoom': 22,
};

export const dataLayerHightLight = {
	'id': 'secas-data-highlighted',
	'type': 'fill',
	'source': 'secas1',
	'source-layer': 'Hex_mSE_blueprint_WGS84',
	'paint': {
		'fill-outline-color': '#484896',
		'fill-color': '#6e599f',
		'fill-opacity': 0.75
	}
};
