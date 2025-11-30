import { View, Text, StyleSheet } from 'react-native';

const GoalIndicator = ({ percentage }) => {
 return (
 <View style={stylesGoal.goalCircleContainer}>
 <Text style={stylesGoal.goalPercentage}>{percentage}%</Text>
</View>
 );
};

const GoalCard = ({ title, currentAmount, targetAmount, percentage }) => {
 return (
 <View style={stylesGoal.cardContainer}>
 <GoalIndicator percentage={percentage} />
 <View style={stylesGoal.textContainer}>
 <Text style={stylesGoal.titleText}>{title}</Text>
 <Text style={stylesGoal.amountText}>
 ${currentAmount} / ${targetAmount}
 </Text>
 </View>
</View>
 );
};

const stylesGoal = StyleSheet.create({
 cardContainer: {
 backgroundColor: '#f6f6f6ff',
 width: '90%',
 padding: 15,
 borderRadius: 15,
 flexDirection: 'row',
 alignItems: 'center',
 marginVertical: 8,
 elevation: 2,
 shadowColor: '#000',
 shadowOpacity: 0.1,
 shadowRadius: 3,
 },
  goalCircleContainer: {
 width: 60,
 height: 60,
 borderRadius: 30,
 borderWidth: 3,
 borderColor: '#0D074D',
 justifyContent: 'center',
 alignItems: 'center',
marginRight: 15,
},
 goalPercentage: {
 fontSize: 16,
 fontWeight: 'bold',
color: '#0D074D',
 },
 textContainer: {
 flex: 1,
 },
 titleText: {
 fontSize: 18,
 fontWeight: 'bold',
 color: '#333',
 marginBottom: 4,
},
 amountText: {
 fontSize: 14,
 color: '#666',
 },
});

export default GoalCard;