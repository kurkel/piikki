
var {
  StyleSheet,
} = require('react-native');

module.exports = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	col: {
		flexDirection: 'column',
	},
	footer: {
		flex: 0.1,
	},
	loginButtonColor: {
		backgroundColor: '#4BAF4F'
	},
	baseBackgroundColor: {
		backgroundColor: '#4BAE4F'
	},
	itemBackGroundColor: {
		elevation: 5,
		shadowColor: '#000000',
		shadowOffset: {width: 5, height: 5},
		shadowRadius: 2,
		backgroundColor: '#C8E6C9',
	}
});