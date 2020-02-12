import React from 'react'
import Monthly from './Monthly'
import Today from './Today'
import PayPeriod from './PayPeriod'

export const TodayScreen = ({ navigation }) => <Today navigation={navigation} name="Today" />
export const PayPeriodScreen = ({ navigation }) => <PayPeriod navigation={navigation} name="Pay Period" />
export const MonthlyScreen = ({ navigation }) => <Monthly navigation={navigation} name="Monthly" />