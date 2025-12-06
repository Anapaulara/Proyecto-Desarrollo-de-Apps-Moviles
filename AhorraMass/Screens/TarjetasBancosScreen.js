import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import GlobalStyles from "../Styles/GlobalStyles";
// BottomMenu import removed

const mockCuentas = [
    { id: 1, banco: "Santander", tipo: "Cuenta de Ahorro", saldo: 25800.50, icon: "bank-outline", color: "#B80000" },
    { id: 2, banco: "BBVA", tipo: "Cuenta Corriente", saldo: 12500.00, icon: "bank-outline", color: "#000033" },
];

const mockTarjetas = [
    { id: 101, banco: "Santander", tipo: "Crédito", ultimosDigitos: "4567", icon: "credit-card-outline", color: "#B80000" },
    { id: 102, banco: "NuBank", tipo: "Débito", ultimosDigitos: "1234", icon: "credit-card-outline", color: "#9C27B0" },
];

const ItemCard = ({ item, esTarjeta }) => {
    const titulo = esTarjeta ? `${item.banco} (Tarjeta ${item.tipo})` : `${item.banco} (${item.tipo})`;
    const subtitulo = esTarjeta ? `Termina en: **** ${item.ultimosDigitos}` : `Saldo: $${item.saldo.toLocaleString('es-MX')}`;
    const iconName = esTarjeta ? "credit-card-settings-outline" : item.icon;

    return (
        <View style={styles.itemCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name={iconName} size={28} color={item.color} style={{ marginRight: 15 }} />
                <View>
                    <Text style={styles.itemCardTitle}>{titulo}</Text>
                    <Text style={styles.itemCardSubtitle}>{subtitulo}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Gestionar", `Gestionar ${titulo}`)}>
                <Ionicons name="chevron-forward-outline" size={24} color="#000033" />
            </TouchableOpacity>
        </View>
    );
};


const TarjetasBancosScreen = () => {
    const navigation = useNavigation();

    const totalActivos = mockCuentas.reduce((sum, c) => sum + c.saldo, 0);

    return (
        <View style={GlobalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000033" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tarjetas y Cuentas</Text>
                <Feather name="plus-circle" size={24} color="#000033" onPress={() => Alert.alert("Añadir", "Añadir nueva cuenta/tarjeta")} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} alwaysBounceVertical={false} >

                <View style={styles.totalCard}>
                    <Text style={styles.totalTitle}>Total de Activos Registrados</Text>
                    <Text style={styles.totalValue}>${totalActivos.toLocaleString('es-MX')}</Text>
                    <Text style={styles.totalFooter}>Este es el total disponible en tus cuentas registradas.</Text>
                </View>

                <Text style={styles.sectionTitle}>Cuentas Bancarias</Text>
                <View style={styles.sectionContainer}>
                    {mockCuentas.map(cuenta => (
                        <ItemCard key={cuenta.id} item={cuenta} esTarjeta={false} />
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Tarjetas (Crédito/Débito)</Text>
                <View style={styles.sectionContainer}>
                    {mockTarjetas.map(tarjeta => (
                        <ItemCard key={tarjeta.id} item={tarjeta} esTarjeta={true} />
                    ))}
                </View>
                <View style={{ height: 50 }} />
            </ScrollView>

            {/* BottomMenu removed */}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 45,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000033',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 150,
    },

    totalCard: {
        backgroundColor: '#000033',
        borderRadius: 15,
        padding: 20,
        marginVertical: 15,
        alignItems: 'center',
    },
    totalTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 5,
    },
    totalValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4BC0C0',
        marginBottom: 10,
    },
    totalFooter: {
        fontSize: 12,
        color: '#aaa',
        textAlign: 'center'
    },


    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#000033',
        marginTop: 15,
        marginBottom: 10,
    },
    sectionContainer: {
        backgroundColor: "#f2f2f2",
        borderRadius: 15,
        padding: 10,
    },

    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    itemCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000033',
    },
    itemCardSubtitle: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
});

export default TarjetasBancosScreen;